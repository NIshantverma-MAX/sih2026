# BIS SmartGuide - AI Standards & Certification Assistant

Official repository for **SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers.**

## Features
- Search and recommend applicable Indian Standards.
- Certification scheme guidance and document uploads.
- Testing Laboratory directory.
- Interactive AI Assistant powered by RAG.
- Complete English/Hindi localization.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand
- **Backend:** (Upcoming)
- **AI/RAG:** (Upcoming)

## Project Structure
- `src/`: Frontend React Application
- `docs/`: API Contracts, Architecture, and Database Schemas
- `backend/`: Future API implementations
- `ai/`: Future RAG and LLM pipelines
- `data/`: Knowledge base schemas and scripts

## Local Setup
1. Clone the repository: `git clone https://github.com/NIshantverma-MAX/sih2026.git`
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env`
4. Run development server: `npm run dev`

*(Note: Currently uses Mock APIs. Real backend instructions will be added here once integrated.)*

## Team Workflow & Git Guidelines
We follow a strict PR-based workflow to keep the `main` branch stable.

1. **Pull Latest Main:** `git switch main && git pull --ff-only origin main`
2. **Create Feature Branch:** `git switch -c frontend/your-feature-name`
   - Use clear prefixes: `frontend/`, `backend/`, `ai/`, `data/`, `fix/`, `docs/`.
3. **Commit Small Changes:** Follow conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`).
4. **Push Branch:** `git push -u origin frontend/your-feature-name`
5. **Open a Pull Request:** Fill out the PR template.
6. **Pass CI & Review:** Ensure tests, linting, and build pass before merging.

### Important Rules
- **NEVER** push directly to `main`.
- **NEVER** commit secrets, `.env` files, API keys, or large generated AI datasets.
- Keep the frontend architecture separated from backend implementations using the `src/services/` abstraction layer.
- Preserve search state separation (Global, Hero, Standards).
