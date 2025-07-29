import { useState, useEffect } from 'react';
import { ReferenceDataService, ReferenceTitle } from '../services/api/referenceDataService';

export interface UseTitlesOptions {
  enabled?: boolean;
  language_code?: string;
}

export interface UseTitlesReturn {
  titles: ReferenceTitle[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching reference titles from the API
 * @param options Hook configuration options
 * @returns Hook state and methods
 */
export function useTitles(options: UseTitlesOptions = {}): UseTitlesReturn {
  const { enabled = true, language_code = import.meta.env.VITE_TEST_LANGUAGE || 'en' } = options;
  
  const [titles, setTitles] = useState<ReferenceTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTitles = async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await ReferenceDataService.getTitles({
        language_code,
        is_active: true,
        limit: 100
      });

      // Filter titles by language_code first, then sort
      const filteredTitles = response.data.filter(title => 
        title.language_code === language_code
      );

      // Sort titles by sort_order or display_label
      const sortedTitles = filteredTitles.sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return a.display_label.localeCompare(b.display_label);
      });

      console.log(`📋 [USE_TITLES] Filtered to ${sortedTitles.length} titles for language: ${language_code}`);
      setTitles(sortedTitles);
    } catch (err: any) {
      console.error('❌ [USE_TITLES] Failed to fetch titles:', err);
      setError(err.message || 'Failed to fetch titles');
      setTitles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, [enabled, language_code]);

  return {
    titles,
    isLoading,
    error,
    refetch: fetchTitles
  };
}