import { useState, useEffect } from 'react';
import { personService } from '../services/api/personService';
import { ReferencePronoun, PronounSearchParams } from '../types/PronounTypes';

export interface UsePronounsOptions {
  enabled?: boolean;
  language_code?: string;
}

export interface UsePronounsReturn {
  pronouns: ReferencePronoun[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching reference pronouns from the PersonService
 * @param options Hook configuration options
 * @returns Hook state and methods
 */
export function usePronouns(options: UsePronounsOptions = {}): UsePronounsReturn {
  const { enabled = true, language_code = import.meta.env.VITE_TEST_LANGUAGE || 'en' } = options;
  
  const [pronouns, setPronouns] = useState<ReferencePronoun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPronouns = async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await personService.getPronouns({
        language_code,
        limit: 100
      });

      // Sort pronouns by sort_order or pronoun_value
      // Note: Server-side filtering by language_code already applied
      const sortedPronouns = response.data.sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return a.pronoun_value.localeCompare(b.pronoun_value);
      });

      console.log(`📋 [USE_PRONOUNS] Received ${sortedPronouns.length} pronouns for language: ${language_code}`);
      setPronouns(sortedPronouns);
    } catch (err: any) {
      console.error('❌ [USE_PRONOUNS] Failed to fetch pronouns:', err);
      setError(err.message || 'Failed to fetch pronouns');
      setPronouns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPronouns();
  }, [enabled, language_code]);

  return {
    pronouns,
    isLoading,
    error,
    refetch: fetchPronouns
  };
}