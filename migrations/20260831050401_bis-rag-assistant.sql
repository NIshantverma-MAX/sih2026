CREATE TABLE IF NOT EXISTS public.bis_source_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  document_name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN ('standard', 'regulation', 'guideline', 'notification', 'website')
  ),
  official_domain TEXT NOT NULL,
  last_checked DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bis_source_chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES public.bis_source_documents(id) ON DELETE CASCADE,
  section TEXT,
  clause TEXT,
  page INT,
  chunk_text TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  search_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bis_assistant_query_logs (
  id BIGSERIAL PRIMARY KEY,
  question_hash CHAR(64) NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi')),
  answer_status TEXT NOT NULL CHECK (answer_status IN ('answered', 'refused', 'error')),
  source_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  model TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bis_assistant_rate_limits (
  client_hash CHAR(64) PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INT NOT NULL DEFAULT 1 CHECK (request_count > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bis_assistant_query_logs_created_at_idx
ON public.bis_assistant_query_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS bis_source_documents_active_idx
ON public.bis_source_documents (is_active);

CREATE INDEX IF NOT EXISTS bis_source_chunks_document_id_idx
ON public.bis_source_chunks (document_id);

CREATE OR REPLACE FUNCTION public.set_bis_source_chunk_search_text()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.search_text = concat_ws(
    ' ',
    NEW.section,
    NEW.clause,
    NEW.chunk_text,
    array_to_string(NEW.keywords, ' ')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_bis_source_chunk_search_text
ON public.bis_source_chunks;

CREATE TRIGGER set_bis_source_chunk_search_text
BEFORE INSERT OR UPDATE OF section, clause, chunk_text, keywords
ON public.bis_source_chunks
FOR EACH ROW
EXECUTE FUNCTION public.set_bis_source_chunk_search_text();

CREATE INDEX IF NOT EXISTS bis_source_chunks_search_idx
ON public.bis_source_chunks
USING GIN (
  to_tsvector('english'::regconfig, search_text)
);

ALTER TABLE public.bis_source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bis_source_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bis_assistant_query_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bis_assistant_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read active bis source documents" ON public.bis_source_documents;
CREATE POLICY "public can read active bis source documents"
ON public.bis_source_documents
FOR SELECT TO anon, authenticated
USING (is_active = TRUE);

DROP POLICY IF EXISTS "public can read active bis source chunks" ON public.bis_source_chunks;
CREATE POLICY "public can read active bis source chunks"
ON public.bis_source_chunks
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.bis_source_documents document
    WHERE document.id = bis_source_chunks.document_id
      AND document.is_active = TRUE
  )
);

GRANT SELECT ON public.bis_source_documents TO anon, authenticated;
GRANT SELECT ON public.bis_source_chunks TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.match_bis_source_chunks(
  search_query TEXT,
  match_count INT DEFAULT 6,
  min_rank REAL DEFAULT 0.01
)
RETURNS TABLE (
  chunk_id TEXT,
  document_id TEXT,
  title TEXT,
  document_name TEXT,
  url TEXT,
  source_type TEXT,
  section TEXT,
  clause TEXT,
  page INT,
  snippet TEXT,
  rank REAL
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  WITH query AS (
    SELECT websearch_to_tsquery(
      'english',
      regexp_replace(NULLIF(TRIM(search_query), ''), '[[:space:]]+', ' OR ', 'g')
    ) AS value
  )
  SELECT
    scored.chunk_id,
    scored.document_id,
    scored.title,
    scored.document_name,
    scored.url,
    scored.source_type,
    scored.section,
    scored.clause,
    scored.page,
    scored.snippet,
    scored.rank
  FROM query
  JOIN LATERAL (
    SELECT
      chunk.id AS chunk_id,
      document.id AS document_id,
      document.title,
      document.document_name,
      document.url,
      document.source_type,
      chunk.section,
      chunk.clause,
      chunk.page,
      chunk.chunk_text AS snippet,
      ts_rank_cd(
        to_tsvector('english'::regconfig, chunk.search_text),
        query.value
      ) AS rank
    FROM public.bis_source_chunks chunk
    JOIN public.bis_source_documents document ON document.id = chunk.document_id
    WHERE to_tsvector('english'::regconfig, chunk.search_text) @@ query.value
      AND document.is_active = TRUE
  ) scored ON query.value IS NOT NULL
  WHERE scored.rank >= min_rank
  ORDER BY scored.rank DESC, scored.title ASC
  LIMIT LEAST(GREATEST(match_count, 1), 12);
$$;

GRANT EXECUTE ON FUNCTION public.match_bis_source_chunks(TEXT, INT, REAL)
TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_bis_assistant_rate_limit(
  p_client_hash CHAR(64),
  p_request_limit INT DEFAULT 12,
  p_window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count INT;
BEGIN
  IF p_client_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Invalid client hash';
  END IF;

  p_request_limit := LEAST(GREATEST(p_request_limit, 1), 120);
  p_window_seconds := LEAST(GREATEST(p_window_seconds, 10), 3600);

  INSERT INTO public.bis_assistant_rate_limits AS limits
    (client_hash, window_started_at, request_count, updated_at)
  VALUES (p_client_hash, NOW(), 1, NOW())
  ON CONFLICT (client_hash) DO UPDATE
  SET request_count = CASE
        WHEN limits.window_started_at <= NOW() - make_interval(secs => p_window_seconds)
          THEN 1
        ELSE limits.request_count + 1
      END,
      window_started_at = CASE
        WHEN limits.window_started_at <= NOW() - make_interval(secs => p_window_seconds)
          THEN NOW()
        ELSE limits.window_started_at
      END,
      updated_at = NOW()
  RETURNING request_count INTO current_count;

  RETURN current_count <= p_request_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_bis_assistant_rate_limit(CHAR, INT, INT)
FROM PUBLIC, anon, authenticated;

INSERT INTO public.bis_source_documents
  (id, title, document_name, url, source_type, official_domain, last_checked, metadata)
VALUES
  (
    'bis-home-national-standards-body',
    'BIS: National Standards Body of India',
    'BIS official website',
    'https://www.bis.gov.in/?lang=en',
    'website',
    'bis.gov.in',
    '2026-08-31',
    '{"owner":"Bureau of Indian Standards"}'
  ),
  (
    'bis-product-certification-overview',
    'Product Certification Overview',
    'BIS Product Certification Overview',
    'https://www.bis.gov.in/product-certification/product-certification-overview/?lang=en',
    'guideline',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"product certification"}'
  ),
  (
    'bis-products-under-compulsory-certification',
    'Products under Compulsory Certification',
    'BIS Products under Compulsory Certification',
    'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en',
    'regulation',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"compulsory certification and QCOs"}'
  ),
  (
    'bis-scheme-ii-registration-led',
    'Scheme-II Registration Scheme',
    'BIS Scheme-II Registration Scheme',
    'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en',
    'regulation',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"CRS electronics and IT goods"}'
  ),
  (
    'bis-product-certification-process',
    'Product Certification Process',
    'BIS Product Certification Process',
    'https://www.bis.gov.in/product-certification/product-certification-process/?lang=en',
    'guideline',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"certification process"}'
  ),
  (
    'bis-product-certification-faq',
    'Product Certification FAQ',
    'BIS Product Certification FAQ',
    'https://www.bis.gov.in/product-certification/product-certification-faq/?lang=en',
    'website',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"certification FAQ"}'
  ),
  (
    'bis-hallmarking-overview',
    'Hallmarking Overview',
    'BIS Hallmarking Overview',
    'https://www.bis.gov.in/hallmarking-overview/?lang=en',
    'guideline',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"hallmarking"}'
  ),
  (
    'bis-huid-consumer-protection',
    'Hallmarking Consumer Protection and HUID Verification',
    'BIS Hallmarking Consumer Protection',
    'https://www.bis.gov.in/hallmarking-overview/consumer-protection/?lang=en',
    'guideline',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"HUID verification"}'
  ),
  (
    'bis-lab-services',
    'BIS Laboratory Services',
    'BIS Laboratory Services',
    'https://www.bis.gov.in/laboratorys/utrf/?lang=en',
    'website',
    'bis.gov.in',
    '2026-08-31',
    '{"topic":"laboratory services"}'
  )
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    document_name = EXCLUDED.document_name,
    url = EXCLUDED.url,
    source_type = EXCLUDED.source_type,
    official_domain = EXCLUDED.official_domain,
    last_checked = EXCLUDED.last_checked,
    is_active = TRUE,
    metadata = EXCLUDED.metadata;

INSERT INTO public.bis_source_chunks
  (id, document_id, section, clause, page, chunk_text, keywords)
VALUES
  (
    'bis-home-purpose',
    'bis-home-national-standards-body',
    'BIS role',
    NULL,
    NULL,
    'BIS identifies itself as the National Standards Body of India. It develops and publishes Indian Standards, implements conformity assessment schemes, recognises and runs laboratories for conformity assessment, implements hallmarking, supports consumer empowerment and capacity building, and represents India in ISO and IEC.',
    ARRAY['bis', 'bureau of indian standards', 'national standards body', 'indian standards', 'conformity assessment', 'laboratories', 'hallmarking', 'consumer']
  ),
  (
    'bis-certification-voluntary-compulsory',
    'bis-product-certification-overview',
    'Certification requirement',
    NULL,
    NULL,
    'BIS states that product certification is basically voluntary in nature. Compliance with Indian Standards is made compulsory for certain products by the Central Government under considerations such as public interest, protection of health, environmental safety, prevention of unfair trade practices, and national security.',
    ARRAY['certification', 'mandatory', 'voluntary', 'compulsory', 'central government', 'qco', 'quality control order']
  ),
  (
    'bis-compulsory-certification-schemes',
    'bis-products-under-compulsory-certification',
    'Products under compulsory certification',
    NULL,
    NULL,
    'The BIS page for products under compulsory certification links to Quality Control Order guidance and organizes compulsory products under Scheme-I Mark Scheme, Scheme-II Registration Scheme, Scheme-IV Certificate of Conformity, and Scheme-X Certification.',
    ARRAY['compulsory certification', 'scheme i', 'scheme ii', 'scheme iv', 'scheme x', 'isi mark', 'registration scheme', 'certificate of conformity']
  ),
  (
    'bis-led-lamps-crs',
    'bis-scheme-ii-registration-led',
    'Electronics and IT Goods under Compulsory Registration Scheme',
    NULL,
    NULL,
    'Under Scheme-II Registration Scheme for Electronics and IT Goods, BIS lists IS 16102 Part 1 for Self-Ballasted LED Lamps for General Lighting Services, Part 1 Safety Requirements.',
    ARRAY['led', 'led bulb', 'led lamp', 'self-ballasted led lamps', 'is 16102', 'scheme ii', 'crs', 'registration scheme', 'electronics']
  ),
  (
    'bis-certification-process-scheme-i',
    'bis-product-certification-process',
    'Product certification process',
    NULL,
    NULL,
    'The BIS product certification process page links Scheme-I of BIS Conformity Assessment Regulations, 2018 for the product certification scheme for use of the ISI mark.',
    ARRAY['product certification process', 'scheme i', 'isi mark', 'conformity assessment regulations', 'licence']
  ),
  (
    'bis-certification-validity',
    'bis-product-certification-faq',
    'Licence validity',
    NULL,
    NULL,
    'The BIS Product Certification FAQ states that BIS certification under Scheme-I may initially be granted up to two years and is valid only for the varieties mentioned in the licence.',
    ARRAY['licence validity', 'scheme i', 'product certification faq', 'two years', 'varieties']
  ),
  (
    'bis-hallmarking-definition',
    'bis-hallmarking-overview',
    'Hallmarking definition',
    NULL,
    NULL,
    'BIS describes hallmarking as the accurate determination and official recording of the proportionate content of precious metal in precious metal articles. BIS states that hallmarks guarantee purity or fineness and the scheme protects consumers against adulteration.',
    ARRAY['hallmarking', 'gold', 'silver', 'precious metal', 'purity', 'fineness', 'adulteration']
  ),
  (
    'bis-hallmarking-jeweller-registration',
    'bis-hallmarking-overview',
    'Jeweller registration',
    NULL,
    NULL,
    'BIS says jewellers willing to sell hallmarked gold and silver jewellery or artefacts shall apply online in the BIS portal. The page states that registration is granted instantly without uploading documents or paying fees and remains valid for lifetime.',
    ARRAY['jeweller registration', 'hallmarked jewellery', 'gold jewellery', 'silver jewellery', 'manakonline', 'lifetime']
  ),
  (
    'bis-huid-verification',
    'bis-huid-consumer-protection',
    'Consumer HUID verification',
    NULL,
    NULL,
    'BIS says the BIS Care official mobile application provides a Verify HUID feature that consumers can use to verify the authenticity and purity of hallmarked gold jewellery items bearing a HUID number before purchase.',
    ARRAY['huid', 'verify huid', 'bis care app', 'hallmarked jewellery', 'consumer protection', 'purity']
  ),
  (
    'bis-lab-utrf',
    'bis-lab-services',
    'Uniform Test Report Formats',
    NULL,
    NULL,
    'BIS provides Uniform Test Report Formats to be used by recognized laboratories for issuing test reports under the Compulsory Registration Scheme.',
    ARRAY['laboratory', 'recognized laboratories', 'test report', 'uniform test report format', 'compulsory registration scheme', 'testing']
  )
ON CONFLICT (id) DO UPDATE
SET document_id = EXCLUDED.document_id,
    section = EXCLUDED.section,
    clause = EXCLUDED.clause,
    page = EXCLUDED.page,
    chunk_text = EXCLUDED.chunk_text,
    keywords = EXCLUDED.keywords;
