# BIS SmartGuide — AI/RAG Contract

This document defines how the frontend expects structured responses from the AI/RAG backend.

## Architecture

```
User Query
    ↓
Frontend (React)
    ↓
Backend API (POST /assistant/query)
    ↓
Query Processing & Classification
    ↓
RAG Pipeline
    ├── Query Embedding
    ├── Vector Search (FAISS/Pinecone/Weaviate)
    ├── BIS Knowledge Base Retrieval
    └── Context Assembly
    ↓
LLM (Gemini / GPT-4 / Custom)
    ↓
Structured Response Generation
    ↓
Response Validation
    ↓
Frontend Rendering
```

## Request Format

```typescript
interface AssistantRequest {
  question: string;
  language: 'en' | 'hi' | 'gu';
  conversationId?: string;
  context?: {
    currentStandard?: string;
    currentProduct?: string;
    previousQueries?: string[];
  };
}
```

## Response Format

The frontend expects ALL assistant responses to conform to this structure:

```typescript
interface AssistantResponse {
  // Required: Main answer text
  answer: string;
  
  // Optional: Product identification from query
  product?: {
    name: string;
    category: string;
    confidence: number;  // 0.0 - 1.0
    keywords: string[];
  };
  
  // Optional: Recommended standards
  standards?: Array<{
    standard: {
      id: string;
      standardNumber: string;
      title: string;
      category: string;
      description: string;
      status: 'active' | 'withdrawn' | 'under-revision';
    };
    relevanceScore: number;  // 0-100
    relevance: 'high' | 'medium' | 'low';
    matchReasons: string[];
  }>;
  
  // Optional: Certification information
  certification?: {
    isMandatory: boolean;
    scheme: string;
    description: string;
    timeline: string;
  };
  
  // Optional: Testing requirements
  testing?: Array<{
    test: string;
    description: string;
    standard: string;
    labRequired: boolean;
  }>;
  
  // Optional: Relevant laboratories
  laboratories?: Array<{
    id: string;
    name: string;
    city: string;
    state: string;
  }>;
  
  // Optional: Warnings/disclaimers
  warnings?: string[];
  
  // Required for source-backed answers
  sources?: Array<{
    id: string;
    title: string;
    url: string;
    documentName: string;
    page?: number;
    section?: string;
    clause?: string;
    snippet?: string;
    type: 'standard' | 'regulation' | 'guideline' | 'notification' | 'website';
  }>;
}
```

## Source-Backed Answers

Every factual claim in the answer MUST have a corresponding source citation. The frontend renders sources as clickable references that users can verify.

### Source Types

| Type | Description | Example |
|------|-------------|--------|
| standard | Indian Standard document | IS 17803:2022 |
| regulation | Government regulation/QCO | QCO notification |
| guideline | BIS guideline document | BIS certification guide |
| notification | Government notification | Gazette notification |
| website | BIS website content | bis.gov.in page |

## Knowledge Base Structure

The RAG pipeline should index:

1. **Indian Standards** — Full text of IS documents
2. **BIS Certification Rules** — Certification process documents
3. **QCO Notifications** — Quality Control Orders
4. **BIS Website Content** — FAQ, guidelines, procedures
5. **Testing Requirements** — Standard-specific test requirements
6. **Laboratory Database** — BIS-recognized lab information
7. **Hallmarking Regulations** — Hallmarking rules and procedures

## Confidence Scoring

- Product identification confidence: 0.0 - 1.0
- Standard relevance score: 0 - 100
- Overall answer confidence should be derived from retrieval similarity scores

## Multi-language Support

The LLM should:
1. Accept queries in any supported language
2. Detect query language automatically
3. Generate responses in the same language as the query
4. Use the `language` parameter as a fallback
5. Keep standard numbers and technical terms in English even in translated responses

## Error Handling

If the AI cannot find relevant information:
```json
{
  "answer": "I could not find specific standards for your query. Please try a more specific product description or contact BIS directly.",
  "warnings": ["No matching standards found in the knowledge base."],
  "sources": []
}
```
