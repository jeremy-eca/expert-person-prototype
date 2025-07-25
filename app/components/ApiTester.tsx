import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { getProfileDataService } from '../modules/profile/services/ProfileDataService';

export const ApiTester = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);

  const testApiEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestResult(null);
      setRequestDetails(null);

      const profileDataService = getProfileDataService();
      
      // Capture request details
      const baseUrl = (profileDataService as any).baseUrl;
      const timeout = (profileDataService as any).timeout;
      const basePath = (profileDataService as any).basePath;
      
      const fullUrl = `${baseUrl}/api${basePath}`;
      
      setRequestDetails({
        baseUrl,
        timeout,
        basePath,
        fullUrl,
        method: 'GET',
        params: {
          limit: 10,
          offset: 0
        }
      });

      // Make the actual API call
      const result = await profileDataService.getPersonsList({
        limit: 10,
        offset: 0
      });

      setTestResult({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'Unknown error occurred');
      setTestResult({
        success: false,
        error: err.message,
        status: err.status || 'Unknown',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = 'http://localhost:3001/api/persons?limit=10&offset=0';
      
      setRequestDetails({
        method: 'Direct Fetch (no HMAC)',
        url,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.text();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data ? JSON.parse(data) : null,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error('Direct Fetch Error:', err);
      setError(err.message);
      setTestResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testApiEndpoint} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test ProfileDataService API'}
            </Button>
            <Button 
              onClick={testDirectFetch} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test Direct Fetch (No Auth)'}
            </Button>
          </div>

          {requestDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(requestDetails, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {testResult && (
            <Card className={testResult.success ? 'border-green-200' : 'border-red-200'}>
              <CardHeader>
                <CardTitle className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                  Test Result {testResult.success ? '✅' : '❌'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};