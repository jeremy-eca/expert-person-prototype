// Debug script to test the person list API directly
import { personService } from './src/profiles/services/api/personService';

async function debugPersonList() {
  console.log('🔍 Testing Person List API...');
  
  try {
    // Test 1: Basic list call
    console.log('\n1️⃣ Testing basic list call...');
    const basicResult = await personService.getPersonsList({ limit: 10, offset: 0 });
    console.log('Basic result:', {
      total: basicResult.total,
      returned: basicResult.persons.length,
      limit: basicResult.limit,
      offset: basicResult.offset
    });
    
    if (basicResult.persons.length > 0) {
      console.log('First person:', basicResult.persons[0]);
    }
    
    // Test 2: Search call
    console.log('\n2️⃣ Testing search call...');
    const searchResult = await personService.getPersonsList({ 
      limit: 50, 
      offset: 0, 
      search: 'john' // Try a common first name
    });
    console.log('Search result:', {
      total: searchResult.total,
      returned: searchResult.persons.length,
      searchTerm: 'john'
    });
    
    // Test 3: Get all call
    console.log('\n3️⃣ Testing get all call...');
    const allResult = await personService.getAllPersons();
    console.log('Get all result:', {
      total: allResult.total,
      returned: allResult.persons.length
    });
    
    // Test 4: Check the actual API endpoint and params
    console.log('\n4️⃣ Testing raw API call details...');
    console.log('API Base URL:', process.env.VITE_EXPERT_PEOPLE_URL || 'Not set');
    console.log('Environment variables:');
    console.log('- VITE_EXPERT_PEOPLE_URL:', process.env.VITE_EXPERT_PEOPLE_URL);
    console.log('- VITE_HMAC_CLIENT_ID:', process.env.VITE_HMAC_CLIENT_ID ? 'Set' : 'Not set');
    console.log('- VITE_HMAC_CLIENT_KEY:', process.env.VITE_HMAC_CLIENT_KEY ? 'Set' : 'Not set');
    
  } catch (error: any) {
    console.error('❌ Error testing person list:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params
    });
  }
}

// Run the debug
debugPersonList().catch(console.error);