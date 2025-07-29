import { useState, useEffect } from 'react';
import { ReferenceDataService, ReferenceGender } from '../services/api/referenceDataService';

export interface UseGendersOptions {
  enabled?: boolean;
  language_code?: string;
}

export interface UseGendersReturn {
  genders: ReferenceGender[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching reference genders from the API
 * @param options Hook configuration options
 * @returns Hook state and methods
 */
export function useGenders(options: UseGendersOptions = {}): UseGendersReturn {
  const { enabled = true, language_code = import.meta.env.VITE_TEST_LANGUAGE || 'en' } = options;
  
  const [genders, setGenders] = useState<ReferenceGender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenders = async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await ReferenceDataService.getGenders({
        language_code,
        is_active: true,
        limit: 100
      });

      // Filter genders by language_code first, then sort
      const filteredGenders = response.data.filter(gender => 
        gender.language_code === language_code
      );

      // Sort genders by sort_order or display_label
      const sortedGenders = filteredGenders.sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return (a.display_label || '').localeCompare(b.display_label || '');
      });

      console.log(`📋 [USE_GENDERS] Filtered to ${sortedGenders.length} genders for language: ${language_code}`);
      setGenders(sortedGenders);
    } catch (err: any) {
      console.error('❌ [USE_GENDERS] Failed to fetch genders:', err);
      setError(err.message || 'Failed to fetch genders');
      setGenders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, [enabled, language_code]);

  return {
    genders,
    isLoading,
    error,
    refetch: fetchGenders
  };
}