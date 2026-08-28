# BIS SmartGuide — Database Schema

Future database architecture for the BIS SmartGuide platform.

## Entity Relationship

### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Full name |
| email | VARCHAR(255) | Unique, indexed |
| phone | VARCHAR(20) | Phone number |
| password_hash | VARCHAR(255) | Bcrypt hash |
| role | ENUM | manufacturer, consumer, student, administrator |
| company | VARCHAR(255) | Company name (nullable) |
| product_category | VARCHAR(255) | Product category (nullable) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### standards
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| standard_number | VARCHAR(50) | e.g., IS 17803:2022 |
| title | VARCHAR(500) | Standard title |
| category | VARCHAR(100) | Product category |
| sector | VARCHAR(100) | Industry sector |
| description | TEXT | Full description |
| scope | TEXT | Standard scope |
| status | ENUM | active, withdrawn, under-revision |
| revision | VARCHAR(50) | Revision info |
| year | INTEGER | Publication year |
| ics_code | VARCHAR(50) | ICS classification |
| certification_status | ENUM | mandatory, voluntary, self-declaration |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### standard_chunks
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| standard_id | UUID | FK -> standards |
| content | TEXT | Text chunk |
| section | VARCHAR(100) | Section reference |
| page | INTEGER | Page number |
| embedding | VECTOR(768) | Vector embedding for RAG |
| created_at | TIMESTAMP | |

### sources
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(500) | Source title |
| url | VARCHAR(1000) | Source URL |
| document_name | VARCHAR(500) | Document reference |
| type | ENUM | standard, regulation, guideline, notification, website |
| created_at | TIMESTAMP | |

### laboratories
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(500) | Lab name |
| recognized | BOOLEAN | BIS recognition status |
| address | TEXT | Full address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State |
| phone | VARCHAR(50) | Phone |
| email | VARCHAR(255) | Email |
| website | VARCHAR(500) | Website URL |
| working_hours | VARCHAR(100) | Working hours |
| lat | DECIMAL(10,8) | Latitude |
| lng | DECIMAL(11,8) | Longitude |
| created_at | TIMESTAMP | |

### lab_standards (junction table)
| Column | Type | Description |
|--------|------|-------------|
| lab_id | UUID | FK -> laboratories |
| standard_id | UUID | FK -> standards |

### queries
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK -> users |
| question | TEXT | User question |
| language | ENUM | en, hi, gu |
| status | ENUM | answered, pending, error |
| created_at | TIMESTAMP | |

### assistant_messages
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| query_id | UUID | FK -> queries |
| role | ENUM | user, assistant |
| content | TEXT | Message content |
| response_json | JSONB | Structured response |
| created_at | TIMESTAMP | |

### documents
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK -> users |
| filename | VARCHAR(500) | Original filename |
| file_path | VARCHAR(1000) | Storage path |
| file_type | VARCHAR(50) | MIME type |
| file_size | INTEGER | Size in bytes |
| status | ENUM | uploading, extracting, analyzing, complete, error |
| analysis_json | JSONB | Analysis results |
| created_at | TIMESTAMP | |

### document_chunks
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| document_id | UUID | FK -> documents |
| content | TEXT | Text chunk |
| page | INTEGER | Page number |
| embedding | VECTOR(768) | Vector embedding |

### saved_items
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK -> users |
| type | ENUM | standard, laboratory, query, guide |
| item_id | UUID | Referenced item ID |
| title | VARCHAR(500) | Display title |
| created_at | TIMESTAMP | |

### announcements
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(500) | Announcement title |
| description | TEXT | Content |
| category | VARCHAR(100) | Category |
| link | VARCHAR(1000) | External link |
| published_at | TIMESTAMP | |

### qcos
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_category | VARCHAR(255) | Product category |
| standard_id | UUID | FK -> standards |
| effective_date | DATE | Effective date |
| notification_number | VARCHAR(100) | Government notification |
| mandatory | BOOLEAN | Is mandatory |

### certification_rules
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| standard_id | UUID | FK -> standards |
| step_number | INTEGER | Step in process |
| title | VARCHAR(255) | Step title |
| description | TEXT | Step description |
| checklist | JSONB | Checklist items |
| documents | JSONB | Required documents |

### hallmarking_centres
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(500) | Centre name |
| type | ENUM | assaying, jeweller |
| address | TEXT | Address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State |
| license_number | VARCHAR(100) | BIS licence |
| valid_until | DATE | Licence validity |
