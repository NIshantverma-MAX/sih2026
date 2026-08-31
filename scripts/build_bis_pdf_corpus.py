#!/usr/bin/env python3
"""Build the BIS PDF corpus migration from official annexure tables."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import pdfplumber


ANNEXURE_1_DOCUMENT_ID = "bis-major-consumer-products-annexure-1"
ANNEXURE_2_DOCUMENT_ID = "bis-major-consumer-products-annexure-2"


@dataclass(frozen=True)
class ProductRecord:
    document_id: str
    sequence: int
    category: str
    product: str
    standard_number: str
    standard_title: str
    page: int


def clean(value: str | None) -> str:
    normalized = (value or "").replace("≤", "<=").replace("≥", ">=")
    normalized = normalized.replace("–", "-").replace("—", "-").replace("‰", " per mille")
    normalized = unicodedata.normalize("NFKD", normalized).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", normalized).strip()


def sql_text(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def sql_json(value: dict[str, object]) -> str:
    return sql_text(json.dumps(value, ensure_ascii=True, separators=(",", ":"))) + "::jsonb"


def sql_array(values: list[str]) -> str:
    return "ARRAY[" + ", ".join(sql_text(value) for value in values) + "]::TEXT[]"


def source_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_annexure_1(path: Path) -> list[ProductRecord]:
    records: list[ProductRecord] = []
    current_category = ""

    with pdfplumber.open(path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            table = page.extract_table()
            if not table:
                continue

            for row in table[1:]:
                if not row or len(row) < 5:
                    continue

                category = clean(row[1])
                if category:
                    current_category = category

                sequence_text = clean(row[2])
                if not sequence_text.isdigit():
                    continue

                standard_number = clean(row[3])
                product = clean(row[4])
                if not standard_number or not product:
                    continue

                records.append(ProductRecord(
                    document_id=ANNEXURE_1_DOCUMENT_ID,
                    sequence=int(sequence_text),
                    category=current_category or "Unspecified",
                    product=product,
                    standard_number=standard_number,
                    standard_title=product,
                    page=page_number,
                ))

    return records


def parse_annexure_2(path: Path) -> list[ProductRecord]:
    records: list[ProductRecord] = []
    current_category = ""

    with pdfplumber.open(path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            table = page.extract_table()
            if not table:
                continue

            for row in table[1:]:
                if not row or len(row) < 6:
                    continue

                category = clean(row[1])
                if category:
                    current_category = category

                sequence_text = clean(row[2])
                if not sequence_text.isdigit():
                    continue

                product = clean(row[3])
                standard_number = clean(row[4])
                standard_title = clean(row[5])
                if not product or not standard_number or not standard_title:
                    continue

                records.append(ProductRecord(
                    document_id=ANNEXURE_2_DOCUMENT_ID,
                    sequence=int(sequence_text),
                    category=current_category or "Unspecified",
                    product=product,
                    standard_number=standard_number,
                    standard_title=standard_title,
                    page=page_number,
                ))

    return records


def synonyms_for(record: ProductRecord) -> list[str]:
    searchable = f"{record.product} {record.standard_title}".lower()
    synonyms: list[str] = []
    mappings = {
        "helmet": ["helmet", "two wheeler helmet", "motorcycle helmet"],
        "power adaptor": ["charger", "power adapter", "mobile charger", "laptop charger"],
        "steel bars": ["steel bar", "tmt bar", "reinforcement bar"],
        "pressure cooker": ["cooker"],
        "feeding bottle": ["baby bottle"],
        "plugs and socket": ["plug", "socket"],
        "pvc insulated cables": ["electric cable", "electrical cable", "wire"],
        "switches for domestic": ["electric switch", "domestic switch"],
        "toy": ["children toy", "childrens toy"],
        "laptop": ["notebook", "tablet"],
        "television": ["tv"],
        "cement": ["cement"],
    }

    for phrase, values in mappings.items():
        if phrase in searchable:
            synonyms.extend(values)

    return list(dict.fromkeys(synonyms))


def product_values(record: ProductRecord) -> str:
    chunk_id = f"{record.document_id}-{record.sequence:03d}"
    title_detail = (
        f" Standard title: {record.standard_title}."
        if record.standard_title.casefold() != record.product.casefold()
        else ""
    )
    chunk_text = (
        f"Official BIS compulsory-marking entry. Product: {record.product}. "
        f"Indian Standard: {record.standard_number}. Category: {record.category}."
        f"{title_detail}"
    )
    keywords = [
        record.product,
        record.standard_number,
        record.standard_title,
        record.category,
        "compulsory marking",
        *synonyms_for(record),
    ]
    metadata = {
        "recordKind": "compulsory_product",
        "product": record.product,
        "standardNumber": record.standard_number,
        "standardTitle": record.standard_title,
        "category": record.category,
        "listName": "List of Major Consumer Products Notified for Compulsory Marking",
        "sourceSequence": record.sequence,
    }

    return "(" + ", ".join([
        sql_text(chunk_id),
        sql_text(record.document_id),
        sql_text(record.category),
        "NULL",
        str(record.page),
        sql_text(chunk_text),
        sql_array(keywords),
        sql_json(metadata),
    ]) + ")"


def supporting_chunks() -> list[str]:
    records = [
        {
            "id": "bis-hallmark-faq-gold-standards",
            "document_id": "bis-hallmarking-faq-official",
            "section": "Indian Standards on Hallmarking",
            "page": "NULL",
            "text": (
                "The BIS Hallmarking FAQ lists IS 1417:2016 for gold and gold alloys, "
                "jewellery and artefacts - fineness and marking - specification."
            ),
            "keywords": ["IS 1417:2016", "gold", "jewellery", "hallmarking", "fineness"],
            "metadata": {
                "recordKind": "hallmarking_fact",
                "standardNumber": "IS 1417:2016",
                "product": "Gold jewellery and artefacts",
                "standardTitle": "Gold and Gold Alloys, Jewellery/Artefacts - Fineness and Marking - Specification",
            },
        },
        {
            "id": "bis-hallmark-faq-gold-grades",
            "document_id": "bis-hallmarking-faq-official",
            "section": "Permitted gold grades",
            "page": "NULL",
            "text": (
                "The BIS Hallmarking FAQ says IS 1417:2016 permits six gold hallmarking "
                "grades: 14K (585), 18K (750), 20K (833), 22K (916), 23K (958), and 24KS (995)."
            ),
            "keywords": ["14K585", "18K750", "20K833", "22K916", "23K958", "24KS995", "gold purity"],
            "metadata": {
                "recordKind": "hallmarking_fact",
                "label": "Permitted gold grades",
                "value": "14K (585), 18K (750), 20K (833), 22K (916), 23K (958), 24KS (995)",
            },
        },
        {
            "id": "bis-hallmark-faq-huid",
            "document_id": "bis-hallmarking-faq-official",
            "section": "HUID verification",
            "page": "NULL",
            "text": (
                "BIS says HUID is a six-digit alphanumeric Hallmark Unique Identification number, "
                "unique for each hallmarked item and traceable. Consumers can verify it in the BIS Care App using Verify HUID."
            ),
            "keywords": ["HUID", "Verify HUID", "BIS Care App", "hallmark", "six digit alphanumeric"],
            "metadata": {
                "recordKind": "hallmarking_fact",
                "label": "Official HUID verification",
                "value": "Use Verify HUID in the BIS Care App",
            },
        },
        {
            "id": "bis-lims-is1417-laboratories",
            "document_id": "bis-lims-is-1417",
            "section": "Laboratories with IS 1417 facilities",
            "page": "NULL",
            "text": (
                "BIS LIMS lists IS 1417:2016 facilities at Northern Regional Laboratory, Bengaluru Branch Laboratory, "
                "Central Laboratory, Hyderabad Branch Laboratory, Western Regional Laboratory, Jammu Kashmir Branch Laboratory, "
                "Patna Branch Laboratory, Southern Regional Laboratory, and Eastern Regional Laboratory. "
                "Users should open BIS LIMS to confirm current scope and availability."
            ),
            "keywords": ["IS 1417", "gold testing laboratory", "gold purity lab", "BIS lab", "jewellery testing"],
            "metadata": {
                "recordKind": "laboratory_fact",
                "standardNumber": "IS 1417:2016",
                "label": "BIS laboratories listed",
                "value": "NRL, BNBL, CL, HYBL, WRL, JKBL, PBL, SRL, ERL",
            },
        },
        {
            "id": "bis-lims-is1417-sample-quantity",
            "document_id": "bis-lims-is-1417",
            "section": "Sample quantity and test facilities",
            "page": "NULL",
            "text": (
                "BIS LIMS lists a minimum 1.5 gram sample for 9K gold jewellery and a minimum 1 gram sample for other "
                "gold jewellery grades at multiple BIS laboratories. Scope, charges, and availability must be checked on the live LIMS page."
            ),
            "keywords": ["gold sample quantity", "1.5 gram", "1 gram", "IS 1417 testing", "testing charges"],
            "metadata": {
                "recordKind": "laboratory_fact",
                "standardNumber": "IS 1417:2016",
                "label": "Minimum sample quantity",
                "value": "1.5 g for 9K; 1 g for other jewellery grades",
            },
        },
    ]

    values: list[str] = []
    for record in records:
        values.append("(" + ", ".join([
            sql_text(str(record["id"])),
            sql_text(str(record["document_id"])),
            sql_text(str(record["section"])),
            "NULL",
            str(record["page"]),
            sql_text(str(record["text"])),
            sql_array(list(record["keywords"])),
            sql_json(dict(record["metadata"])),
        ]) + ")")

    return values


def build_migration(annexure_1: Path, annexure_2: Path) -> str:
    records_1 = parse_annexure_1(annexure_1)
    records_2 = parse_annexure_2(annexure_2)

    if len(records_1) != 257:
        raise ValueError(f"Expected 257 Annexure-1 rows, found {len(records_1)}")
    if len(records_2) != 62:
        raise ValueError(f"Expected 62 Annexure-2 rows, found {len(records_2)}")

    product_rows = [product_values(record) for record in [*records_1, *records_2]]
    all_rows = [*product_rows, *supporting_chunks()]
    hash_1 = source_hash(annexure_1)
    hash_2 = source_hash(annexure_2)

    return f"""ALTER TABLE public.bis_source_chunks
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{{}}'::JSONB;

INSERT INTO public.bis_source_documents
  (id, title, document_name, url, source_type, official_domain, last_checked, metadata)
VALUES
  (
    '{ANNEXURE_1_DOCUMENT_ID}',
    'Major Consumer Products under Compulsory Marking - Annexure 1',
    'List of Major Consumer Products Notified for Compulsory Marking - Annexure 1',
    'https://www.bis.gov.in/wp-content/uploads/2025/03/temp_2131689475.pdf',
    'notification',
    'bis.gov.in',
    '2026-08-31',
    '{{"owner":"Bureau of Indian Standards","sha256":"{hash_1}","rows":257,"extraction":"table-row"}}'::JSONB
  ),
  (
    '{ANNEXURE_2_DOCUMENT_ID}',
    'Major Consumer Products under Compulsory Marking - Annexure 2',
    'List of Major Consumer Products Notified for Compulsory Marking - Annexure 2',
    'https://www.bis.gov.in/wp-content/uploads/2025/03/temp_2131689472.pdf',
    'notification',
    'bis.gov.in',
    '2026-08-31',
    '{{"owner":"Bureau of Indian Standards","sha256":"{hash_2}","rows":62,"extraction":"table-row"}}'::JSONB
  ),
  (
    'bis-hallmarking-faq-official',
    'BIS Hallmarking FAQ',
    'BIS Hallmarking FAQ - General',
    'https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en',
    'website',
    'bis.gov.in',
    '2026-08-31',
    '{{"owner":"Bureau of Indian Standards","topic":"hallmarking and HUID"}}'::JSONB
  ),
  (
    'bis-lims-is-1417',
    'BIS LIMS facilities for IS 1417:2016',
    'BIS Laboratory Information Management System',
    'https://lims.bis.gov.in/home/search_is_number/?is_number__doc_no=1417',
    'website',
    'bis.gov.in',
    '2026-08-31',
    '{{"owner":"Bureau of Indian Standards","topic":"gold testing laboratories","liveData":true}}'::JSONB
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
  '{ANNEXURE_1_DOCUMENT_ID}',
  '{ANNEXURE_2_DOCUMENT_ID}',
  'bis-hallmarking-faq-official',
  'bis-lims-is-1417'
);

INSERT INTO public.bis_source_chunks
  (id, document_id, section, clause, page, chunk_text, keywords, metadata)
VALUES
  {",\n  ".join(all_rows)};

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
  metadata JSONB,
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
  LIMIT LEAST(GREATEST(match_count, 1), 12);
$$;

GRANT EXECUTE ON FUNCTION public.match_bis_source_chunks(TEXT, INT, REAL)
TO anon, authenticated;
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("annexure_1", type=Path, help="Nine-page Annexure-1 PDF")
    parser.add_argument("annexure_2", type=Path, help="Five-page Annexure-2 PDF")
    parser.add_argument("output", type=Path, help="Generated SQL migration")
    args = parser.parse_args()

    migration = build_migration(args.annexure_1, args.annexure_2)
    args.output.write_text(migration, encoding="utf-8")


if __name__ == "__main__":
    main()
