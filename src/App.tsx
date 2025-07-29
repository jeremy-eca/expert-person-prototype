import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { ProfilesList, ProfilesCreate, ProfilesEdit, initializeProfilesModule } from './profiles';
import { ProfilesCreateECA } from './profiles/screens/ProfilesCreate/ProfilesCreateECA';
import { initializeApiClient } from './shared/services/api/api-client';

// Initialize API client with correct environment variables
initializeApiClient({
  baseUrl: import.meta.env.VITE_EXPERT_PERSON_URL || 'https://expert-api-persons-dev.onrender.com',
  clientId: import.meta.env.VITE_HMAC_CLIENT_ID || 'expert-core',
  secretKey: import.meta.env.VITE_HMAC_CLIENT_KEY || 'jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r',
  tenantId: import.meta.env.VITE_TEST_TENANT_ID || '01958944-0916-78c8-978d-d2707b71e17d',
  timeout: 30000,
});

// Initialize Profiles module with configuration
initializeProfilesModule({
  coreApiUrl: import.meta.env.VITE_EXPERT_CORE_URL || 'https://expert-api-core-dev.onrender.com',
  personsApiUrl: import.meta.env.VITE_EXPERT_PERSON_URL || 'https://expert-api-persons-dev.onrender.com',
  applicationId: import.meta.env.VITE_HMAC_CLIENT_ID || 'expert-core',
  secretKey: import.meta.env.VITE_HMAC_CLIENT_KEY || 'jH3E2kK28sD9vL9kqP1sT5qQ7wA3zX2r',
  testLanguage: import.meta.env.VITE_TEST_LANGUAGE || 'en',
  googlePlacesApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  theme: 'dark',
  features: {
    enableAddressAutocomplete: true,
    enableLanguageEditor: true,
    enableNationalityMultiSelect: true,
  },
});

function App() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPersonCreate, setShowPersonCreate] = useState(false);
  const [useECAComponents, setUseECAComponents] = useState(false); // Toggle for ECA components

  const handlePersonSelect = (personId: string | null) => {
    setSelectedPersonId(personId);
    setShowForm(true);
    setShowPersonCreate(false);
  };

  const handleCreatePerson = () => {
    setShowPersonCreate(true);
    setShowForm(false);
    setSelectedPersonId(null);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setShowPersonCreate(false);
    setSelectedPersonId(null);
  };

  const handlePersonCreated = (personId: string) => {
    // After person is created, navigate to edit mode
    setSelectedPersonId(personId);
    setShowForm(true);
    setShowPersonCreate(false);
  };


  return (
    <ThemeProvider>
      {/* ECA Components Toggle - Development Only */}
      <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-3 py-1 rounded text-sm">
        <button 
          onClick={() => setUseECAComponents(!useECAComponents)}
          className="hover:underline"
        >
          {useECAComponents ? 'Using ECA Components' : 'Using Original Components'} (Click to toggle)
        </button>
      </div>
      
      {showPersonCreate ? (
        /* Show the person creation form */
        useECAComponents ? (
          <ProfilesCreateECA 
            onPersonCreated={handlePersonCreated}
            onCancel={handleBackToList}
          />
        ) : (
          <ProfilesCreate 
            onPersonCreated={handlePersonCreated}
            onCancel={handleBackToList}
          />
        )
      ) : showForm ? (
        /* Show the person details form when a person is selected */
        <ProfilesEdit 
          personId={selectedPersonId} 
          onBack={handleBackToList}
          onPersonSelect={handlePersonSelect}
        />
      ) : (
        /* Show the list when no person is selected */
        <ProfilesList 
          onPersonSelect={handlePersonSelect}
          onCreatePerson={handleCreatePerson}
        />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2A3440',
            color: '#fff',
            border: '1px solid #40505C',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;