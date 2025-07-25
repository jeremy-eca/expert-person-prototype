# Expert Persons API

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://expert-api-persons-dev.onrender.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](package.json)
[![Node.js](https://img.shields.io/badge/node-16.x-green)](package.json)
[![Authentication](https://img.shields.io/badge/auth-HMAC--SHA256-orange)](docs/api/Authentication.md)
[![Test Coverage](https://img.shields.io/badge/test%20coverage-71.4%25-yellow)](tests/)
[![License](https://img.shields.io/badge/license-ISC-lightgrey)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Postman Collections](#postman-collections)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Overview

The **Expert Persons API** is a production-ready REST microservice that provides comprehensive person management capabilities for the Global Mobility platform. It handles complete core dossiers including personal information, employment history, addresses, documents, financial data, and family relationships.

### Key Features

- **🔐 Enterprise Security**: HMAC-SHA256 authentication with AWS Secrets Manager integration
- **👥 Complete Person Management**: 78 endpoints covering all aspects of person data
- **🏢 Multi-tenant Architecture**: Secure tenant isolation for enterprise deployments
- **📊 Composite Operations**: Complex multi-table operations with selective data includes
- **🌍 Multilingual Support**: Field labels and descriptions in multiple languages
- **⚡ High Performance**: Single-query patterns using PostgreSQL 15 with JSONB and LATERAL joins
- **🧪 Comprehensive Testing**: 71.4% E2E test success rate with real database operations
- **📚 Complete Documentation**: 10 detailed API documentation files and 8 Postman collections

### Technology Stack

- **Framework**: Express 4 with ES2022 modules
- **Database**: PostgreSQL 15 (JSONB, LATERAL joins)
- **Authentication**: HMAC-SHA256 with AWS Secrets Manager
- **Testing**: Vitest + Supertest (no mocks, real database)
- **Deployment**: Render (Production: https://expert-api-persons-dev.onrender.com)
- **Architecture**: Route → Controller → Service pattern

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- PostgreSQL 15 or higher
- AWS account (for production authentication)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ECAInternational/expert-api-persons.git
   cd expert-api-persons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   chmod +x scripts/run_migrations.sh
   ./scripts/run_migrations.sh
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### First API Call

Test the health endpoint:

```bash
curl -X GET "https://expert-api-persons-dev.onrender.com/api/health" \
  -H "x-client-id: your-client-id" \
  -H "x-signature: generated-signature" \
  -H "x-timestamp: $(date +%s)000" \
  -H "x-tenant-id: your-tenant-id" \
  -H "Content-Type: application/json"
```

## Authentication

All API endpoints require **HMAC-SHA256 authentication** for enterprise-grade security.

### Required Headers

| Header | Description | Example |
|--------|-------------|---------|
| `x-client-id` | Client identifier for AWS lookup | `client-123` |
| `x-signature` | Base64 HMAC-SHA256 signature | `dGVzdC1zaWduYXR1cmU=` |
| `x-timestamp` | Unix timestamp (milliseconds) | `1638360000000` |
| `x-tenant-id` | Tenant identifier or 'global' | `550e8400-e29b-41d4-a716-446655440000` |

### Signature Generation

```javascript
// For GET requests
const payload = `${requestPath}${timestamp}`;

// For POST/PUT requests  
const payload = `${requestBody}${timestamp}`;

const signature = crypto
  .createHmac('sha256', secretKey)
  .update(payload)
  .digest('base64');
```

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AWS_CLIENT_ID` | AWS client identifier | Yes | `expert-client-dev` |
| `AWS_SECRET_KEY` | Development secret key | Dev only | `dev-secret-key-123` |
| `AWS_REGION` | AWS region | Production | `us-east-1` |
| `DB_HOST` | PostgreSQL host | Yes | `localhost` |
| `DB_PORT` | PostgreSQL port | Yes | `5432` |
| `DB_NAME` | Database name | Yes | `expert_core` |
| `DB_USER` | Database user | Yes | `postgres` |
| `DB_PASSWORD` | Database password | Yes | `password` |
| `PORT` | Server port | No | `3001` |

**📖 Detailed Guide**: [Authentication Documentation](docs/api/Authentication.md)

## API Documentation

### Endpoint Categories Overview

| Category | Endpoints | Description | Documentation |
|----------|-----------|-------------|---------------|
| **Core Person Data** | 6 | Basic person CRUD operations | [Person Management](docs/person.md) |
| **Person Addresses** | 5 | Address management with current address logic | [Address Management](docs/person-addresses.md) |
| **Person Children** | 5 | Child information and relationships | [Children Management](docs/person-children.md) |
| **Person Partners** | 5 | Partner/spouse relationships with marital status | [Partner Management](docs/person-partners.md) |
| **Person Emergency Contacts** | 5 | Emergency contact information and relationships | [Emergency Contacts](docs/person-emergency-contacts.md) |
| **Person Notes** | 5 | Note management for case documentation | [Notes Management](docs/person-notes.md) |
| **Person Flags** | 5 | Flag management for special status indicators | [Flags Management](docs/person-flags.md) |
| **Person Titles** | 4 | Professional and personal titles | [Title Management](docs/person-titles.md) |
| **Person Education** | 5 | Educational background and qualifications | [Education Management](docs/person-education.md) |
| **Person Employment** | 5 | Employment history and current positions | [Employment Management](docs/person-employment.md) |
| **Person Documents** | 5 | Document storage and metadata | [Document Management](docs/person-documents.md) |
| **Person Financial** | 5 | Financial information and banking details | [Financial Management](docs/person-financial.md) |
| **Person Nationalities** | 5 | Nationality and citizenship management | [Nationality Management](docs/person-nationalities.md) |
| **Person Languages** | 5 | Language skills and proficiency levels | [Language Management](docs/person-languages.md) |
| **Person Visas** | 5 | Visa and immigration status tracking | [Visa Management](docs/person-visas.md) |
| **Person Passports** | 5 | Passport information and validity | [Passport Management](docs/person-passports.md) |
| **Person Medical** | 5 | Medical information and health records | [Medical Management](docs/person-medical.md) |
| **System Metadata** | 13 | Field definitions, translations, preferences | [System Metadata](docs/system-metadata.md) |

### Response Format

All endpoints return a consistent response structure:

```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```

### Common Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | integer | 50 | 500 | Records per page |
| `offset` | integer | 0 | - | Records to skip |
| `include` | string | all | - | Related data to include |

**📖 Complete API Reference**: [API Documentation](docs/api/README.md)

## Postman Collections

Pre-configured Postman collections with HMAC authentication and realistic sample data:

### Available Collections

| Collection | File | Endpoints | Description |
|------------|------|-----------|-------------|
| **Person Core** | `person_collection.json` | 6 | Basic person CRUD operations |
| **Person Addresses** | `person_addresses_collection.json` | 5 | Address management with geolocation |
| **Person Children** | `person_children_collection.json` | 5 | Child relationships and information |
| **Person Partners** | `person_partners_collection.json` | 5 | Partner/spouse management |
| **Person Emergency Contacts** | `person_emergency_contacts_collection.json` | 5 | Emergency contact management |
| **Person Notes** | `person_notes_collection.json` | 5 | Note management for case documentation |
| **Person Flags** | `person_flags_collection.json` | 5 | Flag management for special status indicators |
| **Person Titles** | `person_titles_collection.json` | 4 | Professional and personal titles |
| **Person Education** | `person_education_collection.json` | 5 | Educational background tracking |
| **Person Employment** | `person_employment_collection.json` | 5 | Employment history management |
| **System Metadata** | `system_metadata_collection.json` | 13 | Field definitions and translations |

### Setup Instructions

1. **Import Collections**: Import any collection file into Postman
2. **Import Environment**: Use [Expert_Persons_HMAC.postman_environment.json](docs/postman/Expert_Persons_HMAC.postman_environment.json)
3. **Configure Variables**:
   - `baseUrl`: `https://expert-api-persons-dev.onrender.com/api`
   - `clientId`: Your client identifier
   - `secretKey`: Your secret key
   - `tenantId`: Your tenant ID

### HMAC Pre-request Script

All collections include automatic HMAC signature generation:

```javascript
// Automatic signature generation included in all collections
const timestamp = Date.now().toString();
const signature = CryptoJS.HmacSHA256(payload, secretKey).toString(CryptoJS.enc.Base64);
```

## Development

### Local Development Setup

1. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Database connection**
   ```bash
   # Check database connection
   npm run check-env
   ```

3. **Run migrations**
   ```bash
   npm run migrate
   ```

4. **Generate system catalog**
   ```bash
   npm run generate:catalog
   ```

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run check-env` | Verify environment setup |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

### Environment Configuration

Development uses environment variables for HMAC authentication:

```env
# Development HMAC Configuration
AWS_CLIENT_ID=dev-client
AWS_SECRET_KEY=dev-secret-key-123
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expert_core
DB_USER=postgres
DB_PASSWORD=your-password
```

## Testing

### E2E Testing Results

- **Success Rate**: 71.4% (56 passed / 22 failed)
- **Total Endpoints**: 78 endpoints tested
- **Test Framework**: Vitest + Supertest
- **Database**: Real PostgreSQL (no mocks)
- **Authentication**: HMAC-SHA256 validated

### Test Categories

| Category | Tests | Status | Description |
|----------|-------|--------|-------------|
| **Core Endpoints** | 19 | ✅ Passing | Basic CRUD operations |
| **HMAC Authentication** | 12 | ✅ Passing | Authentication validation |
| **Composite Operations** | 8 | ✅ Passing | Multi-table operations |
| **Person Services** | 25 | 🟡 Mixed | Individual service tests |
| **Edge Cases** | 14 | 🟡 Mixed | Error handling and validation |

### Running Tests

```bash
# Run all E2E tests
npm run test

# Run with watch mode
npm run test:vitest:watch

# Run specific test categories
npm run test:endpoints
npm run test:schema
npm run test:connection

# Run with coverage
npm run test:coverage
```

### No Mocks Policy

All tests use real database connections and actual HTTP requests to ensure production-like testing conditions.

## Deployment

### Production Deployment

**Live URL**: https://expert-api-persons-dev.onrender.com

### Render Configuration

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 16.x
- **Environment**: Production
- **Health Check**: `/api/health`

### Environment Variables (Production)

```env
NODE_ENV=production
AWS_REGION=us-east-1
AWS_CLIENT_ID=expert-client-prod
# Database credentials configured in Render
```

### Health Check

Monitor service health:

```bash
curl https://expert-api-persons-dev.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-06-01T20:25:30.000Z",
    "version": "1.0.0"
  },
  "message": "Service is healthy"
}
```

### Monitoring

- **Uptime**: Monitored via Render dashboard
- **Logs**: Available in Render console
- **Performance**: Response time tracking
- **Errors**: Automatic error reporting

## Architecture

### Design Patterns

**Route → Controller → Service Pattern**

```
routes/personsRoutes.js
    ↓
controllers/personsController.js
    ↓
services/personsService.js
    ↓
PostgreSQL Database
```

### Database Design

- **Tenant Isolation**: All tables include `tenant_id` for multi-tenancy
- **Soft Deletes**: `deleted_date` field instead of hard deletes
- **Audit Trail**: `created_date`, `last_modified_date`, `created_by`, `last_modified_by`
- **JSONB Support**: Flexible data structures for metadata
- **Indexing**: Foreign keys and frequently queried fields

### Query Optimization

- **Single Query Pattern**: JSONB aggregation with LATERAL joins
- **Pagination**: Limit/offset with 500 record maximum
- **Include Filters**: Selective data loading
- **Parameterized Queries**: SQL injection prevention

### Security Architecture

- **HMAC Authentication**: Stateless, replay-attack resistant
- **AWS Secrets Manager**: Centralized secret management
- **Tenant Isolation**: Row-level security
- **Input Validation**: Express-validator middleware
- **Rate Limiting**: Request throttling

## Contributing

### Development Guidelines

1. **Code Style**: Prettier (100 char width) + ESLint Airbnb
2. **Testing**: All new endpoints require E2E tests
3. **Documentation**: Update API docs and Postman collections
4. **Authentication**: All endpoints must use HMAC authentication
5. **Database**: No ORMs, use parameterized SQL queries

### Pull Request Process

1. **Branch**: Create feature branch from `development`
2. **Tests**: Ensure all tests pass (`npm run test`)
3. **Lint**: Fix all linting issues (`npm run lint:fix`)
4. **Documentation**: Update relevant documentation
5. **Review**: Submit PR for code review

### Code Standards

```javascript
// ✅ Good: Parameterized query with tenant isolation
const result = await pool.query(
  'SELECT * FROM persons WHERE tenant_id = $1 AND deleted_date IS NULL',
  [tenantId]
);

// ❌ Bad: String concatenation, no tenant isolation
const result = await pool.query(
  `SELECT * FROM persons WHERE id = '${personId}'`
);
```

## API Reference

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/persons` | List persons |
| `GET` | `/api/persons/{id}` | Get person with composite data |
| `POST` | `/api/persons` | Create person |
| `PUT` | `/api/persons/{id}` | Update person |
| `DELETE` | `/api/persons/{id}` | Soft delete person |

### Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid parameters |
| `401` | Unauthorized | Authentication failed |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `422` | Unprocessable Entity | Validation errors |
| `500` | Internal Server Error | Server error |

### Authentication Headers

All requests require these headers:

```http
x-client-id: your-client-id
x-signature: base64-hmac-signature
x-timestamp: unix-timestamp-ms
x-tenant-id: tenant-uuid
Content-Type: application/json
```

## Troubleshooting

### Common Issues

#### Authentication Errors

**Problem**: `401 Unauthorized - Invalid HMAC signature`

**Solutions**:
1. Verify timestamp is within ±5 minutes of server time
2. Check signature generation algorithm
3. Ensure secret key matches AWS Secrets Manager
4. Validate payload construction (path for GET, body for POST)

```bash
# Test timestamp
date +%s000

# Verify signature generation
echo -n "/api/persons1638360000000" | openssl dgst -sha256 -hmac "your-secret" -binary | base64
```

#### Database Connection Issues

**Problem**: `Connection refused` or `Database timeout`

**Solutions**:
1. Check environment variables
2. Verify database is running
3. Test connection manually

```bash
# Test database connection
npm run check-env

# Manual connection test
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
```

#### Performance Issues

**Problem**: Slow response times

**Solutions**:
1. Check query performance with `EXPLAIN ANALYZE`
2. Verify indexes on foreign keys
3. Use `include` parameter to limit data
4. Monitor database connection pool

#### Validation Errors

**Problem**: `422 Unprocessable Entity`

**Solutions**:
1. Check required fields in request body
2. Verify data types match schema
3. Ensure UUIDs are valid format
4. Check field length limits

### Error Debugging

Enable detailed logging:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

Check logs for detailed error information:

```bash
# View recent logs
tail -f logs/app.log

# Search for specific errors
grep "ERROR" logs/app.log
```

### Performance Considerations

- **Pagination**: Always use `limit` parameter for large datasets
- **Include Filters**: Specify only needed related data
- **Caching**: Consider implementing Redis for frequently accessed data
- **Connection Pooling**: Monitor PostgreSQL connection usage

---

## License

ISC License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/api/](docs/api/)
- **Issues**: [GitHub Issues](https://github.com/ECAInternational/expert-api-persons/issues)
- **API Status**: https://expert-api-persons-dev.onrender.com/api/health

---

**Expert Persons API v1.0.0** - Production-ready person management microservice for Global Mobility platforms.
