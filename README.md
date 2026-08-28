# BIS SmartGuide

**AI-powered Intelligent Assistant for Indian Standards and BIS Services**

> Smart India Hackathon 2026 — Problem Statement SIH26107

## Overview

BIS SmartGuide is an AI-powered intelligent assistant that helps industries and consumers navigate Indian Standards, BIS certification processes, testing requirements, hallmarking, and more. The application provides a unified platform for discovering applicable standards, understanding certification workflows, finding testing laboratories, and getting AI-assisted guidance.

## Problem Statement

SIH26107 — AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers.

The system helps users:
- Find applicable Indian Standards for their products
- Get AI-powered standard recommendations based on product descriptions
- Understand BIS certification schemes and processes
- Find BIS-recognized testing laboratories
- Verify HUID for hallmarked jewellery
- Get answers to consumer-related BIS questions
- Interact in multiple languages (English, Hindi, Gujarati)
- Receive source-backed answers from authorized BIS knowledge sources

## Features

### Core Features
- **Smart Standard Search**: Describe your product in natural language and find applicable Indian Standards
- **AI Assistant**: Ask BIS-related questions and get structured, source-backed answers
- **Certification Guide**: Step-by-step certification process with checklists and requirements
- **Testing Laboratories**: Find BIS-recognized labs with filters by location and standard
- **Hallmarking**: Verify HUID numbers and learn about hallmarking processes
- **Consumer Help**: Get help with BIS-related consumer queries and complaints
- **Document Analysis**: Upload product documents for automatic standard identification
- **Multi-language Support**: English, Hindi, and Gujarati interface

### Architecture Features
- Service abstraction layer (mock → real API swap)
- Structured AI response format (ready for RAG/LLM integration)
- Source citation system for every recommendation
- Strong TypeScript typing throughout
- Responsive design (desktop, tablet, mobile)

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` | Landing page with search, services, and quick actions |
| Standards | `/standards` | Search and filter applicable standards |
| Standard Details | `/standards/:id` | Detailed view of a specific standard |
| Certification Guide | `/certification` | 7-step certification process |
| Testing Labs | `/labs` | Find BIS-recognized testing laboratories |
| Lab Details | `/labs/:id` | Detailed laboratory information |
| Hallmarking | `/hallmarking` | HUID verification and hallmarking info |
| Consumer Help | `/consumer-help` | Consumer queries and FAQ |
| Ask SmartGuide | `/ask` | AI assistant chat interface |
| My Queries | `/my-queries` | Query history |
| Saved Items | `/saved-items` | Bookmarked standards, labs, queries |
| Upload Document | `/upload-document` | Document upload and analysis |
| Settings | `/settings` | User preferences and configuration |
| Login | `/login` | User authentication |
| Register | `/register` | Account creation |
| Dashboard | `/dashboard` | User dashboard |

## Technology Stack

| Technology | Purpose |
|------------|--------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Zustand | State management |
| Lucide React | Icons |
| Recharts | Charts |
| React Hook Form | Form handling |
| Zod | Validation |
| react-hot-toast | Notifications |

## Folder Structure

```
src/
├── assets/          # Static assets
├── components/
│   ├── ui/          # Reusable UI components (Button, Card, Modal, etc.)
│   └── common/      # Domain-specific components (StandardCard, etc.)
├── contexts/        # React contexts (if needed)
├── data/            # Mock data files
├── features/        # Feature modules
├── hooks/           # Custom React hooks
├── layouts/         # App layout components
├── lib/             # Store and library configuration
├── locales/         # i18n translation files
├── pages/           # Page components
├── routes/          # Router configuration
├── services/        # Service layer (mock → API)
├── types/           # TypeScript interfaces
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bis-smartguide

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## Mock Services

All data is currently served through mock services in `src/services/`. Each service follows a consistent pattern:

```typescript
// Current: Mock implementation
export async function searchStandards(query: string): Promise<StandardRecommendation[]> {
  await delay(1000); // Simulated latency
  return mockStandards.filter(...);
}

// Future: Replace with real API
export async function searchStandards(query: string): Promise<StandardRecommendation[]> {
  const response = await fetch(`${API_BASE_URL}/standards?q=${query}`);
  return response.json();
}
```

### Replacing Mock Services with Real APIs

1. Update `.env` with your API base URL
2. Modify service files in `src/services/` to call real endpoints
3. No page component changes needed — the service interface stays the same

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

See `.env.example` for available configuration options.

## Future Architecture

### Backend Integration
See `docs/API_CONTRACT.md` for expected backend endpoints.

### Database Design
See `docs/DATABASE_SCHEMA.md` for future database architecture.

### AI/RAG Integration
See `docs/AI_CONTRACT.md` for structured AI response format.

## Deployment

```bash
# Build
npm run build

# The dist/ folder contains static files ready for deployment
# Deploy to any static hosting: Vercel, Netlify, Firebase Hosting, etc.
```

## License

This project is developed as part of the Smart India Hackathon 2026.
