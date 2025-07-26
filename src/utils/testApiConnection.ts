import { ConnectionTestService } from '../services/api/connectionTestService';

/**
 * Utility function to test API connection from browser console
 * Usage: testApiConnection()
 */
export const testApiConnection = async () => {
  console.log('🔄 Starting API connection test...');
  
  const result = await ConnectionTestService.runFullTest();
  
  if (result.overallSuccess) {
    console.log('✅ API Connection Test PASSED');
    console.log('All tests successful:', result.tests);
  } else {
    console.log('❌ API Connection Test FAILED');
    console.log('Failed tests:');
    result.tests.forEach(test => {
      if (!test.success) {
        console.log(`  - ${test.name}: ${test.message}`);
        if (test.details) {
          console.log('    Details:', test.details);
        }
      }
    });
  }
  
  return result;
};

/**
 * Quick test for just basic connectivity
 */
export const testBasicConnection = async () => {
  console.log('🔄 Testing basic API connectivity...');
  
  const result = await ConnectionTestService.testConnection();
  
  if (result.success) {
    console.log('✅ Basic connection successful');
    console.log(result.message);
  } else {
    console.log('❌ Basic connection failed');
    console.log(result.message);
    if (result.details) {
      console.log('Details:', result.details);
    }
  }
  
  return result;
};

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).testApiConnection = testApiConnection;
  (window as any).testBasicConnection = testBasicConnection;
}