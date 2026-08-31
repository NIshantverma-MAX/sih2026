<h1 align="center">
  <img src="public/bis-logo.png" alt="BIS logo" width="80" />
  BIS SmartGuide
</h1>

<p align="center">
  AI-powered standards, certification, and BIS service guidance for Indian industries and consumers.
</p>

This repository is being built for **Smart India Hackathon problem statement SIH26107: AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers**.

## What It Solves

Indian manufacturers, students, MSMEs, and consumers often struggle to answer basic BIS questions quickly:

- Which Indian Standard applies to my product?
- Is BIS certification mandatory or voluntary?
- Which certification scheme should I follow?
- Which documents and testing steps are required?
- Which BIS-recognized laboratories can support testing?
- How do I verify hallmarking or a HUID?

BIS SmartGuide turns these workflows into one guided product experience with standards search, certification guidance, source-backed assistant responses, laboratory discovery, document upload analysis, and Hindi/English localization.

## Core Features

- **Standards search and recommendations**: Find relevant Indian Standards by product, category, sector, and certification status.
- **Certification journey guidance**: Show mandatory/voluntary verdicts, scheme explanation, documents, checklist, official sources, and next actions.
- **AI assistant**: Official-source BIS guidance with linked citations, signed-in chat history, and new conversation support.
- **Laboratory discovery**: Search BIS-recognized laboratories by city, state, category, and supported standards.
- **Hallmarking support**: HUID verification flow for consumers and jewellers.
- **Document upload workflow**: Planned document extraction and analysis for product identification and standards mapping.
- **Saved items and query history**: User-facing workspace for standards, labs, guides, and previous questions.
- **Bilingual UX**: English and Hindi dictionaries in `src/locales/`.

## System Architecture

```mermaid
flowchart TB
  user["User<br/>Manufacturer / Consumer / Student / BIS Officer"]
  browser["React + TypeScript Frontend<br/>Vite, Router, Tailwind, Zustand"]
  services["Frontend Service Layer<br/>src/services/*"]
  api["Backend API<br/>Auth, Search, Standards, Labs, Documents"]
  rag["AI/RAG Orchestrator<br/>Query classification + retrieval + response validation"]
  db[("Application Database<br/>Users, standards, labs, queries, saved items")]
  vector[("Vector Store<br/>Standard chunks, document chunks, embeddings")]
  storage[("Object Storage<br/>Uploaded documents and extracted files")]
  official["Official BIS Sources<br/>Standards, QCOs, guidelines, lab data, hallmarking data"]

  user --> browser
  browser --> services
  services --> api
  api --> db
  api --> storage
  api --> rag
  rag --> vector
  rag --> db
  official --> rag
  official --> db
```

## Frontend Module Map

```mermaid
flowchart LR
  routes["src/routes/index.tsx"]
  layouts["src/layouts"]
  pages["src/pages"]
  components["src/components"]
  services["src/services"]
  store["src/lib/store.ts"]
  data["src/data"]
  types["src/types"]
  locales["src/locales"]

  routes --> layouts
  routes --> pages
  pages --> components
  pages --> services
  pages --> store
  services --> data
  services --> types
  components --> types
  components --> locales
  store --> types
```

## User Workflows

### Standards Discovery

```mermaid
sequenceDiagram
  actor User
  participant UI as Standards UI
  participant Search as searchService
  participant Standards as standardsService
  participant Data as Mock Standards Data

  User->>UI: Search product or standard
  UI->>Search: Build context-aware route
  UI->>Standards: Request matching standards
  Standards->>Data: Filter by query/category/status
  Data-->>Standards: Matching standards
  Standards-->>UI: Standards + relevance details
  UI-->>User: Cards, filters, source references
```

### Source-Grounded AI Assistant Flow

```mermaid
sequenceDiagram
  actor User
  participant UI as Ask Assistant Page
  participant API as InsForge ask-bis Function
  participant DB as Official BIS Source Index
  participant LLM as OpenRouter (supported excerpts only)

  User->>UI: Ask BIS question
  UI->>API: Invoke ask-bis(question, language)
  API->>API: Rate-limit and reject unrelated intent
  API->>DB: Search active official source chunks
  DB-->>API: Ranked excerpts + metadata + URLs
  API->>API: Re-rank product phrases and IS-number families
  alt Deterministic standard record
    API->>API: Build compact structured answer
  else Excerpt synthesis needed
    API->>LLM: Generate JSON using only retrieved excerpts
    LLM-->>API: Structured draft with citation labels
    API->>API: Validate and cap response fields
  end
  API-->>UI: Source-backed answer
  UI-->>User: Summary, fact rows, next action, source links
```

The indexed corpus currently includes the two supplied official BIS compulsory-marking annexures, official hallmarking/HUID guidance, live BIS LIMS records for IS 1417, and independently checked standard-revision records. Every indexed document and chunk carries provenance metadata. User-supplied prototype HUIDs, laboratories, and stale standard lists are isolated in `bis_demo_reference_records` and are never queried by the assistant.

### Planned Document Analysis Flow

```mermaid
flowchart TD
  upload["Upload product document"]
  validate["Validate file type, size, and safety"]
  extract["Extract text and metadata"]
  classify["Identify product, material, use case, sector"]
  match["Match standards and certification rules"]
  evidence["Attach source citations and confidence"]
  result["Show analysis report in UI"]

  upload --> validate --> extract --> classify --> match --> evidence --> result
```

## Data Model

The database design separates user data, standards knowledge, official source provenance, assistant conversations, uploaded documents, certification rules, and saved workspace items.

```mermaid
erDiagram
  USERS ||--o{ QUERIES : asks
  USERS ||--o{ ASSISTANT_CONVERSATIONS : owns
  USERS ||--o{ DOCUMENTS : uploads
  USERS ||--o{ SAVED_ITEMS : saves
  ASSISTANT_CONVERSATIONS ||--o{ ASSISTANT_MESSAGES : contains
  STANDARDS ||--o{ STANDARD_CHUNKS : indexed_as
  STANDARDS ||--o{ CERTIFICATION_RULES : governed_by
  STANDARDS ||--o{ QCOS : mandated_by
  STANDARDS ||--o{ LAB_STANDARDS : tested_by
  LABORATORIES ||--o{ LAB_STANDARDS : supports
  DOCUMENTS ||--o{ DOCUMENT_CHUNKS : indexed_as
  SOURCES ||--o{ STANDARDS : cites

  USERS {
    uuid id PK
    varchar name
    varchar email UK
    varchar phone
    varchar password_hash
    enum role
    varchar company
    varchar product_category
    timestamp created_at
    timestamp updated_at
  }

  STANDARDS {
    uuid id PK
    varchar standard_number UK
    varchar title
    varchar category
    varchar sector
    text description
    text scope
    enum status
    varchar revision
    integer year
    varchar ics_code
    enum certification_status
  }

  STANDARD_CHUNKS {
    uuid id PK
    uuid standard_id FK
    text content
    varchar section
    integer page
    vector embedding
  }

  SOURCES {
    uuid id PK
    varchar title
    varchar url
    varchar document_name
    enum type
  }

  LABORATORIES {
    uuid id PK
    varchar name
    boolean recognized
    text address
    varchar city
    varchar state
    varchar phone
    varchar email
    varchar website
    decimal lat
    decimal lng
  }

  LAB_STANDARDS {
    uuid lab_id FK
    uuid standard_id FK
  }

  QUERIES {
    uuid id PK
    uuid user_id FK
    text question
    enum language
    enum status
    timestamp created_at
  }

  ASSISTANT_CONVERSATIONS {
    uuid id PK
    uuid user_id FK
    text title
    enum language
    timestamp created_at
    timestamp updated_at
  }

  ASSISTANT_MESSAGES {
    uuid id PK
    uuid conversation_id FK
    uuid user_id FK
    enum role
    text content
    enum language
    jsonb response
    timestamp created_at
  }

  DOCUMENTS {
    uuid id PK
    uuid user_id FK
    varchar filename
    varchar file_path
    varchar file_type
    integer file_size
    enum status
    jsonb analysis_json
  }

  DOCUMENT_CHUNKS {
    uuid id PK
    uuid document_id FK
    text content
    integer page
    vector embedding
  }

  SAVED_ITEMS {
    uuid id PK
    uuid user_id FK
    enum type
    uuid item_id
    varchar title
    timestamp created_at
  }

  QCOS {
    uuid id PK
    varchar product_category
    uuid standard_id FK
    date effective_date
    varchar notification_number
    boolean mandatory
  }

  CERTIFICATION_RULES {
    uuid id PK
    uuid standard_id FK
    integer step_number
    varchar title
    text description
    jsonb checklist
    jsonb documents
  }
```

## Schema Design Notes

| Domain | Tables | Purpose |
| --- | --- | --- |
| Identity | `users` | Roles for manufacturer, consumer, student, and administrator journeys. |
| Standards knowledge | `standards`, `standard_chunks`, `sources` | Searchable standard metadata, source provenance, and RAG-ready chunks. |
| Certification | `qcos`, `certification_rules` | Mandatory/voluntary decisions, QCO evidence, and scheme checklists. |
| Laboratories | `laboratories`, `lab_standards` | BIS-recognized lab directory and supported testing standards. |
| Assistant | `assistant_conversations`, `assistant_messages` | Owner-isolated conversation history, structured assistant outputs, warnings, and citations. |
| Documents | `documents`, `document_chunks` | Upload processing, extracted text, analysis results, and embeddings. |
| User workspace | `saved_items` | Saved standards, labs, guides, and queries. |

See the full draft schema in `docs/DATABASE_SCHEMA.md`.

## API Boundary

The frontend must talk through `src/services/` only. This keeps the UI independent from backend implementation details and makes mock-to-real API migration controlled.

```mermaid
flowchart LR
  page["Page Component"]
  service["src/services/*"]
  contract["docs/API_CONTRACT.md"]
  backend["Backend Controller"]
  database[("Database")]

  page --> service
  service --> contract
  contract --> backend
  backend --> database
```

Important planned endpoints:

| Endpoint | Purpose |
| --- | --- |
| `POST /auth/login` | Authenticate user and create a session. |
| `POST /auth/register` | Register manufacturer, consumer, student, or administrator. |
| `GET /standards` | Search and filter standards. |
| `GET /standards/:id` | Read one standard with sources and requirements. |
| InsForge function `ask-bis` | Ask a source-backed BIS guidance question. |
| `GET /laboratories` | Search BIS-recognized testing labs. |
| `POST /hallmarking/verify` | Verify HUID or hallmarking details. |
| `POST /documents` | Upload a document for extraction and analysis. |
| `GET /documents/:id` | Read document analysis status and result. |
| `GET /certification/:standardId` | Get certification steps and requirements. |

See `docs/API_CONTRACT.md` and `docs/AI_CONTRACT.md` for request and response structures.

## AI/RAG Design Principles

- Every factual claim should be backed by a source citation.
- The assistant returns a compact title, summary, fact rows, next actions, warnings, and clickable sources instead of loose text.
- If evidence is missing or ambiguous, the system should say so instead of guessing.
- LLM API keys must never be exposed in the frontend.
- The frontend should render warnings and source links clearly.
- Only indexed URLs on `bis.gov.in` and its subdomains are eligible as answer evidence.
- Prototype/demo HUID, laboratory, and business records remain visibly labeled and outside the official retrieval path.

```mermaid
flowchart TD
  query["User question"]
  classify["Intent + entity classification"]
  retrieve["Hybrid retrieval<br/>keyword + vector"]
  sources["Source-ranked BIS evidence"]
  generate["LLM answer generation"]
  validate["JSON schema + citation validation"]
  response["AssistantResponse"]

  query --> classify --> retrieve --> sources --> generate --> validate --> response
  validate -- "invalid or weak evidence" --> retrieve
```

## Security And Public Repository Rules

This project is intended to be public for SIH review, so the repository must stay clean.

- Do not commit `.env`, `.env.*`, API keys, service credentials, private datasets, local machine settings, generated vector databases, or large raw document dumps.
- Keep only safe placeholders in `.env.example`.
- Route all future LLM, vector database, and document-processing credentials through backend environment variables.
- Validate uploaded documents by file type, size, malware risk, and storage permissions before analysis.
- Keep source citations and official document provenance with every AI answer.
- Use pull requests for review; do not push directly to `main` unless the team explicitly decides to.

The current `.gitignore` already excludes `node_modules`, `dist`, local env files, `.DS_Store`, logs, scratch files, and `*.local`.

## Project Structure

```text
bis-smartguide/
  docs/
    API_CONTRACT.md
    AI_CONTRACT.md
    DATABASE_SCHEMA.md
    architecture/README.md
  public/
  src/
    components/
    data/
    hooks/
    layouts/
    lib/
    locales/
    pages/
    routes/
    services/
    types/
    utils/
  .env.example
  package.json
  vite.config.ts
```

## Local Setup

Prerequisites:

- Node.js 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

Optional local environment:

```bash
cp .env.example .env
```

Build checks:

```bash
npm run typecheck
npm run build
npm run lint
```

## Git Workflow

For team development:

```bash
git switch main
git pull --ff-only origin main
git switch -c docs/readme-architecture-schema
```

Commit small changes with conventional commit messages:

```bash
git add README.md
git commit -m "docs: expand SIH project README"
git push -u origin docs/readme-architecture-schema
```

Target repository:

```text
https://github.com/abhigyan1102/BIS.git
```

Before pushing, always verify:

```bash
git status --short
git diff --cached --name-only
git ls-files | grep -E '(^\.env$|^\.env\.|secret|credential|private|\.pem$|\.key$)' || true
```

## Documentation

- `docs/architecture/README.md`: Technical architecture boundaries.
- `docs/API_CONTRACT.md`: Backend endpoint contracts.
- `docs/AI_CONTRACT.md`: Assistant response contract and RAG expectations.
- `docs/DATABASE_SCHEMA.md`: Draft database schema.
