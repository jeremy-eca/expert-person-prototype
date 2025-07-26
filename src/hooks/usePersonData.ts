import { useState, useEffect, useCallback } from 'react';
import { PersonService, personService } from '../services/api/personService';
import { mapPersonToProfile } from '../services/mappers/personMapper';
import { PersonProfile } from '../types/frontend.types';
import { PersonWithMetadata, FieldMetadata } from '../types/api.types';

interface UsePersonDataOptions {
  personId: string | null;
  languageCode?: string;
  autoRefresh?: boolean;
}

interface UsePersonDataReturn {
  profile: PersonProfile | null;
  metadata: Record<string, FieldMetadata>;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProfile: (updatedProfile: PersonProfile) => void;
  getFieldLabel: (fieldId: string, defaultLabel: string) => string;
  getFieldDescription: (fieldId: string) => string | undefined;
  getFieldPlaceholder: (fieldId: string, defaultPlaceholder?: string) => string | undefined;
  isFieldRequired: (fieldId: string, defaultRequired?: boolean) => boolean;
  isFieldVisible: (fieldId: string, defaultVisible?: boolean) => boolean;
}

/**
 * Hook for managing person data with metadata support
 * Provides real-time data fetching, caching, and metadata-driven field labels
 */
export function usePersonData(options: UsePersonDataOptions): UsePersonDataReturn {
  const { personId, languageCode = 'en', autoRefresh = false } = options;
  
  const [profile, setProfile] = useState<PersonProfile | null>(null);
  const [metadata, setMetadata] = useState<Record<string, FieldMetadata>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch person data with metadata
  const fetchPersonData = useCallback(async (refresh = false) => {
    if (!personId || personId === 'new') {
      // Handle new person case
      setProfile({
        id: 'new',
        name: 'New Person',
        initials: 'NP',
        isVIP: false,
        hasOutstandingTasks: false,
        dateOfBirth: undefined,
        nationality: undefined,
        languages: [],
        currentLocation: undefined,
        permanentHome: undefined,
        locationHistory: [],
        employmentRecords: [],
        contact: {
          workEmail: '',
          workPhone: '',
          personalEmail: undefined,
          mobilePhone: undefined
        },
        emergencyContact: undefined,
        contactHistory: [],
        familySummary: {
          maritalStatus: 'Single',
          totalDependents: 0,
          passportsHeld: 0
        },
        familyMembers: [],
        workAuthorization: undefined,
        complianceDocuments: [],
        moves: [],
        documents: [],
        communications: [],
        activities: []
      });
      setMetadata({});
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Fetch person data with metadata
      const personWithMetadata: PersonWithMetadata = await personService.getPersonWithMetadata(
        personId, 
        languageCode
      );

      // Map to frontend profile format
      const mappedProfile = mapPersonToProfile(personWithMetadata.person);
      setProfile(mappedProfile);
      
      // Handle metadata fields extraction
      console.log('🔄 [HOOK] Raw metadata structure:', personWithMetadata.metadata);
      const metadataFields = personWithMetadata.metadata?.fields || personWithMetadata.metadata || {};
      console.log('🔄 [HOOK] Extracted metadata fields:', metadataFields);
      setMetadata(metadataFields);

    } catch (err: any) {
      console.error('Failed to fetch person data:', err);
      setError(err.message || 'Failed to load person details');
      
      // Fallback to empty profile on error for new person creation
      if (personId === 'new') {
        setProfile({
          id: 'new',
          name: 'New Person',
          initials: 'NP',
          isVIP: false,
          hasOutstandingTasks: false,
          dateOfBirth: undefined,
          nationality: undefined,
          languages: [],
          currentLocation: undefined,
          permanentHome: undefined,
          locationHistory: [],
          employmentRecords: [],
          contact: {
            workEmail: '',
            workPhone: '',
            personalEmail: undefined,
            mobilePhone: undefined
          },
          emergencyContact: undefined,
          contactHistory: [],
          familySummary: {
            maritalStatus: 'Single',
            totalDependents: 0,
            passportsHeld: 0
          },
          familyMembers: [],
          workAuthorization: undefined,
          complianceDocuments: [],
          moves: [],
          documents: [],
          communications: [],
          activities: []
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [personId, languageCode]);

  // Initial load
  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !personId || personId === 'new') return;

    const interval = setInterval(() => {
      fetchPersonData(true);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchPersonData, personId]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await fetchPersonData(true);
  }, [fetchPersonData]);

  // Update profile function
  const updateProfile = useCallback((updatedProfile: PersonProfile) => {
    setProfile(updatedProfile);
  }, []);

  // Metadata helper functions
  const getFieldLabel = useCallback((fieldId: string, defaultLabel: string): string => {
    return PersonService.getFieldLabel(fieldId, metadata, defaultLabel);
  }, [metadata]);

  const getFieldDescription = useCallback((fieldId: string): string | undefined => {
    return PersonService.getFieldDescription(fieldId, metadata);
  }, [metadata]);

  const getFieldPlaceholder = useCallback((fieldId: string, defaultPlaceholder?: string): string | undefined => {
    return PersonService.getFieldPlaceholder(fieldId, metadata, defaultPlaceholder);
  }, [metadata]);

  const isFieldRequired = useCallback((fieldId: string, defaultRequired: boolean = false): boolean => {
    return PersonService.isFieldRequired(fieldId, metadata, defaultRequired);
  }, [metadata]);

  const isFieldVisible = useCallback((fieldId: string, defaultVisible: boolean = true): boolean => {
    return PersonService.isFieldVisible(fieldId, metadata, defaultVisible);
  }, [metadata]);

  return {
    profile,
    metadata,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    updateProfile,
    getFieldLabel,
    getFieldDescription,
    getFieldPlaceholder,
    isFieldRequired,
    isFieldVisible
  };
}