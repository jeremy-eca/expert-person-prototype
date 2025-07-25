// Test script to verify API connection and HMAC authentication
import { initializeApiClient } from './services/api/client';
import { personService } from './services/api/personService';

// Initialize API client with environment variables
initializeApiClient({
  baseUrl: import.meta.env.VITE_API_URL || 'https://expert-api-persons-dev.onrender.com',
  clientId: import.meta.env.VITE_CLIENT_ID || 'expert-core',
  clientSecret: import.meta.env.VITE_CLIENT_SECRET || 'jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r',
  tenantId: import.meta.env.VITE_TENANT_ID || '01958944-0916-78c8-978d-d2707b71e17d',
  timeout: 30000,
});

async function testApiConnection() {
  console.log('🔧 Testing API Connection...\n');
  console.log('Configuration:');
  console.log('- API URL:', import.meta.env.VITE_API_URL);
  console.log('- Client ID:', import.meta.env.VITE_CLIENT_ID);
  console.log('- Tenant ID:', import.meta.env.VITE_TENANT_ID);
  console.log('- Client Secret:', import.meta.env.VITE_CLIENT_SECRET ? '***SET***' : '***MISSING***');
  console.log('\n');

  try {
    // Test 1: Get list of persons
    console.log('📋 Test 1: Fetching list of persons...');
    const listResult = await personService.getPersons({ limit: 5 });
    console.log('✅ Success! Retrieved', listResult.total, 'total persons');
    console.log('First 5 persons:');
    listResult.persons.forEach((person, index) => {
      console.log(`  ${index + 1}. ${person.first_name} ${person.last_name} (ID: ${person.id})`);
    });
    console.log('\n');

    // Test 2: Get a specific person with full data
    if (listResult.persons.length > 0) {
      const personId = listResult.persons[0].id;
      console.log(`📋 Test 2: Fetching full details for person ${personId}...`);
      const person = await personService.getPersonWithAllData(personId);
      console.log('✅ Success! Retrieved person with:');
      console.log('  - Name:', person.first_name, person.last_name);
      console.log('  - Addresses:', person.addresses?.length || 0);
      console.log('  - Employment records:', person.employment?.length || 0);
      console.log('  - Partners:', person.partners?.length || 0);
      console.log('  - Children:', person.children?.length || 0);
      console.log('  - Languages:', person.languages?.length || 0);
      console.log('  - Notes:', person.notes?.length || 0);
    }

    console.log('\n🎉 All tests passed! API connection is working correctly.');
    return true;
  } catch (error) {
    console.error('\n❌ API Connection Test Failed!');
    if (error instanceof Error) {
      console.error('Error:', error.message);
      if ('status' in error) {
        console.error('Status:', (error as any).status);
      }
      if ('data' in error) {
        console.error('Response data:', (error as any).data);
      }
    } else {
      console.error('Unknown error:', error);
    }
    return false;
  }
}

// Export for use in components or run directly if this file is executed
export { testApiConnection };

// If running this file directly with a tool like tsx or ts-node
if (import.meta.url === `file://${process.argv[1]}`) {
  testApiConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}