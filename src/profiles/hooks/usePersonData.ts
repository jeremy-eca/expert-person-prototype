import { useState, useEffect, useCallback } from 'react';
import { PersonService, personService } from '../services/api/personService';
import { mapPersonToProfile } from '../services/mappers/personMapper';
import { PersonProfile } from '../types/frontend.types';
import { PersonWithMetadata, FieldMetadata, PersonProfileCreateRequest } from '../types/api.types';

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
  updateProfile: (updatedProfile: PersonProfile, updateData?: Partial<PersonProfile>) => Promise<{ success: boolean; message: string }>;
  createProfile: (profileData: PersonProfileCreateRequest) => Promise<string>; // returns created person ID
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
      const metadataFields = personWithMetadata.metadata?.fields || personWithMetadata.metadata || {};
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

  // Update profile function with API integration
  const updateProfile = useCallback(async (updatedProfile: PersonProfile, updateData?: Partial<PersonProfile>) => {
    // If we have a real person ID (not 'new'), make API call
    if (personId && personId !== 'new') {
      try {
        setIsLoading(true);
        setError(null);
        
        // Helper function to ensure date is in yyyy-MM-dd format
        const formatDateForAPI = (dateString: string | undefined): string | undefined => {
          if (!dateString) return undefined;
          
          // If it's already in yyyy-MM-dd format, return as is
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
          }
          
          // If it's an ISO string or other format, convert to yyyy-MM-dd
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return undefined;
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
          } catch (error) {
            console.warn('Failed to format date for API:', dateString, error);
            return undefined;
          }
        };
        
        // Prepare the update request data
        const profileUpdateRequest: any = {
          first_name: updateData?.name?.split(' ')[0] || updatedProfile.name?.split(' ')[0],
          last_name: updateData?.name?.split(' ').slice(1).join(' ') || updatedProfile.name?.split(' ').slice(1).join(' '),
          preferred_name: (updateData as any)?.preferredName,
          date_of_birth: formatDateForAPI(updateData?.dateOfBirth || updatedProfile.dateOfBirth),
          email: updateData?.contact?.workEmail || updatedProfile.contact?.workEmail,
          bio: updateData?.bio || updatedProfile.bio,
        };
        
        // Add reference fields if they exist in updateData
        if ((updateData as any)?.titleId) {
          profileUpdateRequest.title_id = (updateData as any).titleId;
        }
        if ((updateData as any)?.genderId) {
          profileUpdateRequest.gender_id = (updateData as any).genderId;
        }
        if ((updateData as any)?.pronounsId) {
          profileUpdateRequest.pronouns_id = (updateData as any).pronounsId;
        }
        
        // Remove undefined values
        const cleanedUpdateRequest = Object.fromEntries(
          Object.entries(profileUpdateRequest).filter(([_, value]) => value !== undefined && value !== '')
        );
        
        
        // Make API call only if there's data to update
        if (Object.keys(cleanedUpdateRequest).length > 0) {
          const response = await personService.updatePersonProfile(personId, cleanedUpdateRequest);
          
          if (response.success) {
            // Update local state with the response data if available, otherwise use the provided profile
            setProfile(updatedProfile);
            return { success: true, message: response.message || 'Profile updated successfully' };
          } else {
            throw new Error(response.message || 'Failed to update profile');
          }
        }
      } catch (err: any) {
        console.error('❌ [HOOK] Failed to update person profile:', err);
        const errorMessage = err.message || 'Failed to update person profile';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    
    // For new persons or if no API call needed, just update local state
    setProfile(updatedProfile);
    return { success: true, message: 'Profile updated locally' };
  }, [personId]);

  // Create profile function
  const createProfile = useCallback(async (profileData: PersonProfileCreateRequest): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call PersonService to create profile via real API
      const response = await personService.createPersonProfile(profileData);
      
      // Return the created person ID so caller can navigate to it
      return response.data.person_id;
      
    } catch (err: any) {
      console.error('❌ [HOOK] Failed to create person profile:', err);
      const errorMessage = err.message || 'Failed to create person profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
    createProfile,
    getFieldLabel,
    getFieldDescription,
    getFieldPlaceholder,
    isFieldRequired,
    isFieldVisible
  };
}