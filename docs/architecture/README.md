# BIS SmartGuide Architecture

## Overview
This document outlines the architectural boundaries and guidelines for the BIS SmartGuide project (SIH26107). To ensure team collaboration without merge conflicts, boundaries must be strictly respected.

## Application Layers
```
                     BIS SMARTGUIDE
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
        Frontend        Backend         AI/RAG
            │              │              │
            └──────────────┼──────────────┘
                           ↓
                       API Contracts
                           ↓
                        Database
                           ↓
                  BIS Knowledge Base
```

## Frontend Architecture
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Zustand.
- **Directory Structure:**
  - `src/components/`: Reusable, modular UI components.
  - `src/pages/`: Route-level components.
  - `src/services/`: API integration layer. The UI must only interact with services, NOT raw `fetch` calls.
  - `src/locales/`: i18n dictionaries for English/Hindi.
- **Search Architecture:** Search state is strictly separated between `GlobalSearch`, `HeroSearch`, and `StandardsSearch`. Do NOT use a global `searchQuery` state. Always pass contextual search queries to `searchService.search(query, context)`.

## Backend & API Boundary
- **Tech Stack:** [To be determined]
- **API Contracts:** Documented in `docs/api/API_CONTRACT.md`.
- Frontend developers should use Mock Services until real endpoints are deployed.
- **No Secrets:** The frontend must NEVER bundle LLM API keys (e.g., Gemini, OpenAI). All LLM interactions must be proxied through the Backend API.

## Data & RAG Architecture
- **Knowledge Base:** Raw BIS PDFs and source materials should be structured logically (e.g., `data/raw/`, `data/processed/`).
- **Storage:** Large generated datasets (vector databases, embeddings) should NOT be committed directly to Git. Instead, commit the generation scripts and schemas.

## State Management & Local Storage
- **Zustand:** Used for lightweight global state (e.g., Language Preference, User Session).
- **Draft States:** Form inputs and search drafts must remain localized (`useState`) and should NOT be persisted to `localStorage` unless explicitly required (like Saved Standards).
