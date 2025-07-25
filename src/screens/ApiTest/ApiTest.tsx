import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getApiClient } from '@/services/api/api-client';
import { personService } from '@/services/api/personService';

export const ApiTest = () => {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/persons');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEndpoints = [
    { label: 'List Persons', method: 'GET', endpoint: '/persons' },
    { label: 'Get Person by ID', method: 'GET', endpoint: '/persons/{person_id}' },
    { label: 'Get Person Addresses', method: 'GET', endpoint: '/persons/{person_id}/addresses' },
    { label: 'Get Person Contact', method: 'GET', endpoint: '/persons/{person_id}/contact-details' },
    { label: 'Get Person Employment', method: 'GET', endpoint: '/persons/{person_id}/employment' },
    { label: 'Create Person', method: 'POST', endpoint: '/persons' },
    { label: 'Update Person', method: 'PATCH', endpoint: '/persons/{person_id}' },
  ];

  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const client = getApiClient();
      let result;

      switch (method) {
        case 'GET':
          result = await client.get(endpoint);
          break;
        case 'POST':
          result = await client.post(endpoint, body ? JSON.parse(body) : undefined);
          break;
        case 'PUT':
          result = await client.put(endpoint, body ? JSON.parse(body) : undefined);
          break;
        case 'PATCH':
          result = await client.patch(endpoint, body ? JSON.parse(body) : undefined);
          break;
        case 'DELETE':
          result = await client.delete(endpoint);
          break;
        default:
          throw new Error('Unsupported method');
      }

      setResponse(result);
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'An error occurred');
      if (err.data) {
        setResponse(err.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async (testType: string) => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      let result;
      switch (testType) {
        case 'list':
          result = await personService.getPersons({ limit: 5 });
          break;
        case 'listWithSearch':
          result = await personService.getPersons({ limit: 5, search: 'Michael' });
          break;
        case 'getFirst':
          const list = await personService.getPersons({ limit: 1 });
          if (list.persons.length > 0) {
            result = await personService.getPerson(list.persons[0].person_id);
          } else {
            throw new Error('No persons found');
          }
          break;
        default:
          throw new Error('Unknown test type');
      }

      setResponse(result);
    } catch (err: any) {
      console.error('Quick Test Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Test Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Endpoint</label>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/persons"
                className="mt-1"
              />
            </div>
          </div>

          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div>
              <label className="text-sm font-medium">Request Body (JSON)</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"first_name": "John", "last_name": "Doe"}'
                className="mt-1 font-mono text-sm"
                rows={5}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleTest} disabled={loading}>
              {loading ? 'Testing...' : 'Send Request'}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Quick Tests</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickTest('list')}
                disabled={loading}
              >
                List First 5 Persons
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickTest('listWithSearch')}
                disabled={loading}
              >
                Search for "Michael"
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickTest('getFirst')}
                disabled={loading}
              >
                Get First Person Details
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Example Endpoints</h3>
            <div className="space-y-1">
              {testEndpoints.map((test, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMethod(test.method);
                    setEndpoint(test.endpoint);
                  }}
                  className="block text-left text-sm text-blue-600 hover:underline"
                >
                  {test.method} {test.endpoint} - {test.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-red-600">{error}</pre>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm overflow-auto bg-gray-50 p-4 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">API URL:</span> {import.meta.env.VITE_EXPERT_PERSON_URL}
            </div>
            <div>
              <span className="font-medium">Client ID:</span> {import.meta.env.VITE_HMAC_CLIENT_ID}
            </div>
            <div>
              <span className="font-medium">Tenant ID:</span> {import.meta.env.VITE_TEST_TENANT_ID}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};