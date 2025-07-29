// Debug script to test the person list API directly
import { personService } from './src/profiles/services/api/personService.js';

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
    
    // Test 4: Different search terms
    console.log('\n4️⃣ Testing different search terms...');
    const names = ['a', 'smith', 'test', 'admin'];
    
    for (const name of names) {
      const result = await personService.getPersonsList({ 
        limit: 10, 
        offset: 0, 
        search: name 
      });
      console.log(`Search "${name}":`, {
        total: result.total,
        returned: result.persons.length
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing person list:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Run the debug
debugPersonList();