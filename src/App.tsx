import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { List } from './screens/List/List';
import { AltRightPanel } from './screens/AltRightPanel';
import { ApiTest } from './screens/ApiTest/ApiTest';
import { initializeApiClient } from './services/api/api-client';

// Initialize API client with correct environment variables
initializeApiClient({
  baseUrl: import.meta.env.VITE_EXPERT_PERSON_URL || 'https://expert-api-persons-dev.onrender.com',
  clientId: import.meta.env.VITE_HMAC_CLIENT_ID || 'expert-core',
  secretKey: import.meta.env.VITE_HMAC_CLIENT_KEY || 'jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r',
  tenantId: import.meta.env.VITE_TEST_TENANT_ID || '01958944-0916-78c8-978d-d2707b71e17d',
  timeout: 30000,
});

function App() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showApiTest, setShowApiTest] = useState(false);

  const handlePersonSelect = (personId: string | null) => {
    setSelectedPersonId(personId);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setSelectedPersonId(null);
  };

  // Check URL params for API test mode
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test') === 'api') {
      setShowApiTest(true);
    }
  }, []);

  if (showApiTest) {
    return (
      <ThemeProvider>
        <ApiTest />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {showForm ? (
        /* Show only the form when a person is selected */
        <AltRightPanel 
          personId={selectedPersonId} 
          onBack={handleBackToList}
        />
      ) : (
        /* Show the list when no person is selected */
        <List onPersonSelect={handlePersonSelect} />
      )}
    </ThemeProvider>
  );
}

export default App;