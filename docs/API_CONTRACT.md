# BIS SmartGuide — API Contract

This document defines the expected backend API endpoints for the BIS SmartGuide application.

## Base URL

```
Production: https://api.bissmartguide.gov.in/v1
Staging: https://staging-api.bissmartguide.gov.in/v1
Development: http://localhost:5000/api/v1
```

## Authentication

### POST /auth/login

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "user": {
    "id": "usr_123",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "manufacturer",
    "company": "Steel Industries Pvt Ltd"
  },
  "token": "jwt_token_here",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### POST /auth/register

Request:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "manufacturer | consumer | student | administrator",
  "company": "string (optional)",
  "productCategory": "string (optional)"
}
```

## Standards

### GET /standards

Query Parameters:
- `q` (string): Search query
- `category` (string): Filter by category
- `sector` (string): Filter by sector
- `status` (string): active | withdrawn | under-revision
- `certification` (string): mandatory | voluntary
- `sort` (string): relevance | latest | alphabetical
- `page` (number): Page number
- `limit` (number): Items per page

Response (200):
```json
{
  "product": {
    "name": "Stainless Steel Water Bottle",
    "category": "Household / Food Contact Articles",
    "confidence": 0.94
  },
  "standards": [
    {
      "standard": {
        "id": "std_001",
        "standardNumber": "IS 17803:2022",
        "title": "Stainless Steel Vacuum Insulated Flask",
        "category": "Household",
        "sector": "Consumer Goods",
        "description": "...",
        "scope": "...",
        "status": "active",
        "revision": "2022",
        "icsCode": "97.040.60"
      },
      "relevanceScore": 95,
      "relevance": "high",
      "matchReasons": ["Product material matches", "Intended use matches"]
    }
  ],
  "total": 5,
  "page": 1
}
```

### GET /standards/:id

Response (200):
```json
{
  "id": "std_001",
  "standardNumber": "IS 17803:2022",
  "title": "...",
  "scope": "...",
  "keyRequirements": ["..."],
  "relatedStandards": ["..."],
  "sources": ["..."]
}
```

## AI Assistant

### POST /assistant/query

Request:
```json
{
  "question": "Which BIS standard applies to stainless steel water bottles?",
  "language": "en",
  "conversationId": "conv_123 (optional)"
}
```

Response (200):
```json
{
  "answer": "For stainless steel water bottles...",
  "product": {
    "name": "Stainless Steel Water Bottle",
    "category": "Household",
    "confidence": 0.94
  },
  "standards": [...],
  "certification": {
    "isMandatory": false,
    "scheme": "ISI Certification Marks Scheme",
    "description": "...",
    "timeline": "4-6 months"
  },
  "testing": [...],
  "laboratories": [...],
  "warnings": ["This is AI-generated guidance. Please verify with official BIS sources."],
  "sources": [
    {
      "id": "src_001",
      "title": "BIS — Know Your Standard",
      "url": "https://www.bis.gov.in",
      "documentName": "IS 17803:2022",
      "section": "Scope",
      "page": 3
    }
  ]
}
```

## Laboratories

### GET /laboratories

Query Parameters:
- `q` (string): Search by name/city
- `state` (string): Filter by state
- `standard` (string): Filter by supported standard
- `page`, `limit`

Response (200):
```json
{
  "laboratories": [...],
  "total": 10
}
```

### GET /laboratories/:id

Response (200): Full laboratory object.

## Hallmarking

### POST /hallmarking/verify

Request:
```json
{
  "huid": "AB1234"
}
```

Response (200):
```json
{
  "verified": true,
  "huid": "AB1234",
  "product": "Gold Ring",
  "purity": "22K (916)",
  "jeweller": "...",
  "assayingCentre": "...",
  "date": "2024-01-15"
}
```

## Documents

### POST /documents

Multipart form data with file.

Response (200):
```json
{
  "id": "doc_123",
  "status": "processing"
}
```

### GET /documents/:id

Response (200):
```json
{
  "id": "doc_123",
  "status": "complete",
  "result": {
    "productIdentified": "...",
    "relevantStandards": [...],
    "certificationRequirements": [...],
    "sources": [...]
  }
}
```

## Certification

### GET /certification/:standardId

Response (200): CertificationGuide object with steps.

### GET /certification/qco/:productCategory

Response (200):
```json
{
  "mandatory": true,
  "qcoNumber": "QCO-2024-001",
  "effectiveDate": "2024-06-01"
}
```
