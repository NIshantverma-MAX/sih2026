CREATE TABLE IF NOT EXISTS public.bis_demo_reference_records (
  id TEXT PRIMARY KEY,
  record_type TEXT NOT NULL CHECK (
    record_type IN ('huid_sample', 'laboratory_sample', 'prototype_standard_list', 'business_template')
  ),
  external_key TEXT,
  payload JSONB NOT NULL,
  provenance JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE CHECK (is_demo = TRUE),
  verification_status TEXT NOT NULL DEFAULT 'unverified_demo' CHECK (
    verification_status IN ('unverified_demo', 'reference_only')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.bis_demo_reference_records IS
  'User-supplied prototype fixtures. Never use this table as official BIS evidence or for HUID verification.';

ALTER TABLE public.bis_demo_reference_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read labeled bis demo records"
ON public.bis_demo_reference_records;

CREATE POLICY "public can read labeled bis demo records"
ON public.bis_demo_reference_records
FOR SELECT TO anon, authenticated
USING (is_demo = TRUE);

GRANT SELECT ON public.bis_demo_reference_records TO anon, authenticated;

INSERT INTO public.bis_demo_reference_records
  (id, record_type, external_key, payload, provenance, verification_status)
VALUES
  (
    'demo-huid-azx12345',
    'huid_sample',
    'AZX12345',
    '{"huid":"AZX12345","jewelleryType":"Ring","metal":"Gold","purity":"22K (916)","weight":"8.5 grams","hallmarkingCentre":"ABC Assaying and Hallmarking Centre","hallmarkingDate":"2026-08-15","jewellerName":"ABC Jewellers","jewellerRegistrationNumber":"BIS-JWL-12345"}'::JSONB,
    '{"origin":"user-supplied prototype JSON","claimedStatus":"Genuine","officialSource":false,"warning":"Not verified through BIS Care"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-huid-bkp67890',
    'huid_sample',
    'BKP67890',
    '{"huid":"BKP67890","jewelleryType":"Necklace","metal":"Gold","purity":"18K (750)","weight":"25.3 grams","hallmarkingCentre":"XYZ Hallmarking Centre","hallmarkingDate":"2026-07-20","jewellerName":"Golden Jewellers","jewellerRegistrationNumber":"BIS-JWL-67890"}'::JSONB,
    '{"origin":"user-supplied prototype JSON","claimedStatus":"Genuine","officialSource":false,"warning":"Not verified through BIS Care"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-huid-qwe45678',
    'huid_sample',
    'QWE45678',
    '{"huid":"QWE45678","jewelleryType":"Bracelet","metal":"Gold","purity":"22K (916)","weight":"12.7 grams","hallmarkingCentre":"National Assaying Centre","hallmarkingDate":"2026-06-10","jewellerName":"Royal Gold Jewellers","jewellerRegistrationNumber":"BIS-JWL-45678"}'::JSONB,
    '{"origin":"user-supplied prototype JSON","claimedStatus":"Genuine","officialSource":false,"warning":"Not verified through BIS Care"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-huid-a1b2c3',
    'huid_sample',
    'A1B2C3',
    '{"huid":"A1B2C3","item":"Gold Ring","purity":"22K916","jewellerName":"Sample Jewellers","city":"Mumbai"}'::JSONB,
    '{"origin":"user-supplied hackathon dataset","claimedStatus":"Valid","officialSource":false,"warning":"Explicit sample record"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-huid-d4e5f6',
    'huid_sample',
    'D4E5F6',
    '{"huid":"D4E5F6","item":"Gold Chain","purity":"18K750","jewellerName":"Demo Gold House","city":"Delhi"}'::JSONB,
    '{"origin":"user-supplied hackathon dataset","claimedStatus":"Valid","officialSource":false,"warning":"Explicit sample record"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-lab-lab001',
    'laboratory_sample',
    'LAB001',
    '{"name":"National Quality Testing Laboratory","city":"New Delhi","state":"Delhi","services":"Gold purity testing, product sample testing"}'::JSONB,
    '{"origin":"user-supplied hackathon dataset","claimedStatus":"BIS Recognized","officialSource":false,"warning":"Laboratory identity not confirmed in BIS LIMS"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-lab-lab002',
    'laboratory_sample',
    'LAB002',
    '{"name":"Indian Assay and Testing Centre","city":"Mumbai","state":"Maharashtra","services":"Jewellery testing, hallmark verification"}'::JSONB,
    '{"origin":"user-supplied hackathon dataset","claimedStatus":"BIS Recognized","officialSource":false,"warning":"Laboratory identity not confirmed in BIS LIMS"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-lab-lab003',
    'laboratory_sample',
    'LAB003',
    '{"name":"South India Standards Testing Lab","city":"Chennai","state":"Tamil Nadu","services":"Gold, silver and consumer product testing"}'::JSONB,
    '{"origin":"user-supplied hackathon dataset","claimedStatus":"BIS Recognized","officialSource":false,"warning":"Laboratory identity not confirmed in BIS LIMS"}'::JSONB,
    'unverified_demo'
  ),
  (
    'demo-prototype-standard-list',
    'prototype_standard_list',
    'user-standard-list-2026-08-31',
    '{"records":[{"keyword":"helmet","standard":"IS 4151:1993"},{"keyword":"cement","standard":"IS 269:2015"},{"keyword":"steel bar","standard":"IS 1786:2008"},{"keyword":"drinking water","standard":"IS 10500:2012"},{"keyword":"packaged water","standard":"IS 14543:2016"},{"keyword":"pressure cooker","standard":"IS 2347:2017"},{"keyword":"toy","standard":"IS 9873"},{"keyword":"plug","standard":"IS 1293:2005"},{"keyword":"electric cable","standard":"IS 694:2010"},{"keyword":"switch","standard":"IS 3854:1997"},{"keyword":"brick","standard":"IS 1077:1992"},{"keyword":"concrete","standard":"IS 456:2000"},{"keyword":"sand","standard":"IS 383:2016"},{"keyword":"earthquake","standard":"IS 1893"},{"keyword":"milk powder","standard":"IS 1165:2002"},{"keyword":"iodized salt","standard":"IS 7224:2006"},{"keyword":"laptop","standard":"IS 13252"},{"keyword":"television","standard":"IS 616:2017"},{"keyword":"cfl bulb","standard":"IS 15633:2005"},{"keyword":"feeding bottle","standard":"IS 14625:2015"}]}'::JSONB,
    '{"origin":"user-supplied JSON","officialSource":false,"warning":"Reference input only; several revisions are stale or incorrect. Official corpus takes precedence."}'::JSONB,
    'reference_only'
  ),
  (
    'demo-jewellery-business-template',
    'business_template',
    'bis-smartguide-jewellery-business-data',
    '{"dataset":"BIS SmartGuide - Jewellery Business Data","sections":["customers","suppliers","inventory","sales","pricing","quality","compliance","reporting"],"purpose":"Hackathon UI and workflow prototyping"}'::JSONB,
    '{"origin":"user-supplied JSON template","officialSource":false,"warning":"Business template, not a BIS record"}'::JSONB,
    'reference_only'
  )
ON CONFLICT (id) DO UPDATE
SET payload = EXCLUDED.payload,
    provenance = EXCLUDED.provenance,
    verification_status = EXCLUDED.verification_status,
    updated_at = NOW();

INSERT INTO public.bis_source_documents
  (id, title, document_name, url, source_type, official_domain, last_checked, metadata)
VALUES
  (
    'bis-current-helmet-is-4151-2015',
    'IS 4151:2015 - Protective helmets for motorcycle riders',
    'BIS consumer summary for IS 4151:2015',
    'https://www.services.bis.gov.in/tmp/tbl5_2024-11-12-01-36.pdf',
    'standard',
    'services.bis.gov.in',
    '2026-08-31',
    '{"topic":"motorcycle helmets","dataFreshness":"static official summary"}'::JSONB
  ),
  (
    'bis-current-packaged-water-is-14543-2024',
    'Implementation guidelines for revised IS 14543:2024',
    'BIS CMD-2 implementation circular for IS 14543:2024',
    'https://www.services.bis.gov.in/tmp/Circular_5mE4_2024-07-15.pdf',
    'guideline',
    'services.bis.gov.in',
    '2026-08-31',
    '{"topic":"packaged drinking water","dataFreshness":"static implementation circular"}'::JSONB
  ),
  (
    'bis-current-plugs-is-1293-2019',
    'Implementation guidelines for IS 1293:2019 Amendment 2',
    'BIS CMD-III implementation circular for IS 1293:2019',
    'https://www.services.bis.gov.in/tmp/Circular_g3Gq_2024-05-29.pdf',
    'guideline',
    'services.bis.gov.in',
    '2026-08-31',
    '{"topic":"plugs and socket-outlets","dataFreshness":"static implementation circular"}'::JSONB
  ),
  (
    'bis-current-switches-is-3854-2023',
    'BIS LIMS facilities for IS 3854:2023',
    'BIS LIMS search for IS 3854',
    'https://lims.bis.gov.in/home/search_is_number/?is_number__doc_no=3854',
    'website',
    'lims.bis.gov.in',
    '2026-08-31',
    '{"topic":"domestic switches","dataFreshness":"live LIMS record"}'::JSONB
  ),
  (
    'bis-current-milk-powder-is-1165-2022',
    'IS 1165:2022 - Whole Milk Powder',
    'BIS consumer summary for IS 1165:2022',
    'https://www.services.bis.gov.in/tmp/tbl5_2024-11-08_1110.pdf',
    'standard',
    'services.bis.gov.in',
    '2026-08-31',
    '{"topic":"whole milk powder","dataFreshness":"static official summary"}'::JSONB
  ),
  (
    'bis-current-pressure-cooker-is-2347-2023',
    'Implementation guidelines for revised IS 2347:2023',
    'BIS CMD-III implementation circular for IS 2347:2023',
    'https://www.services.bis.gov.in/tmp/Circular_WgOB_2023-10-26.pdf',
    'guideline',
    'services.bis.gov.in',
    '2026-08-31',
    '{"topic":"domestic pressure cooker","dataFreshness":"static implementation circular"}'::JSONB
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

DELETE FROM public.bis_source_chunks
WHERE document_id IN (
  'bis-current-helmet-is-4151-2015',
  'bis-current-packaged-water-is-14543-2024',
  'bis-current-plugs-is-1293-2019',
  'bis-current-switches-is-3854-2023',
  'bis-current-milk-powder-is-1165-2022',
  'bis-current-pressure-cooker-is-2347-2023'
);

INSERT INTO public.bis_source_chunks
  (id, document_id, section, page, chunk_text, keywords, metadata)
VALUES
  (
    'bis-update-helmet-is-4151-2015',
    'bis-current-helmet-is-4151-2015',
    'Standard summary',
    1,
    'The official BIS summary identifies IS 4151:2015 as the Indian Standard for protective helmets for motorcycle riders and states that BIS certification is mandatory for the product under the 2020 Quality Control Order.',
    ARRAY['helmet', 'motorcycle helmet', 'two wheeler helmet', 'IS 4151', 'IS 4151:2015']::TEXT[],
    '{"recordKind":"standard_update","product":"Protective helmets for motorcycle riders","standardNumber":"IS 4151:2015","standardTitle":"Protective helmets for motorcycle riders","label":"Current official record","value":"IS 4151:2015"}'::JSONB
  ),
  (
    'bis-update-packaged-water-is-14543-2024',
    'bis-current-packaged-water-is-14543-2024',
    'Implementation status',
    2,
    'BIS states that IS 14543:2016 was revised as IS 14543:2024 for packaged drinking water. The old standard stood withdrawn after 15 September 2024.',
    ARRAY['packaged water', 'packaged drinking water', 'IS 14543', 'IS 14543:2016', 'IS 14543:2024']::TEXT[],
    '{"recordKind":"standard_update","product":"Packaged drinking water","standardNumber":"IS 14543:2024","standardTitle":"Packaged Drinking Water (other than Packaged Natural Mineral Water) - Specification","label":"Revised standard","value":"IS 14543:2024"}'::JSONB
  ),
  (
    'bis-update-plugs-is-1293-2019',
    'bis-current-plugs-is-1293-2019',
    'Implementation status',
    2,
    'The official BIS implementation circular identifies IS 1293:2019 for plugs and socket-outlets for household and similar purposes and covers Amendment 2 implementation.',
    ARRAY['plug', 'socket', 'plugs and socket outlets', 'IS 1293', 'IS 1293:2005', 'IS 1293:2019']::TEXT[],
    '{"recordKind":"standard_update","product":"Plugs and socket-outlets for household and similar purposes","standardNumber":"IS 1293:2019","standardTitle":"Plugs and Socket-Outlets for household and similar purposes","label":"Current official record","value":"IS 1293:2019"}'::JSONB
  ),
  (
    'bis-update-switches-is-3854-2023',
    'bis-current-switches-is-3854-2023',
    'Live laboratory record',
    NULL,
    'The live BIS LIMS record identifies IS 3854:2023 as Switches for Domestic and Similar Purposes - Specification (Third Revision).',
    ARRAY['switch', 'domestic switch', 'electrical switch', 'IS 3854', 'IS 3854:1997', 'IS 3854:2023']::TEXT[],
    '{"recordKind":"standard_update","product":"Switches for Domestic and Similar Purposes","standardNumber":"IS 3854:2023","standardTitle":"Switches for Domestic and Similar Purposes - Specification (Third Revision)","label":"Current LIMS record","value":"IS 3854:2023"}'::JSONB
  ),
  (
    'bis-update-milk-powder-is-1165-2022',
    'bis-current-milk-powder-is-1165-2022',
    'Standard summary',
    1,
    'The official BIS summary identifies IS 1165:2022 as the specification for whole milk powder.',
    ARRAY['milk powder', 'whole milk powder', 'IS 1165', 'IS 1165:2002', 'IS 1165:2022']::TEXT[],
    '{"recordKind":"standard_update","product":"Whole milk powder","standardNumber":"IS 1165:2022","standardTitle":"Whole Milk Powder - Specification","label":"Current official record","value":"IS 1165:2022"}'::JSONB
  ),
  (
    'bis-update-pressure-cooker-is-2347-2023',
    'bis-current-pressure-cooker-is-2347-2023',
    'Implementation status',
    1,
    'The official BIS implementation circular states that IS 2347:2017 was revised and published as IS 2347:2023 for domestic pressure cookers.',
    ARRAY['pressure cooker', 'domestic pressure cooker', 'IS 2347', 'IS 2347:2017', 'IS 2347:2023']::TEXT[],
    '{"recordKind":"standard_update","product":"Domestic pressure cooker","standardNumber":"IS 2347:2023","standardTitle":"Domestic Pressure Cooker - Specification","label":"Revised standard","value":"IS 2347:2023"}'::JSONB
  );

INSERT INTO public.bis_source_chunks
  (id, document_id, section, chunk_text, keywords, metadata)
VALUES
  ('bis-lims-is1417-nrl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Northern Regional Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Northern Regional Laboratory', 'NRL', 'gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Northern Regional Laboratory"}'::JSONB),
  ('bis-lims-is1417-bnbl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Bengaluru Branch Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Bengaluru Branch Laboratory', 'BNBL', 'Bangalore gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Bengaluru Branch Laboratory"}'::JSONB),
  ('bis-lims-is1417-cl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Central Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Central Laboratory', 'CL', 'Ghaziabad gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Central Laboratory"}'::JSONB),
  ('bis-lims-is1417-hybl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Hyderabad Branch Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Hyderabad Branch Laboratory', 'HYBL', 'Hyderabad gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Hyderabad Branch Laboratory"}'::JSONB),
  ('bis-lims-is1417-wrl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Western Regional Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Western Regional Laboratory', 'WRL', 'Mumbai gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Western Regional Laboratory"}'::JSONB),
  ('bis-lims-is1417-jkbl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Jammu Kashmir Branch Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Jammu Kashmir Branch Laboratory', 'JKBL', 'Jammu gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Jammu Kashmir Branch Laboratory"}'::JSONB),
  ('bis-lims-is1417-pbl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Patna Branch Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Patna Branch Laboratory', 'PBL', 'Patna gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Patna Branch Laboratory"}'::JSONB),
  ('bis-lims-is1417-srl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Southern Regional Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Southern Regional Laboratory', 'SRL', 'gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Southern Regional Laboratory"}'::JSONB),
  ('bis-lims-is1417-erl', 'bis-lims-is-1417', 'Laboratory', 'BIS LIMS lists BIS Eastern Regional Laboratory for facilities related to IS 1417:2016. Open the live record to confirm current scope and availability.', ARRAY['Eastern Regional Laboratory', 'ERL', 'gold testing laboratory', 'IS 1417']::TEXT[], '{"recordKind":"laboratory_fact","standardNumber":"IS 1417:2016","label":"Laboratory","value":"BIS Eastern Regional Laboratory"}'::JSONB)
ON CONFLICT (id) DO UPDATE
SET section = EXCLUDED.section,
    chunk_text = EXCLUDED.chunk_text,
    keywords = EXCLUDED.keywords,
    metadata = EXCLUDED.metadata;

UPDATE public.bis_source_documents
SET metadata = metadata || jsonb_build_object(
  'owner', 'Bureau of Indian Standards',
  'publisher', 'Bureau of Indian Standards',
  'authority', 'official',
  'officialSource', TRUE,
  'sourceHost', official_domain,
  'contentType', CASE WHEN url ILIKE '%.pdf%' THEN 'application/pdf' ELSE 'text/html' END,
  'provenance', CASE
    WHEN official_domain = 'lims.bis.gov.in' THEN 'official_lims'
    WHEN url ILIKE '%.pdf%' THEN 'official_pdf'
    ELSE 'official_web_page'
  END,
  'retrievalPolicy', 'official_only',
  'ingestionStatus', 'indexed',
  'checkedAt', last_checked,
  'locale', 'en-IN'
);

UPDATE public.bis_source_chunks AS chunk
SET metadata = chunk.metadata || jsonb_build_object(
  'authority', 'official',
  'officialSource', TRUE,
  'retrievalPolicy', 'official_only',
  'documentId', chunk.document_id,
  'sourceUrl', document.url,
  'lastChecked', document.last_checked
)
FROM public.bis_source_documents AS document
WHERE document.id = chunk.document_id;
