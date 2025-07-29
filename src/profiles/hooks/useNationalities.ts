import { useState, useEffect, useCallback } from 'react';
import { ReferenceNationality, NationalitySearchParams } from '../types/NationalityTypes';

interface UseNationalitiesReturn {
  nationalities: ReferenceNationality[];
  isLoading: boolean;
  error: string | null;
  searchNationalities: (query: string) => ReferenceNationality[];
  getNationalityByValue: (value: string) => ReferenceNationality | null;
  getAllNationalities: () => ReferenceNationality[];
}

// Cache for nationalities data
let nationalitiesCache: ReferenceNationality[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useNationalities = (params: NationalitySearchParams = {}): UseNationalitiesReturn => {
  const [nationalities, setNationalities] = useState<ReferenceNationality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const generateHMACHeaders = useCallback(async (path: string) => {
    const crypto = await import('crypto-js');
    const timestamp = Date.now().toString();
    const secretKey = import.meta.env.VITE_HMAC_CLIENT_KEY;
    const stringToSign = path.toLowerCase() + timestamp;
    const signature = crypto.default.HmacSHA256(stringToSign, secretKey).toString(crypto.default.enc.Base64);

    return {
      'x-client-id': import.meta.env.VITE_HMAC_CLIENT_ID,
      'x-signature': signature,
      'x-timestamp': timestamp,
      'x-tenant-id': import.meta.env.VITE_TEST_TENANT_ID,
      'Content-Type': 'application/json'
    };
  }, []);

  const fetchNationalities = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (nationalitiesCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      setNationalities(nationalitiesCache);
      return;
    }

    // If we've already attempted and failed, don't retry immediately
    if (hasAttempted && error) {
      setNationalities([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasAttempted(true);

    try {
      const coreApiUrl = import.meta.env.VITE_EXPERT_CORE_URL || 'https://expert-api-core-dev.onrender.com';
      const queryParams = new URLSearchParams({
        limit: String(params.limit || 500), // Get all nationalities
        offset: String(params.offset || 0),
        language_code: params.language_code || 'en',
        ...(params.search && { search: params.search }),
        ...(params.is_active !== undefined && { is_active: String(params.is_active) })
      });

      const headers = await generateHMACHeaders('/reference_nationalities');
      
      const response = await fetch(`${coreApiUrl}/api/reference_nationalities?${queryParams}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nationalities: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle both paginated and direct array responses
      const nationalitiesData = data.data || data.results || data;
      
      if (!Array.isArray(nationalitiesData)) {
        throw new Error('Invalid response format from nationalities API');
      }

      // Sort by nationality value
      const sortedNationalities = nationalitiesData
        .sort((a: ReferenceNationality, b: ReferenceNationality) => 
          a.nationality_value.localeCompare(b.nationality_value)
        );

      // Update cache
      nationalitiesCache = sortedNationalities;
      cacheTimestamp = now;
      
      setNationalities(sortedNationalities);
    } catch (err) {
      console.error('Failed to fetch nationalities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nationalities');
      setNationalities([]);
    } finally {
      setIsLoading(false);
    }
  }, [params, generateHMACHeaders, hasAttempted, error]);

  // Search nationalities by value or display label
  const searchNationalities = useCallback((query: string): ReferenceNationality[] => {
    if (!query.trim()) return nationalities;
    
    const searchTerm = query.toLowerCase().trim();
    return nationalities.filter(nationality => 
      nationality.nationality_value.toLowerCase().includes(searchTerm) ||
      nationality.display_label.toLowerCase().includes(searchTerm)
    );
  }, [nationalities]);

  // Get nationality by exact value match
  const getNationalityByValue = useCallback((value: string): ReferenceNationality | null => {
    if (!value) return null;
    
    return nationalities.find(nationality => 
      nationality.nationality_value === value ||
      nationality.display_label === value
    ) || null;
  }, [nationalities]);

  // Get all nationalities
  const getAllNationalities = useCallback((): ReferenceNationality[] => {
    return nationalities;
  }, [nationalities]);

  // Fetch nationalities on mount
  useEffect(() => {
    fetchNationalities();
  }, [fetchNationalities]);

  return {
    nationalities,
    isLoading,
    error,
    searchNationalities,
    getNationalityByValue,
    getAllNationalities
  };
};