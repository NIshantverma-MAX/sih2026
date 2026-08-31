DROP FUNCTION IF EXISTS public.match_bis_source_chunks(TEXT, INT, REAL);

CREATE FUNCTION public.match_bis_source_chunks(
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
  keywords TEXT[],
  metadata JSONB,
  rank REAL
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  WITH normalized AS (
    SELECT NULLIF(
      TRIM(regexp_replace(COALESCE(search_query, ''), '[^[:alnum:]]+', ' ', 'g')),
      ''
    ) AS value
  ),
  query AS (
    SELECT websearch_to_tsquery(
      'english',
      regexp_replace(normalized.value, '[[:space:]]+', ' OR ', 'g')
    ) AS value
    FROM normalized
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
    scored.keywords,
    scored.metadata,
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
      chunk.keywords,
      chunk.metadata,
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
  ORDER BY scored.rank DESC, scored.title ASC, scored.chunk_id ASC
  LIMIT LEAST(GREATEST(match_count, 1), 50);
$$;

GRANT EXECUTE ON FUNCTION public.match_bis_source_chunks(TEXT, INT, REAL)
TO anon, authenticated;
