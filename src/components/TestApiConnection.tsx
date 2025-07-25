import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeApiClient } from '@/services/api/client';
import { personService } from '@/services/api/personService';
import { mapPersonToListItem } from '@/services/mappers/personMapper';

export function TestApiConnection() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      // Initialize API client
      initializeApiClient({
        baseUrl: import.meta.env.VITE_API_URL || 'https://expert-api-persons-dev.onrender.com',
        clientId: import.meta.env.VITE_CLIENT_ID || 'expert-core',
        clientSecret: import.meta.env.VITE_CLIENT_SECRET || 'jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r',
        tenantId: import.meta.env.VITE_TENANT_ID || '01958944-0916-78c8-978d-d2707b71e17d',
        timeout: 30000,
      });

      setResults(prev => [...prev, '✅ API client initialized']);

      // Test 1: Get list of persons
      setResults(prev => [...prev, '📋 Fetching list of persons...']);
      const listResult = await personService.getPersons({ limit: 5 });
      
      setResults(prev => [...prev, 
        `✅ Retrieved ${listResult.total} total persons`,
        `Showing first ${listResult.persons.length}:`
      ]);

      // Map and display persons
      const mappedPersons = listResult.persons.map(p => {
        // For testing, we'll just map basic data
        return mapPersonToListItem({
          ...p,
          addresses: [],
          contact_details: undefined,
          employment: []
        });
      });

      mappedPersons.forEach((person, index) => {
        setResults(prev => [...prev, 
          `  ${index + 1}. ${person.name} (${person.department || 'No dept'})`
        ]);
      });

      // Test 2: Get detailed person data
      if (listResult.persons.length > 0) {
        const personId = listResult.persons[0].id;
        setResults(prev => [...prev, 
          '',
          `📋 Fetching full details for ${listResult.persons[0].first_name}...`
        ]);
        
        const fullPerson = await personService.getPersonWithAllData(personId);
        
        setResults(prev => [...prev, 
          `✅ Retrieved full person data:`,
          `  - Addresses: ${fullPerson.addresses?.length || 0}`,
          `  - Employment: ${fullPerson.employment?.length || 0}`,
          `  - Partners: ${fullPerson.partners?.length || 0}`,
          `  - Children: ${fullPerson.children?.length || 0}`,
          `  - Languages: ${fullPerson.languages?.length || 0}`,
          '',
          '🎉 All tests passed! API connection working correctly.'
        ]);
      }

    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Check if it's an API error with additional details
      if (err && typeof err === 'object' && 'data' in err) {
        setError(prev => prev + '\n' + JSON.stringify((err as any).data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Test the HMAC authentication and API connection.</p>
            <p className="mt-2">Configuration:</p>
            <ul className="list-disc list-inside ml-4">
              <li>API URL: {import.meta.env.VITE_API_URL || 'Using default'}</li>
              <li>Client ID: {import.meta.env.VITE_CLIENT_ID || 'Using default'}</li>
              <li>Tenant ID: {import.meta.env.VITE_TENANT_ID?.substring(0, 8) || 'Using default'}...</li>
            </ul>
          </div>

          <Button 
            onClick={runTest}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Running Test...' : 'Run API Test'}
          </Button>

          {results.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {results.join('\n')}
              </pre>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">Error:</p>
              <pre className="text-xs font-mono whitespace-pre-wrap text-red-700 mt-1">
                {error}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}