import { useState, useEffect, useCallback } from 'react';
import { ReferenceCountry, CountrySearchParams } from '../types/CountryTypes';

interface UseCountriesReturn {
  countries: ReferenceCountry[];
  isLoading: boolean;
  error: string | null;
  searchCountries: (query: string) => ReferenceCountry[];
  getCountryByCode: (code: string) => ReferenceCountry | null;
  getCountryByName: (name: string) => ReferenceCountry | null;
}

// Cache for countries data
let countriesCache: ReferenceCountry[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback countries data when API returns empty
const fallbackCountries: ReferenceCountry[] = [
  { id: 'fallback-1', country_name: 'United States', country_code: 'US', country_code_iso3: 'USA', region: 'North America', is_active: true, source: 'system' },
  { id: 'fallback-2', country_name: 'United Kingdom', country_code: 'GB', country_code_iso3: 'GBR', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-3', country_name: 'Canada', country_code: 'CA', country_code_iso3: 'CAN', region: 'North America', is_active: true, source: 'system' },
  { id: 'fallback-4', country_name: 'Australia', country_code: 'AU', country_code_iso3: 'AUS', region: 'Oceania', is_active: true, source: 'system' },
  { id: 'fallback-5', country_name: 'Germany', country_code: 'DE', country_code_iso3: 'DEU', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-6', country_name: 'France', country_code: 'FR', country_code_iso3: 'FRA', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-7', country_name: 'Spain', country_code: 'ES', country_code_iso3: 'ESP', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-8', country_name: 'Italy', country_code: 'IT', country_code_iso3: 'ITA', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-9', country_name: 'Netherlands', country_code: 'NL', country_code_iso3: 'NLD', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-10', country_name: 'Sweden', country_code: 'SE', country_code_iso3: 'SWE', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-11', country_name: 'Norway', country_code: 'NO', country_code_iso3: 'NOR', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-12', country_name: 'Denmark', country_code: 'DK', country_code_iso3: 'DNK', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-13', country_name: 'Finland', country_code: 'FI', country_code_iso3: 'FIN', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-14', country_name: 'Poland', country_code: 'PL', country_code_iso3: 'POL', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-15', country_name: 'Brazil', country_code: 'BR', country_code_iso3: 'BRA', region: 'South America', is_active: true, source: 'system' },
  { id: 'fallback-16', country_name: 'Mexico', country_code: 'MX', country_code_iso3: 'MEX', region: 'North America', is_active: true, source: 'system' },
  { id: 'fallback-17', country_name: 'Japan', country_code: 'JP', country_code_iso3: 'JPN', region: 'Asia', is_active: true, source: 'system' },
  { id: 'fallback-18', country_name: 'China', country_code: 'CN', country_code_iso3: 'CHN', region: 'Asia', is_active: true, source: 'system' },
  { id: 'fallback-19', country_name: 'India', country_code: 'IN', country_code_iso3: 'IND', region: 'Asia', is_active: true, source: 'system' },
  { id: 'fallback-20', country_name: 'Russia', country_code: 'RU', country_code_iso3: 'RUS', region: 'Europe', is_active: true, source: 'system' },
  { id: 'fallback-21', country_name: 'South Africa', country_code: 'ZA', country_code_iso3: 'ZAF', region: 'Africa', is_active: true, source: 'system' },
  { id: 'fallback-22', country_name: 'South Korea', country_code: 'KR', country_code_iso3: 'KOR', region: 'Asia', is_active: true, source: 'system' },
  { id: 'fallback-23', country_name: 'Singapore', country_code: 'SG', country_code_iso3: 'SGP', region: 'Asia', is_active: true, source: 'system' },
  { id: 'fallback-24', country_name: 'New Zealand', country_code: 'NZ', country_code_iso3: 'NZL', region: 'Oceania', is_active: true, source: 'system' },
  { id: 'fallback-25', country_name: 'Switzerland', country_code: 'CH', country_code_iso3: 'CHE', region: 'Europe', is_active: true, source: 'system' }
];

export const useCountries = (params: CountrySearchParams = {}): UseCountriesReturn => {
  const [countries, setCountries] = useState<ReferenceCountry[]>([]);
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

  const fetchCountries = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (countriesCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      setCountries(countriesCache);
      return;
    }

    // If we've already attempted and failed, don't retry immediately
    if (hasAttempted && error) {
      const sortedFallback = fallbackCountries.sort((a, b) => 
        a.country_name.localeCompare(b.country_name)
      );
      setCountries(sortedFallback);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasAttempted(true);

    try {
      const coreApiUrl = import.meta.env.VITE_EXPERT_CORE_URL || 'https://expert-api-core-dev.onrender.com';
      const queryParams = new URLSearchParams({
        limit: String(params.limit || 500), // Get all countries
        offset: String(params.offset || 0),
        language_code: params.language_code || 'en',
        ...(params.region && { region: params.region })
      });

      const headers = await generateHMACHeaders('/reference_countries');
      
      const response = await fetch(`${coreApiUrl}/api/reference_countries?${queryParams}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle both paginated and direct array responses
      const countriesData = data.data || data.results || data;
      
      if (!Array.isArray(countriesData)) {
        throw new Error('Invalid response format from countries API');
      }

      // Filter active countries and sort by name
      let activeCountries = countriesData
        .filter((country: ReferenceCountry) => country.is_active)
        .sort((a: ReferenceCountry, b: ReferenceCountry) => 
          a.country_name.localeCompare(b.country_name)
        );

      // If API returns no countries, use fallback data
      if (activeCountries.length === 0) {
        console.log('Countries API returned no data, using fallback countries');
        activeCountries = fallbackCountries.sort((a, b) => 
          a.country_name.localeCompare(b.country_name)
        );
      }

      // Update cache
      countriesCache = activeCountries;
      cacheTimestamp = now;
      
      setCountries(activeCountries);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      
      // If cache exists, use it as fallback
      if (countriesCache.length > 0) {
        setCountries(countriesCache);
      } else {
        // If no cache and API fails, use fallback data
        console.log('Countries API failed and no cache, using fallback countries');
        const sortedFallback = fallbackCountries.sort((a, b) => 
          a.country_name.localeCompare(b.country_name)
        );
        setCountries(sortedFallback);
        countriesCache = sortedFallback;
        cacheTimestamp = now;
      }
    } finally {
      setIsLoading(false);
    }
  }, [params, generateHMACHeaders]);

  // Search countries by name
  const searchCountries = useCallback((query: string): ReferenceCountry[] => {
    if (!query.trim()) return countries;
    
    const searchTerm = query.toLowerCase().trim();
    return countries.filter(country => 
      country.country_name.toLowerCase().includes(searchTerm) ||
      country.country_code.toLowerCase().includes(searchTerm) ||
      country.country_code_iso3.toLowerCase().includes(searchTerm) ||
      (country.region && country.region.toLowerCase().includes(searchTerm))
    );
  }, [countries]);

  // Get country by ISO code
  const getCountryByCode = useCallback((code: string): ReferenceCountry | null => {
    if (!code) return null;
    
    const codeUpper = code.toUpperCase();
    return countries.find(country => 
      country.country_code === codeUpper || 
      country.country_code_iso3 === codeUpper
    ) || null;
  }, [countries]);

  // Get country by exact name match
  const getCountryByName = useCallback((name: string): ReferenceCountry | null => {
    if (!name) return null;
    
    return countries.find(country => 
      country.country_name.toLowerCase() === name.toLowerCase()
    ) || null;
  }, [countries]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    isLoading,
    error,
    searchCountries,
    getCountryByCode,
    getCountryByName
  };
};