# Expert Persons API - Complete Endpoint Catalog

This document provides a comprehensive catalog of all API endpoints in the expert-persons microservice.

## Authentication

All endpoints require HMAC-SHA256 authentication with the following headers:
- `x-client-id`: Client identifier for AWS Secrets Manager lookup
- `x-signature`: Base64-encoded HMAC-SHA256 signature
- `x-timestamp`: Unix timestamp in milliseconds
- `x-tenant-id`: Tenant identifier (UUID or 'global')

## Response Format

All endpoints return responses in the following format:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "count": number (optional, for list endpoints)
}
```

## Core Endpoints

### Authentication Endpoints
**Base Route:** `/api/auth`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/login` | Authenticate user via expert-core API | `{username, password}` | JWT token and user info |
| POST | `/service-token` | Generate service token (requires JWT) | None | Service token |
| POST | `/test-token` | Generate test token (dev only) | `{tenant_id?, user_id?, role?}` | Test JWT token |
| POST | `/hmac-token` | Generate HMAC token (dev only) | `{tenant_id?, user_id?, service?}` | HMAC service token |

### Persons Management
**Base Route:** `/api/persons`

| Method | Endpoint | Description | Parameters | Request Body |
|--------|----------|-------------|------------|--------------|
| GET | `/` | Get all persons with composite data | `limit`, `offset`, `include` | None |
| GET | `/:personId` | Get single person with composite data | `personId` (UUID) | None |
| POST | `/` | Create a new person | None | Person object |
| PUT | `/:personId` | Update person | `personId` (UUID) | Person object |
| DELETE | `/:personId` | Soft delete person | `personId` (UUID) | None |

### Persons Composite Operations
**Base Route:** `/api/persons`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/query` | Advanced query with selective includes | Query object with filters |
| POST | `/insert` | Insert person with related data | Complete person object |
| POST | `/upsert` | Upsert person with related data | Complete person object |
| POST | `/bulk-upsert` | Bulk upsert multiple persons | Array of person objects |

### Person Contact Details
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/persons/:personId/contact-details` | Get all contact details for person | `personId` (UUID) |
| GET | `/contact-details/:contactId` | Get specific contact detail | `contactId` (UUID) |
| POST | `/persons/:personId/contact-details` | Create contact detail for person | `personId` (UUID) |
| PUT | `/contact-details/:contactId` | Update contact detail | `contactId` (UUID) |
| DELETE | `/contact-details/:contactId` | Delete contact detail | `contactId` (UUID) |

### Person Employment
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/persons/:personId/employment` | Get employment records for person | `personId` (UUID) |
| GET | `/employment/:employmentId` | Get specific employment record | `employmentId` (UUID) |
| POST | `/persons/:personId/employment` | Create employment record | `personId` (UUID) |
| PUT | `/employment/:employmentId` | Update employment record | `employmentId` (UUID) |
| DELETE | `/employment/:employmentId` | Delete employment record | `employmentId` (UUID) |

### Person Addresses
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/persons/:personId/addresses` | Get addresses for person | `personId` (UUID) |
| GET | `/addresses/:addressId` | Get specific address | `addressId` (UUID) |
| POST | `/persons/:personId/addresses` | Create address for person | `personId` (UUID) |
| PUT | `/addresses/:addressId` | Update address | `addressId` (UUID) |
| DELETE | `/addresses/:addressId` | Delete address | `addressId` (UUID) |

### Person Passports
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/passports/:personId` | Get passports for person | `personId` (UUID) |
| POST | `/passports/` | Create new passport | None |
| PUT | `/passports/:id` | Update passport | `id` (UUID) |
| DELETE | `/passports/:id` | Delete passport | `id` (UUID) |

### Person Children
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-children/:personId` | Get children for person | `personId` (UUID) |
| POST | `/person-children/` | Create child record | None |
| PUT | `/person-children/:id` | Update child record | `id` (UUID) |
| DELETE | `/person-children/:id` | Delete child record | `id` (UUID) |

### Person Emergency Contacts
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-emergency-contacts/:personId` | Get emergency contacts | `personId` (UUID) |
| POST | `/person-emergency-contacts/` | Create emergency contact | None |
| PUT | `/person-emergency-contacts/:id` | Update emergency contact | `id` (UUID) |
| DELETE | `/person-emergency-contacts/:id` | Delete emergency contact | `id` (UUID) |

### Person Flags
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-flags/:personId` | Get flags for person | `personId` (UUID) |
| POST | `/person-flags/` | Create flag | None |
| PUT | `/person-flags/:id` | Update flag | `id` (UUID) |
| DELETE | `/person-flags/:id` | Delete flag | `id` (UUID) |

### Person Government Identifiers
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-government-identifiers/:personId` | Get government IDs | `personId` (UUID) |
| POST | `/person-government-identifiers/` | Create government ID | None |
| PUT | `/person-government-identifiers/:id` | Update government ID | `id` (UUID) |
| DELETE | `/person-government-identifiers/:id` | Delete government ID | `id` (UUID) |

### Person Languages
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-languages/:personId` | Get languages for person | `personId` (UUID) |
| POST | `/person-languages/` | Create language record | None |
| PUT | `/person-languages/:id` | Update language record | `id` (UUID) |
| DELETE | `/person-languages/:id` | Delete language record | `id` (UUID) |

### Person Notes
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-notes/:personId` | Get notes for person | `personId` (UUID) |
| POST | `/person-notes/` | Create note | None |
| PUT | `/person-notes/:id` | Update note | `id` (UUID) |
| DELETE | `/person-notes/:id` | Delete note | `id` (UUID) |

### Person Partners
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-partners/:personId` | Get partners for person | `personId` (UUID) |
| POST | `/person-partners/` | Create partner record | None |
| PUT | `/person-partners/:id` | Update partner record | `id` (UUID) |
| DELETE | `/person-partners/:id` | Delete partner record | `id` (UUID) |

### Person Payroll Details
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-payroll-details/:personId` | Get payroll details | `personId` (UUID) |
| POST | `/person-payroll-details/` | Create payroll details | None |
| PUT | `/person-payroll-details/:id` | Update payroll details | `id` (UUID) |
| DELETE | `/person-payroll-details/:id` | Delete payroll details | `id` (UUID) |

### Person Permits/Visas
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-permits-visas/:personId` | Get permits/visas | `personId` (UUID) |
| POST | `/person-permits-visas/` | Create permit/visa | None |
| PUT | `/person-permits-visas/:id` | Update permit/visa | `id` (UUID) |
| DELETE | `/person-permits-visas/:id` | Delete permit/visa | `id` (UUID) |

### Person Salaries
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-salaries/:personId` | Get salaries for person | `personId` (UUID) |
| POST | `/person-salaries/` | Create salary record | None |
| PUT | `/person-salaries/:id` | Update salary record | `id` (UUID) |
| DELETE | `/person-salaries/:id` | Delete salary record | `id` (UUID) |

### Person Security Clearances
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-security-clearances/:personId` | Get security clearances | `personId` (UUID) |
| POST | `/person-security-clearances/` | Create security clearance | None |
| PUT | `/person-security-clearances/:id` | Update security clearance | `id` (UUID) |
| DELETE | `/person-security-clearances/:id` | Delete security clearance | `id` (UUID) |

### Person Social Security Numbers
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-social-security-numbers/:personId` | Get SSNs for person | `personId` (UUID) |
| POST | `/person-social-security-numbers/` | Create SSN record | None |
| PUT | `/person-social-security-numbers/:id` | Update SSN record | `id` (UUID) |
| DELETE | `/person-social-security-numbers/:id` | Delete SSN record | `id` (UUID) |

### Person Tax Domiciles
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/person-tax-domiciles/:personId` | Get tax domiciles | `personId` (UUID) |
| POST | `/person-tax-domiciles/` | Create tax domicile | None |
| PUT | `/person-tax-domiciles/:id` | Update tax domicile | `id` (UUID) |
| DELETE | `/person-tax-domiciles/:id` | Delete tax domicile | `id` (UUID) |

### Standalone Endpoints

#### Contact Details
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/contact-details` | Get all contact details | `limit`, `offset` |
| POST | `/contact-details` | Create contact detail | None |

#### Employment
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/employment` | Get all employment records | `limit`, `offset` |
| POST | `/employment` | Create employment record | None |

#### Addresses
**Base Route:** `/api`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/addresses` | Get all addresses | `limit`, `offset` |
| POST | `/addresses` | Create address | None |

### Test Token Endpoints
**Base Route:** `/api`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/test-token` | Generate test token | Development only |

## Query Parameters

### Common Parameters
- `limit`: Number of records to return (1-500, default: 50)
- `offset`: Number of records to skip (default: 0)
- `include`: Comma-separated list of related data to include

### Include Options for Persons
- `addresses`: Include person addresses
- `employment`: Include employment history
- `contact-details`: Include contact details
- `passports`: Include passport information
- `children`: Include children records
- `emergency-contacts`: Include emergency contacts
- `flags`: Include person flags
- `government-identifiers`: Include government IDs
- `languages`: Include language records
- `notes`: Include notes
- `partners`: Include partner records
- `payroll-details`: Include payroll information
- `permits-visas`: Include permits and visas
- `salaries`: Include salary records
- `security-clearances`: Include security clearances
- `social-security-numbers`: Include SSN records
- `tax-domiciles`: Include tax domicile information

## Error Responses

All endpoints may return the following error responses:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Rate limiting is applied to prevent abuse. Default limits:
- 1000 requests per hour per client
- 100 requests per minute per client

## Pagination

List endpoints support pagination with:
- `limit`: Maximum 500 records per request
- `offset`: Starting position for records
- Response includes `count` field with total matching records

## Data Validation

All endpoints validate:
- Required fields presence
- Data type correctness
- UUID format validation
- Tenant isolation
- Soft delete filtering (deleted records excluded)

## Tenant Isolation

All data operations are automatically filtered by tenant:
- `WHERE tenant_id = $tenantId`
- `AND deleted_date IS NULL` (for soft delete support)

This ensures complete data isolation between tenants.