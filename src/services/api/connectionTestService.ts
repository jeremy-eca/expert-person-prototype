import { getApiClient } from './api-client';

/**
 * Service for testing API connectivity and authentication
 */
export class ConnectionTestService {
  /**
   * Test basic API connectivity and authentication
   * @returns Promise<{ success: boolean, message: string, details?: any }>
   */
  static async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const client = getApiClient();
      
      // Try the persons list endpoint with minimal parameters
      // This should work if API is accessible and authentication is working
      const response = await client.get('/persons/list?limit=1');
      
      const responseData = response.data as any;
      
      // Check if we got any response that indicates the API is working
      // Even if there's no data, a proper response structure means the API is accessible
      if (responseData && (responseData.success !== false || responseData.data !== undefined)) {
        return {
          success: true,
          message: 'Successfully connected to API with HMAC authentication',
          details: {
            endpoint: 'https://expert-api-persons-dev.onrender.com',
            authentication: 'HMAC-SHA256',
            responseReceived: true,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          message: 'API returned unsuccessful response',
          details: responseData
        };
      }
    } catch (error: any) {
      // Parse the error to provide meaningful feedback
      let message = 'Failed to connect to API';
      let details: any = {};
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            message = 'Authentication failed - check HMAC credentials';
            details = { status, message: 'Unauthorized', data };
            break;
          case 403:
            message = 'Access forbidden - check API permissions';
            details = { status, message: 'Forbidden', data };
            break;
          case 404:
            message = 'API endpoint not found';
            details = { status, message: 'Not Found', data };
            break;
          case 500:
            message = 'Server error - API may be temporarily unavailable';
            details = { status, message: 'Internal Server Error', data };
            break;
          default:
            message = `API error (${status}): ${data?.message || 'Unknown error'}`;
            details = { status, data };
        }
      } else if (error.request) {
        // Network error - no response received
        message = 'Network error - unable to reach API server';
        details = { 
          type: 'network_error',
          url: 'https://expert-api-persons-dev.onrender.com',
          message: 'Check internet connection and API server status'
        };
      } else {
        // Other error
        message = error.message || 'Unknown connection error';
        details = { type: 'unknown_error', error: error.toString() };
      }
      
      console.error('API connection test failed:', error);
      
      return {
        success: false,
        message,
        details
      };
    }
  }

  /**
   * Test specific person API endpoint with metadata
   * @returns Promise<{ success: boolean, message: string, details?: any }>
   */
  static async testPersonAPI(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const client = getApiClient();
      
      // Test the metadata endpoint which is specific to persons API
      const response = await client.get('/metadata/fields?entity_context=person&language_code=en');
      
      const responseData = response.data as any;
      if (responseData && (responseData.success !== false || responseData.data !== undefined)) {
        return {
          success: true,
          message: 'Person API with metadata is accessible and responding correctly',
          details: {
            endpoint: '/metadata/fields',
            metadataFields: Object.keys(responseData.data || {}).length,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          success: false,
          message: 'Person API metadata endpoint returned unexpected response format',
          details: responseData
        };
      }
    } catch (error: any) {
      console.error('Person API test failed:', error);
      
      return {
        success: false,
        message: `Person API metadata test failed: ${error.response?.data?.message || error.message}`,
        details: {
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }

  /**
   * Run comprehensive connection tests
   * @returns Promise<{ overallSuccess: boolean, tests: Array<TestResult> }>
   */
  static async runFullTest(): Promise<{
    overallSuccess: boolean;
    tests: Array<{
      name: string;
      success: boolean;
      message: string;
      details?: any;
    }>;
  }> {
    const tests = [];
    
    // Test 1: Basic API connectivity
    console.log('Testing API connectivity...');
    const connectionTest = await this.testConnection();
    tests.push({
      name: 'Basic API Connectivity',
      ...connectionTest
    });
    
    // Test 2: Person API specific test
    console.log('Testing Person API with Metadata...');
    const personTest = await this.testPersonAPI();
    tests.push({
      name: 'Person API with Metadata',
      ...personTest
    });
    
    const overallSuccess = tests.every(test => test.success);
    
    // Log summary
    if (overallSuccess) {
      console.log('✅ All API connection tests passed');
    } else {
      console.log('❌ Some API connection tests failed');
      tests.forEach(test => {
        if (!test.success) {
          console.log(`  - ${test.name}: ${test.message}`);
        }
      });
    }
    
    return {
      overallSuccess,
      tests
    };
  }
}