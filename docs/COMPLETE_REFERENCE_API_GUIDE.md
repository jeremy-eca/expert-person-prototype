# Complete Reference API Guide - Expert Core API

## Overview

This document provides comprehensive documentation for all 14 reference endpoints in the Expert Core API. Reference endpoints implement the **hide/modify/add pattern** that merges system data from expert-global API with tenant-specific custom data.

**Base URL**: `https://expert-api-core-dev.onrender.com/api`

## Architecture Pattern

All reference endpoints follow a consistent three-tier architecture:

1. **System Data** - Global reference data from expert-global API (read-only)
2. **Custom Data** - Tenant-specific customizations in local database (full CRUD)
3. **Reference View** - Merged system + custom data with hide/modify/add logic

### Hide/Modify/Add Logic

- **HIDE**: Custom record with `system_*_id` + `is_visible = false` → Skip system record
- **MODIFY**: Custom record with `system_*_id` + `is_visible = true` → Override system record
- **ADD**: Custom record with `system_*_id = null` + `is_visible = true` → Add pure custom record

## Authentication

All endpoints require **HMAC-SHA256 authentication** with these headers:

```
x-client-id: expert-core
x-signature: [HMAC_SIGNATURE]
x-timestamp: [UNIX_TIMESTAMP_MS]
x-tenant-id: [TENANT_UUID]
Content-Type: application/json
```

### HMAC Signature Generation

The signature is generated differently based on HTTP method:
- **POST/PUT/PATCH**: `HMAC-SHA256(compactJsonBody + timestamp, secretKey)`
- **GET/DELETE**: `HMAC-SHA256(/api/ + lowercasePath + query + timestamp, secretKey)`

```javascript
const crypto = require('crypto');

function generateHMACHeaders(method, path, body = null) {
  const timestamp = Date.now().toString();
  const clientSecret = 'your-secret-key';
  
  let stringToSign;
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
    stringToSign = JSON.stringify(body) + timestamp;
  } else {
    // Remove /api prefix and convert to lowercase
    const pathOnly = path.split('?')[0];
    const cleanPath = pathOnly.replace(/^\/api/, '').toLowerCase();
    stringToSign = cleanPath + timestamp;
  }
  
  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(stringToSign)
    .digest('base64');
  
  return {
    'x-client-id': 'expert-core',
    'x-signature': signature,
    'x-timestamp': timestamp,
    'x-tenant-id': 'your-tenant-id',
    'Content-Type': 'application/json'
  };
}
```

## Standard Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | Integer | 50 | Number of records to return (1-500) |
| `offset` | Integer | 0 | Number of records to skip for pagination |
| `language_code` | String | en | Language code for localized content |
| `debug` | Boolean | false | Enable debug mode for troubleshooting |

## Standard Response Format

```json
{
  "success": boolean,
  "data": [...],
  "pagination": {
    "total": integer,
    "limit": integer,
    "offset": integer,
    "hasMore": boolean
  },
  "sources": {
    "system": integer,
    "custom": integer,
    "system-modified": integer
  },
  "message": string
}
```

---

# 1. Reference Cities API

**Status**: ✅ **COMPLETED** - Fixed and operational with expert-global API

## Endpoints

### GET /api/reference_cities
List all reference cities with optional search and filtering.

**Query Parameters:**
- `q` (string, optional): Search term for city name (min 2 chars)
- `country_id` (UUID, optional): Filter cities by country
- `limit` (integer, optional): Default 50, max 500
- `offset` (integer, optional): Default 0
- `debug` (boolean, optional): Default false

### GET /api/reference_cities/search
Search cities by name with dedicated search functionality.

**Query Parameters:**
- `query` (string, required): Search term for city name
- `country_id` (UUID, optional): Filter by country
- `limit` (integer, optional): Default 50, max 500
- `offset` (integer, optional): Default 0

### GET /api/reference_cities/:cityId
Retrieve a specific city by its UUID.

### GET /api/reference_cities/country/:countryId/search
Search cities within a specific country (cascading autocomplete).

**Query Parameters:**
- `q` (string, required): Search term (min 2 chars)
- `limit` (integer, optional): Default 15, max 50
- `offset` (integer, optional): Default 0

## Data Schema

```json
{
  "city_id": "uuid",
  "geonames_id": "integer",
  "country_id": "uuid",
  "city_name": "string",
  "asciiname": "string",
  "alternate_names": "string",
  "adm1_code": "string",
  "adm2_code": "string",
  "adm1_name": "string",
  "adm2_name": "string",
  "feature_code": "string",
  "latitude": "decimal",
  "longitude": "decimal",
  "elevation": "integer",
  "time_zone": "string",
  "population": "integer",
  "population_density": "decimal",
  "postal_codes": "string",
  "google_place_id": "string",
  "formatted_address": "string",
  "types": "string",
  "gmt_offset": "integer",
  "dst_offset": "integer",
  "country_code": "string",
  "country_code_iso3": "string",
  "source": "enum: system|custom|system-modified"
}
```

## Example Request

```bash
curl -X GET "https://expert-api-core-dev.onrender.com/api/reference_cities?limit=10" \
  -H "x-client-id: expert-core" \
  -H "x-signature: [SIGNATURE]" \
  -H "x-timestamp: [TIMESTAMP]" \
  -H "x-tenant-id: [TENANT_ID]" \
  -H "Content-Type: application/json"
```

---

# 2. Reference Countries API

**Status**: ✅ **OPERATIONAL** - Integrated with expert-global API

## Endpoints

### GET /api/reference_countries
List all reference countries with pagination and filtering.

**Query Parameters:**
- `region` (string, optional): Filter by geographic region
- `language_code` (string, optional): Default "en"
- `limit` (integer, optional): Default 50, max 500
- `offset` (integer, optional): Default 0

### GET /api/reference_countries/:countryId
Retrieve a specific country by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "country_name": "string",
  "country_code": "string (2 chars)",
  "country_code_iso3": "string (3 chars)",
  "region": "string",
  "subregion": "string",
  "capital": "string",
  "currency_code": "string",
  "currency_name": "string",
  "phone_code": "string",
  "is_active": "boolean",
  "source": "enum: system|custom|system-modified",
  "system_country_id": "uuid"
}
```

---

# 3. Reference Job Functions API

**Status**: ✅ **MIGRATED** - Successfully using expert-global API

## Endpoints

### GET /api/reference_job_functions
List all reference job functions with pagination and filtering.

**Query Parameters:**
- `category` (string, optional): Filter by job function category
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_job_functions/:functionId
Retrieve a specific job function by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "job_function_name": "string",
  "description": "string",
  "category": "string",
  "level": "enum: Entry|Professional|Senior|Executive",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_job_function_id": "uuid",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Records**: 20 system records confirmed

---

# 4. Reference Job Grades API

**Status**: ✅ **MIGRATED** - Successfully using expert-global API

## Endpoints

### GET /api/reference_job_grades
List all reference job grades with pagination and filtering.

**Query Parameters:**
- `level` (string, optional): Filter by grade level (Entry, Mid, Senior, Executive)
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_job_grades/:gradeId
Retrieve a specific job grade by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "job_grade_name": "string",
  "description": "string",
  "level": "enum: Entry|Mid|Senior|Executive",
  "numeric_value": "integer",
  "salary_range_min": "decimal",
  "salary_range_max": "decimal",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_job_grade_id": "uuid",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Records**: 11 system records confirmed

---

# 5. Reference Employment Types API

**Status**: ✅ **OPERATIONAL** - Integrated with expert-global API

## Endpoints

### GET /api/reference_employment_types
List all reference employment types with pagination and filtering.

**Query Parameters:**
- `category` (string, optional): Filter by employment category
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_employment_types/:typeId
Retrieve a specific employment type by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "employment_type_name": "string",
  "description": "string",
  "category": "enum: Permanent|Contract|Temporary",
  "work_hours_min": "integer",
  "work_hours_max": "integer",
  "is_eligible_benefits": "boolean",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_employment_type_id": "uuid",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

# 6. Reference Gender API

**Status**: ✅ **MIGRATED** - Successfully using expert-global API

## Endpoints

### GET /api/reference_gender
List all reference gender classifications with pagination.

**Query Parameters:**
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_gender/:genderId
Retrieve a specific gender classification by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "gender_name": "string",
  "description": "string",
  "gender_code": "string",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_gender_id": "uuid",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Records**: 11 system records confirmed

---

# 7. Reference Gender Identity API

**Status**: ✅ **OPERATIONAL** - Integrated with expert-global API

## Endpoints

### GET /api/reference_gender_identity
List all reference gender identity options with pagination.

**Query Parameters:**
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_gender_identity/:identityId
Retrieve a specific gender identity by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "gender_identity_name": "string",
  "description": "string",
  "category": "enum: Binary|Non-binary|Other",
  "is_inclusive": "boolean",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_gender_identity_id": "uuid"
}
```

---

# 8. Reference Pronouns API

**Status**: ✅ **OPERATIONAL** - Integrated with expert-global API

## Endpoints

### GET /api/reference_pronouns
List all reference pronouns with pagination.

**Query Parameters:**
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_pronouns/:pronounId
Retrieve a specific pronoun set by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "pronoun_set": "string",
  "subject_pronoun": "string",
  "object_pronoun": "string",
  "possessive_pronoun": "string",
  "reflexive_pronoun": "string",
  "description": "string",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_pronoun_id": "uuid"
}
```

---

# 9. Reference Marital Status API

**Status**: ✅ **MIGRATED** - Successfully using expert-global API

## Endpoints

### GET /api/reference_marital_status
List all reference marital status classifications with pagination.

**Query Parameters:**
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_marital_status/:statusId
Retrieve a specific marital status by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "marital_status_name": "string",
  "description": "string",
  "status_code": "string",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_marital_status_id": "uuid"
}
```

---

# 10. Reference Titles API

**Status**: ✅ **MIGRATED** - Successfully integrated with expert-global API

## Endpoints

### GET /api/reference_titles
List all reference titles with pagination and filtering.

**Query Parameters:**
- `language_code` (string, optional): Default "en"
- `search` (string, optional): Search term for title name
- `category` (string, optional): Filter by title category
- `is_active` (boolean, optional): Filter by active status
- `source` (string, optional): Filter by source (system, custom, all)

### GET /api/reference_titles/:titleId
Retrieve a specific title by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "title_value": "string",
  "display_label": "string",
  "custom_label": "string",
  "custom_id": "uuid",
  "source": "enum: system|custom",
  "is_custom": "boolean",
  "has_custom_override": "boolean",
  "sort_order": "integer",
  "language_code": "string"
}
```

---

# 11. Reference Nationalities API

**Status**: ✅ **COMPLETED** - Expert-global API integration

## Endpoints

### GET /api/reference_nationalities
List all reference nationalities with pagination and filtering.

**Query Parameters:**
- `search` (string, optional): Search term for nationality name
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_nationalities/:nationalityId
Retrieve a specific nationality by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "nationality_value": "string",
  "display_label": "string",
  "description": "string",
  "country_code": "string",
  "is_custom": "boolean",
  "source": "enum: system|custom|system-modified",
  "system_nationality_id": "uuid"
}
```

---

# 12. Reference Languages API

**Status**: ✅ **COMPLETED** - Expert-global integration documented

## Endpoints

### GET /api/reference_languages
List all reference languages with pagination and filtering.

**Query Parameters:**
- `search` (string, optional): Search term for language name
- `is_active` (boolean, optional): Filter by active status
- `language_code` (string, optional): Default "en"

### GET /api/reference_languages/:languageId
Retrieve a specific language by its UUID.

## Data Schema

```json
{
  "id": "uuid",
  "language_name": "string",
  "language_code": "string",
  "description": "string",
  "proficiency_levels": "array",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_language_id": "uuid"
}
```

**Records**: 50+ system records confirmed

---

# 13. Reference Case Stages API

**Status**: ✅ **COMPLETED** - Working with expert-global API

## Endpoints

### GET /api/reference_case_stages
List all reference case stages with pagination and filtering.

**Query Parameters:**
- `case_type` (string, optional): Filter by case type
- `move_type` (string, optional): Filter by move type
- `is_active` (boolean, optional): Filter by active status

### GET /api/reference_case_stages/search
Search case stages by name with flexible filters.

### GET /api/reference_case_stages/case-type/:caseType
Get stages filtered by case type.

### GET /api/reference_case_stages/move-type/:moveType
Get stages filtered by move type.

### GET /api/reference_case_stages/:stageId
Get specific case stage by ID.

## Data Schema

```json
{
  "id": "uuid",
  "stage_name": "string",
  "description": "string",
  "case_type": "string",
  "move_type": "string",
  "stage_sequence": "integer",
  "allowed_statuses": "array",
  "is_active": "boolean",
  "source": "enum: system|custom|system-modified",
  "system_stage_id": "uuid"
}
```

## Business Logic

- **HIDE**: Custom record with `system_stage_id` + `is_visible = false` → Skip system record
- **MODIFY**: Custom record with `system_stage_id` + `is_visible = true` → Override system record
- **ADD**: Custom record with `system_stage_id = null` + `is_visible = true` → Add pure custom record

---

# 14. Reference Assignment Move Reasons API

**Status**: ✅ **COMPLETED** - Working with expert-global API

## Endpoints

### GET /api/reference_assignment_move_reasons
List all reference assignment move reasons with pagination.

### GET /api/reference_assignment_move_reasons/search
Search assignment move reasons by name.

### GET /api/reference_assignment_move_reasons/:reasonId
Get specific assignment move reason by ID.

## Data Schema

```json
{
  "id": "uuid",
  "reason_name": "string",
  "description": "string",
  "category": "string",
  "is_active": "boolean",
  "display_order": "integer",
  "source": "enum: system|custom|system-modified",
  "system_assignment_move_reasons_id": "uuid"
}
```

## Business Logic

- **HIDE**: Custom record with `system_assignment_move_reasons_id` + `is_visible = false` → Skip system record
- **MODIFY**: Custom record with `system_assignment_move_reasons_id` + `is_visible = true` → Override system record
- **ADD**: Custom record with `system_assignment_move_reasons_id = null` + `is_visible = true` → Add pure custom record

---

# OpenAPI 3.0.3 YAML Structure

All reference endpoints follow this OpenAPI structure:

```yaml
openapi: 3.0.3
info:
  title: Reference [Resource] API
  description: Unified view of system and custom [resource] with hide/modify/add pattern
  version: 1.0.0
  contact:
    name: Expert Core API Support
    url: https://expert-api-core-dev.onrender.com

servers:
  - url: https://expert-api-core-dev.onrender.com/api
    description: Development server

security:
  - hmacAuth: []

paths:
  /reference_[resource]:
    get:
      summary: Get reference [resource]
      description: Retrieves unified list of system and custom [resource] with pagination
      operationId: getReference[Resource]
      parameters:
        - name: limit
          in: query
          description: Number of records to return (1-500)
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 500
            default: 50
        # Additional parameters specific to each resource

components:
  securitySchemes:
    hmacAuth:
      type: apiKey
      in: header
      name: x-signature
      description: HMAC-SHA256 signature with x-client-id, x-timestamp, and x-tenant-id headers

  schemas:
    Reference[Resource]:
      type: object
      required:
        - id
        - source
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier
        source:
          type: string
          enum: [system, custom, system-modified]
          description: Data source
        # Additional properties specific to each resource

    Pagination:
      type: object
      required:
        - total
        - limit
        - offset
        - hasMore
      properties:
        total:
          type: integer
          description: Total number of records
        limit:
          type: integer
          description: Number of records requested
        offset:
          type: integer
          description: Number of records skipped
        hasMore:
          type: boolean
          description: Whether more records are available

    ErrorResponse:
      type: object
      required:
        - success
        - data
        - message
      properties:
        success:
          type: boolean
          example: false
        data:
          type: null
          example: null
        message:
          type: string
          description: Error description

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    Unauthorized:
      description: Authentication failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

# Error Handling

All endpoints return consistent error responses:

## Standard Error Codes

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - HMAC authentication failed |
| 403 | Forbidden - Missing tenant header |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Detailed error description"
}
```

# Performance Notes

- **System Data Integration**: All endpoints successfully connect to expert-global API
- **Response Times**: Fast response with HMAC-authenticated external API calls
- **Pagination**: Standard limit/offset with 500 record maximum
- **Caching**: System data cached appropriately to reduce external API calls
- **Migration Status**: All 14 endpoints successfully migrated to expert-global API integration

# Usage Examples

## JavaScript/Node.js Example

```javascript
const crypto = require('crypto');

async function callReferenceAPI(endpoint, params = {}) {
  const timestamp = Date.now().toString();
  const clientSecret = 'your-secret-key';
  
  // Generate query string
  const queryString = new URLSearchParams(params).toString();
  const fullPath = endpoint + (queryString ? '?' + queryString : '');
  
  // Generate HMAC signature
  const pathOnly = fullPath.split('?')[0];
  const cleanPath = pathOnly.replace(/^\/api/, '').toLowerCase();
  const stringToSign = cleanPath + timestamp;
  
  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(stringToSign)
    .digest('base64');
  
  const headers = {
    'x-client-id': 'expert-core',
    'x-signature': signature,
    'x-timestamp': timestamp,
    'x-tenant-id': 'your-tenant-id',
    'Content-Type': 'application/json'
  };
  
  const response = await fetch(`https://expert-api-core-dev.onrender.com${fullPath}`, {
    method: 'GET',
    headers
  });
  
  return await response.json();
}

// Usage examples
const cities = await callReferenceAPI('/api/reference_cities', { limit: 50, q: 'London' });
const countries = await callReferenceAPI('/api/reference_countries', { region: 'Europe' });
const jobFunctions = await callReferenceAPI('/api/reference_job_functions', { category: 'Technology' });
```

## cURL Examples

```bash
# Get cities with search
curl -X GET "https://expert-api-core-dev.onrender.com/api/reference_cities?q=London&limit=10" \
  -H "x-client-id: expert-core" \
  -H "x-signature: [GENERATED_SIGNATURE]" \
  -H "x-timestamp: [TIMESTAMP]" \
  -H "x-tenant-id: [TENANT_UUID]" \
  -H "Content-Type: application/json"

# Get job functions by category
curl -X GET "https://expert-api-core-dev.onrender.com/api/reference_job_functions?category=Engineering" \
  -H "x-client-id: expert-core" \
  -H "x-signature: [GENERATED_SIGNATURE]" \
  -H "x-timestamp: [TIMESTAMP]" \
  -H "x-tenant-id: [TENANT_UUID]" \
  -H "Content-Type: application/json"

# Get case stages by case type
curl -X GET "https://expert-api-core-dev.onrender.com/api/reference_case_stages/case-type/assignment" \
  -H "x-client-id: expert-core" \
  -H "x-signature: [GENERATED_SIGNATURE]" \
  -H "x-timestamp: [TIMESTAMP]" \
  -H "x-tenant-id: [TENANT_UUID]" \
  -H "Content-Type: application/json"
```

# System Integration Details

## Expert-Global API Integration

All reference endpoints integrate with expert-global API for system data:

- **Base URL**: `https://expert-global-dev.onrender.com`
- **Authentication**: HMAC client for secure API calls
- **System Endpoints**: Each reference endpoint has corresponding system endpoint
- **Data Merging**: Service layer merges system and custom data
- **Hide/Modify/Add**: Full customization support for tenants

## Custom Data Sources

Each reference endpoint has a corresponding custom data table:

- `custom_cities` → `reference_cities`
- `custom_countries` → `reference_countries`
- `custom_job_functions` → `reference_job_functions`
- `custom_job_grades` → `reference_job_grades`
- `custom_employment_types` → `reference_employment_types`
- `custom_gender` → `reference_gender`
- `custom_gender_identity` → `reference_gender_identity`
- `custom_pronouns` → `reference_pronouns`
- `custom_marital_status` → `reference_marital_status`
- `custom_titles` → `reference_titles`
- `custom_nationalities` → `reference_nationalities`
- `custom_languages` → `reference_languages`
- `custom_case_stages` → `reference_case_stages`
- `custom_assignment_move_reasons` → `reference_assignment_move_reasons`

## Data Flow

1. Service fetches system data from expert-global API
2. Service fetches custom data from local database  
3. Service merges data using hide/modify/add logic
4. Controller returns unified response with pagination

# Summary

This complete reference guide covers all 14 reference endpoints with:

✅ **Complete API Documentation** - All endpoints, parameters, and responses  
✅ **HMAC Authentication** - Complete signature generation and header details  
✅ **Data Schemas** - Full field documentation for all resources  
✅ **Hide/Modify/Add Pattern** - Business logic for all endpoints  
✅ **OpenAPI YAML Structure** - Standardized specifications  
✅ **Code Examples** - JavaScript and cURL usage examples  
✅ **Error Handling** - Comprehensive error response documentation  
✅ **Performance Notes** - Current status and integration details  

**Total Reference Endpoints**: 14  
**Migration Status**: ✅ All completed and operational  
**Integration Status**: ✅ All connected to expert-global API  
**Documentation Status**: ✅ Comprehensive and ready for AI coder handoff