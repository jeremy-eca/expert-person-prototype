# Profiles Module

A self-contained, modular profiles management system designed for easy integration into Remix applications. This module provides complete person/profile management functionality including creation, editing, and listing.

## Overview

The Profiles module is structured as a complete, standalone module that can be easily copied and integrated into any Remix application. It includes:

- **ProfilesList**: Browse and search existing profiles
- **ProfilesCreate**: Create new person profiles
- **ProfilesEdit**: Edit existing person profiles

## Directory Structure

```
src/modules/profiles/
├── components/           # Module-specific UI components
│   └── ui/              # Profile-specific UI components
├── hooks/               # Profile-related React hooks
├── screens/            # Main screen components
│   ├── ProfilesList/   # Profile listing screen
│   ├── ProfilesCreate/ # Profile creation screen
│   └── ProfilesEdit/   # Profile editing screen
├── services/           # API services and data access
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── index.ts            # Module entry point
└── README.md           # This file
```

## Quick Start

### 1. Installation

Copy the entire `src/modules/profiles/` directory to your Remix application.

### 2. Basic Usage

```typescript
import React from 'react';
import { 
  ProfilesList, 
  ProfilesCreate, 
  ProfilesEdit,
  initializeProfilesModule 
} from './modules/profiles';

// Initialize the module with your configuration
initializeProfilesModule({
  coreApiUrl: 'https://your-core-api.com',
  personsApiUrl: 'https://your-persons-api.com',
  applicationId: 'your-app-id',
  secretKey: 'your-secret-key',
  testLanguage: 'en',
});

// Use the components in your app
function App() {
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  return (
    <div>
      {currentScreen === 'list' && (
        <ProfilesList 
          onPersonSelect={setSelectedPersonId}
          onCreatePerson={() => setCurrentScreen('create')}
        />
      )}
      
      {currentScreen === 'create' && (
        <ProfilesCreate 
          onPersonCreated={(id) => {
            setSelectedPersonId(id);
            setCurrentScreen('edit');
          }}
          onCancel={() => setCurrentScreen('list')}
        />
      )}
      
      {currentScreen === 'edit' && (
        <ProfilesEdit 
          personId={selectedPersonId}
          onBack={() => setCurrentScreen('list')}
        />
      )}
    </div>
  );
}
```

### 3. Environment Variables

Add these environment variables to your `.env` file:

```bash
# Core API Configuration
VITE_EXPERT_CORE_URL=https://your-core-api.com
VITE_EXPERT_PERSON_URL=https://your-persons-api.com

# Authentication
VITE_HMAC_CLIENT_ID=your-client-id
VITE_HMAC_CLIENT_KEY=your-secret-key

# Optional Configuration
VITE_TEST_LANGUAGE=en
VITE_TEST_TENANT_ID=your-tenant-id
VITE_GOOGLE_PLACES_API_KEY=your-google-places-key
```

## Configuration

### Module Configuration

```typescript
interface ProfilesModuleConfig {
  // Required
  coreApiUrl: string;           // Core API endpoint
  personsApiUrl: string;        // Persons API endpoint
  applicationId: string;        // Application ID for HMAC auth
  secretKey: string;           // Secret key for HMAC auth
  
  // Optional
  testLanguage?: string;       // Default language (default: 'en')
  googlePlacesApiKey?: string; // For address autocomplete
  theme?: 'light' | 'dark';    // UI theme
  
  // Feature flags
  features?: {
    enableAddressAutocomplete?: boolean;
    enableLanguageEditor?: boolean;
    enableNationalityMultiSelect?: boolean;
  };
}
```

### Default Configuration

```typescript
import { defaultProfilesConfig } from './modules/profiles';

const config = {
  ...defaultProfilesConfig,
  coreApiUrl: 'your-api-url',
  // ... other required fields
};
```

## API Integration

The module integrates with two main APIs:

### 1. Core API
- **Endpoint**: `VITE_EXPERT_CORE_URL`
- **Purpose**: Reference data (titles, genders, pronouns, countries, etc.)
- **Authentication**: HMAC-SHA256

### 2. Persons API  
- **Endpoint**: `VITE_EXPERT_PERSON_URL`
- **Purpose**: Person profile CRUD operations
- **Authentication**: HMAC-SHA256

### Authentication

The module uses HMAC-SHA256 authentication. All API calls are automatically authenticated using the provided `applicationId` and `secretKey`.

## Components

### ProfilesList

Browse and search existing profiles with pagination and filtering.

**Props:**
```typescript
interface ProfilesListProps {
  onPersonSelect: (personId: string | null) => void;
  onCreatePerson?: () => void;
}
```

### ProfilesCreate

Create new person profiles with comprehensive form validation.

**Props:**
```typescript
interface ProfilesCreateProps {
  onPersonCreated?: (personId: string) => void;
  onCancel?: () => void;
}
```

### ProfilesEdit

Edit existing person profiles with all available fields and sections.

**Props:**
```typescript
interface ProfilesEditProps {
  personId: string | null;
  onBack: () => void;
  onPersonSelect?: (personId: string) => void;
}
```

## Hooks

The module provides several React hooks for data fetching:

- `usePersonData(options)` - Fetch and manage person profile data
- `useCountries(options)` - Fetch country reference data
- `useGenders(options)` - Fetch gender reference data
- `useNationalities(options)` - Fetch nationality reference data
- `usePronouns(options)` - Fetch pronoun reference data
- `useTitles(options)` - Fetch title reference data

## Services

- `PersonService` - Person profile API operations
- `ReferenceDataService` - Reference data API operations
- `ConnectionTestService` - API connectivity testing
- `googlePlacesService` - Google Places integration (singleton instance)

## TypeScript Support

The module is fully typed with comprehensive TypeScript definitions. All components, hooks, and services include proper type definitions.

## Styling

The module uses:
- **Tailwind CSS** for styling
- **Shadcn UI** components for consistent UI
- **Dark theme** by default (configurable)

## Features

### Core Features
- ✅ Person profile creation
- ✅ Person profile editing
- ✅ Person profile listing with search
- ✅ Multi-language support
- ✅ Reference data integration
- ✅ Form validation
- ✅ Error handling

### Advanced Features
- ✅ Address autocomplete (Google Places)
- ✅ Language skills editor
- ✅ Multiple nationality selection
- ✅ File upload support
- ✅ Real-time data synchronization
- ✅ Pagination and filtering

## Integration with Remix

### Route Structure

When integrating with Remix, you might structure your routes like:

```
app/routes/
├── profiles._index.tsx          # ProfilesList
├── profiles.create.tsx          # ProfilesCreate  
└── profiles.$personId.edit.tsx  # ProfilesEdit
```

### Example Remix Route

```typescript
// app/routes/profiles._index.tsx
import { ProfilesList } from '~/modules/profiles';

export default function ProfilesIndex() {
  return (
    <ProfilesList 
      onPersonSelect={(id) => navigate(`/profiles/${id}/edit`)}
      onCreatePerson={() => navigate('/profiles/create')}
    />
  );
}
```

## Migration from Existing Code

If migrating from the original structure:

1. **List.tsx** → **ProfilesList**
2. **PersonCreate** → **ProfilesCreate**
3. **AltRightPanel** → **ProfilesEdit**

The interfaces remain largely the same, just with updated naming conventions.

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all paths are correctly resolved
2. **API Errors**: Verify environment variables are set correctly
3. **Authentication Errors**: Check HMAC credentials
4. **Type Errors**: Ensure TypeScript dependencies are installed

### Debug Mode

Enable debug logging by setting:
```bash
VITE_DEBUG_PROFILES=true
```

## Contributing

When making changes to the module:

1. Follow existing naming conventions
2. Update TypeScript types accordingly
3. Test all three screens (List, Create, Edit)
4. Verify API integration works
5. Update this README if needed

## License

This module is designed for internal use and follows the same licensing as the parent application.