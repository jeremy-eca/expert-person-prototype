# API Connection Testing Guide

This guide explains how to test the HMAC authentication and API connection to the Expert Persons API.

## Prerequisites

1. Ensure you have the `.env` file with the correct credentials:
   ```
   VITE_API_URL=https://expert-api-persons-dev.onrender.com
   VITE_CLIENT_ID=expert-core
   VITE_CLIENT_SECRET=jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r
   VITE_TENANT_ID=01958944-0916-78c8-978d-d2707b71e17d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Testing Methods

### Method 1: Browser Test Page (Simplest)

1. Open `test-api.html` in your browser:
   ```bash
   open test-api.html
   ```
   or just double-click the file in your file explorer.

2. Click the "Run API Test" button
3. Check the console output for authentication details and response data

### Method 2: React Component Test

1. Import the test component in your App.tsx:
   ```typescript
   import { TestApiConnection } from '@/components/TestApiConnection';
   ```

2. Add it to your app:
   ```tsx
   function App() {
     return (
       <div>
         <TestApiConnection />
         {/* Your other components */}
       </div>
     );
   }
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Navigate to your app and click "Run API Test"

### Method 3: Integration in Existing Components

Use the API in your existing components:

```typescript
import { useEffect, useState } from 'react';
import { initializeApiClient } from '@/services/api/client';
import { personService } from '@/services/api/personService';
import { mapPersonToListItem } from '@/services/mappers/personMapper';

// Initialize once in your app entry point
initializeApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  tenantId: import.meta.env.VITE_TENANT_ID,
});

// In your component
function PersonList() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersons() {
      try {
        const result = await personService.getPersons({ limit: 10 });
        const mapped = result.persons.map(p => mapPersonToListItem({
          ...p,
          addresses: [],
          contact_details: undefined,
          employment: []
        }));
        setPersons(mapped);
      } catch (error) {
        console.error('Failed to fetch persons:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPersons();
  }, []);

  // Render your list...
}
```

## What a Successful Response Looks Like

A successful API response will have this structure:
```json
{
  "success": true,
  "data": {
    "persons": [
      {
        "id": "uuid-here",
        "first_name": "John",
        "last_name": "Doe",
        "tenant_id": "01958944-0916-78c8-978d-d2707b71e17d",
        // ... other fields
      }
    ],
    "total": 253,
    "limit": 5,
    "offset": 0
  },
  "message": "Persons retrieved successfully"
}
```

## Common Issues and Solutions

### 401 Unauthorized
- Check that all credentials in `.env` are correct
- Ensure the timestamp is current (not stale)
- Verify the HMAC signature generation matches the server's expectation

### CORS Errors
- The API should have CORS configured for your localhost
- If not, you may need to use a proxy or contact the backend team

### Network Errors
- Check if the API URL is accessible
- Ensure you're connected to the internet
- The API might be rate-limited or temporarily down

## HMAC Authentication Details

The authentication uses HMAC-SHA256 with Base64 encoding:

1. **For GET requests**: 
   - String to sign = `path (lowercase) + timestamp`
   - Example: `/persons1703123456789`

2. **For POST/PUT/PATCH/DELETE**:
   - String to sign = `JSON body + timestamp`
   - Example: `{"name":"John"}1703123456789`

3. **Important**: The server strips the `/api` prefix from paths before signature verification

4. **Headers required**:
   - `x-client-id`: Your client ID
   - `x-signature`: The HMAC signature (Base64)
   - `x-timestamp`: Current timestamp in milliseconds
   - `x-tenant-id`: Your tenant ID
   - `Content-Type`: application/json

## Next Steps

Once the API connection is verified:

1. Remove the test component from your app
2. Start integrating the API service into your actual components
3. Replace hardcoded data with API calls
4. Add proper error handling and loading states
5. Implement caching if needed (consider React Query or SWR)