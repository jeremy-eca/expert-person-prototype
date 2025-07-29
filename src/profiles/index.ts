// Profiles Module Entry Point
// This module provides a complete profiles management system for Remix applications

// Main Screens
export { ProfilesList } from './screens/ProfilesList/ProfilesList';
export { ProfilesCreate } from './screens/ProfilesCreate/ProfilesCreate';
export { ProfilesEdit } from './screens/ProfilesEdit/ProfilesEdit';

// Types
export type { ProfilesCreateProps, ProfilesCreateFormState, FormCardProps } from './screens/ProfilesCreate/types/ProfilesCreateTypes';
export type { ProfileSectionType } from './screens/ProfilesEdit/ProfilesEdit';

// Hooks
export { usePersonData } from './hooks/usePersonData';
export { useCountries } from './hooks/useCountries';
export { useGenders } from './hooks/useGenders';
export { useNationalities } from './hooks/useNationalities';
export { usePronouns } from './hooks/usePronouns';
export { useTitles } from './hooks/useTitles';

// UI Components  
export { CountryAutocomplete, default as CountryAutocompleteDefault } from './components/ui/country-autocomplete';
export { NationalityAutocomplete, default as NationalityAutocompleteDefault } from './components/ui/nationality-autocomplete';
export { LanguageEditor } from './components/ui/language-editor';

// Services
export { PersonService } from './services/api/personService';
export { ReferenceDataService } from './services/api/referenceDataService';
export { ConnectionTestService } from './services/api/connectionTestService';
export { googlePlacesService } from './services/googlePlacesService';

// Types (Re-exports for convenience)
export type * from './types/api.types';
export type * from './types/frontend.types';
export type * from './types/CountryTypes';
export type * from './types/NationalityTypes';
export type * from './types/PronounTypes';

// Module Configuration
export interface ProfilesModuleConfig {
  // API Configuration
  coreApiUrl: string;
  personsApiUrl: string;
  applicationId: string;
  secretKey: string;
  testLanguage?: string;
  
  // Google Places Configuration (optional)
  googlePlacesApiKey?: string;
  
  // UI Configuration
  theme?: 'light' | 'dark';
  
  // Feature Flags
  features?: {
    enableAddressAutocomplete?: boolean;
    enableLanguageEditor?: boolean;
    enableNationalityMultiSelect?: boolean;
  };
}

// Default configuration
export const defaultProfilesConfig: Partial<ProfilesModuleConfig> = {
  testLanguage: 'en',
  theme: 'light',
  features: {
    enableAddressAutocomplete: true,
    enableLanguageEditor: true,
    enableNationalityMultiSelect: true,
  },
};

// Module initialization helper
export const initializeProfilesModule = (config: ProfilesModuleConfig) => {
  // Set environment variables for the module
  if (typeof window === 'undefined') {
    // Server-side - these should be set via actual environment variables
    console.warn('Profiles module: Environment variables should be set server-side');
  } else {
    // Client-side - store in a global config object
    (window as any).__PROFILES_CONFIG__ = config;
  }
  
  return {
    config,
    isInitialized: true,
  };
};

// Helper to get current config
export const getProfilesConfig = (): ProfilesModuleConfig | null => {
  if (typeof window !== 'undefined' && (window as any).__PROFILES_CONFIG__) {
    return (window as any).__PROFILES_CONFIG__;
  }
  return null;
};