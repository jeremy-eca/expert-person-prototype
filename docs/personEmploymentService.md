# Person Employment Service

## Module Description
The Person Employment Service manages employment records for persons in the Expert-Persons microservice. This module provides comprehensive CRUD functionality for employment records, including employment history tracking, job titles, employers, and employment types. The service implements proper validation, soft deletion, tenant isolation, and follows RESTful design patterns.

## Database Schema
The `person_employment` table has the following structure (29 columns total):

| Column                    | Type                     | Constraints                | Description                         |
|---------------------------|--------------------------|----------------------------|-------------------------------------|
| id                        | uuid                     | PRIMARY KEY, NOT NULL      | Unique identifier for employment    |
| person_id                 | uuid                     | NOT NULL, FOREIGN KEY      | Reference to persons.person_id      |
| employment_start_date     | date                     | NOT NULL                   | Start date of employment            |
| employment_end_date       | date                     |                            | End date of employment (if any)     |
| job_title                 | text                     | NOT NULL                   | Job title/position                  |
| employer_name             | text                     | NOT NULL                   | Name of the employer                |
| employment_type           | text                     | NOT NULL                   | Type of employment (Full-time, Part-time, etc.) |
| job_function              | text                     |                            | Job function/role category          |
| department                | text                     |                            | Department name                     |
| is_active                 | boolean                  | DEFAULT true               | Whether employment is currently active |
| employee_references       | jsonb                    | DEFAULT '[]'::jsonb        | Employee reference identifiers      |
| managers                  | jsonb                    | DEFAULT '[]'::jsonb        | Array of manager references         |
| tenant_id                 | uuid                     | NOT NULL                   | Multi-tenant identifier             |
| created_at                | timestamp with time zone | DEFAULT now()              | Creation timestamp                  |
| created_by                | text                     |                            | Creator identifier                  |
| updated_at                | timestamp with time zone | DEFAULT now()              | Last update timestamp               |
| updated_by                | text                     |                            | Last updater identifier             |
| deleted_at                | timestamp with time zone |                            | Soft delete timestamp               |
| deleted_by                | text                     |                            | Deleter identifier                  |
| ... (additional columns)  | ...                      | ...                        | Additional employment metadata      |

### Indexes
- `person_employment_pkey` - PRIMARY KEY on id
- `person_employment_person_id_fkey` - FOREIGN KEY constraint on person_id

### Foreign Keys
- `person_employment_person_id_fkey` - FOREIGN KEY (person_id) REFERENCES persons(person_id)

## Module Endpoints

| Method | Endpoint                              | Description                               |
|--------|---------------------------------------|-------------------------------------------|
| GET    | /api/persons/:personId/employment     | Get all employment records for a person   |
| GET    | /api/employment/:employmentId         | Get a specific employment record by ID    |
| POST   | /api/persons/:personId/employment     | Create a new employment record for a person |
| PUT    | /api/employment/:employmentId         | Update an existing employment record      |
| DELETE | /api/employment/:employmentId         | Soft delete an employment record          |

## Request/Response Examples

### GET /api/persons/:personId/employment
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "person_id": "456e7890-e89b-12d3-a456-426614174001",
      "employment_start_date": "2023-01-15",
      "employment_end_date": null,
      "job_title": "Senior Software Engineer",
      "employer_name": "Tech Solutions Inc.",
      "employment_type": "Full-time",
      "job_function": "Engineering",
      "department": "Technology",
      "is_active": true,
      "employee_references": [],
      "managers": [],
      "tenant_id": "01958944-0916-78c8-978d-d2707b71e17d",
      "created_at": "2023-01-15T10:00:00Z",
      "updated_at": "2023-01-15T10:00:00Z"
    }
  ],
  "message": "Employment records retrieved successfully"
}
```

### POST /api/persons/:personId/employment
**Request Body:**
```json
{
  "employment_start_date": "2023-01-15",
  "job_title": "Senior Software Engineer",
  "employer_name": "Tech Solutions Inc.",
  "employment_type": "Full-time",
  "job_function": "Engineering",
  "department": "Technology",
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "person_id": "456e7890-e89b-12d3-a456-426614174001",
    "employment_start_date": "2023-01-15",
    "job_title": "Senior Software Engineer",
    "employer_name": "Tech Solutions Inc.",
    "employment_type": "Full-time",
    "job_function": "Engineering",
    "department": "Technology",
    "is_active": true,
    "employee_references": [],
    "managers": [],
    "tenant_id": "01958944-0916-78c8-978d-d2707b71e17d",
    "created_at": "2023-01-15T10:00:00Z",
    "updated_at": "2023-01-15T10:00:00Z"
  },
  "message": "Employment record created successfully"
}
```

## Validation Rules

### Required Fields (POST)
- `employment_start_date` - Must be a valid date
- `job_title` - Must be a non-empty string
- `employer_name` - Must be a non-empty string  
- `employment_type` - Must be a non-empty string

### Optional Fields
- `employment_end_date` - Date (can be null for current employment)
- `job_function` - String
- `department` - String
- `is_active` - Boolean (defaults to true)
- `employee_references` - JSONB array (defaults to empty array)
- `managers` - JSONB array (defaults to empty array)

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "data": null,
  "message": "Missing required fields: employment_start_date, job_title, employer_name, employment_type"
}
```

### 404 Not Found - Person Not Found
```json
{
  "success": false,
  "data": null,
  "message": "Person not found"
}
```

### 404 Not Found - Employment Not Found
```json
{
  "success": false,
  "data": null,
  "message": "Employment record not found"
}
```

### 401 Unauthorized - Missing Authentication
```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized"
}
```

## Module Dependencies
- **Database**: PostgreSQL with `pg` library for querying
- **Authentication**: HMAC-SHA256 authentication middleware
- **Security**: Multi-tenant isolation via tenant_id filtering
- **Internal Dependencies**:
  - `services/personsService.js` - For verifying person existence
  - `config/db.js` - For database connection pool
  - `middleware/hmacAuth.js` - For HMAC authentication

## Module Configuration
Standard database connection parameters are required:
- `DATABASE_URL` - Complete PostgreSQL connection string
- Environment variables for HMAC authentication (managed via AWS Secrets Manager)

## Key Features
1. **Multi-tenant Data Isolation**: All queries filter by tenant_id to ensure data separation
2. **Soft Deletion**: Records are marked as deleted with `deleted_at` timestamp, never physically removed
3. **Comprehensive Validation**: Server-side validation for all required fields with detailed error messages
4. **RESTful Design**: Proper HTTP methods and status codes following REST conventions
5. **Parameterized Queries**: All SQL queries use parameterization to prevent SQL injection
6. **JSONB Support**: Employee references and managers stored as JSONB arrays for flexibility
7. **Audit Trail**: Created/updated timestamps and user tracking for all operations
8. **Foreign Key Integrity**: Proper referential integrity with persons table

## Testing Instructions
The module includes comprehensive integration tests in `test/integration/endpoints/employment-endpoints.test.js`. 

### Running Tests
```bash
# Run all employment endpoint tests
npm test -- test/integration/endpoints/employment-endpoints.test.js

# Run tests in watch mode
npm test -- test/integration/endpoints/employment-endpoints.test.js --watch
```

### Test Coverage
- ✅ GET endpoints (list and single record)
- ✅ POST endpoint with validation
- ✅ PUT endpoint for updates
- ✅ DELETE endpoint (soft delete)
- ✅ Error handling (404, 400, 401)
- ✅ Tenant isolation verification
- ✅ HMAC authentication integration
- ✅ Database constraint handling

**Test Results**: 14/14 tests passing (100% success rate)

## Authentication
All endpoints require HMAC-SHA256 authentication with the following headers:
- `x-client-id`: Client identifier for AWS Secrets Manager lookup
- `x-signature`: Base64-encoded HMAC-SHA256 signature
- `x-timestamp`: Unix timestamp in milliseconds
- `x-tenant-id`: Tenant identifier (UUID)

## Postman Collection
A complete Postman collection with HMAC authentication is available at:
`docs/postman/Person_Employment_HMAC.postman_collection.json`

The collection includes:
- Pre-request scripts for automatic HMAC signature generation
- All CRUD operations with example payloads
- Proper error handling examples
- Environment variables for easy configuration

## Performance Considerations
- Employment records are ordered by `employment_start_date DESC` for chronological listing
- Database queries use proper indexing on foreign keys and tenant_id
- JSONB fields (employee_references, managers) provide flexible storage without additional joins
- Soft deletion maintains data integrity while allowing for audit trails

## Security Features
- **Tenant Isolation**: All operations strictly filter by tenant_id
- **HMAC Authentication**: Cryptographic request signing prevents tampering
- **Input Validation**: Server-side validation prevents malformed data
- **SQL Injection Protection**: Parameterized queries throughout
- **Audit Logging**: All operations tracked with timestamps and user identifiers
