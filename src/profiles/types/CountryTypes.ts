// Country-related type definitions

export interface ReferenceCountry {
  id: string;
  country_name: string;
  country_code: string; // 2-character ISO code
  country_code_iso3: string; // 3-character ISO code
  region: string;
  subregion?: string;
  capital?: string;
  currency_code?: string;
  currency_name?: string;
  phone_code?: string;
  is_active: boolean;
  source: 'system' | 'custom' | 'system-modified';
  system_country_id?: string;
}

export interface GoogleCountryResult {
  place_id: string;
  description: string;
  country_name: string;
  country_code: string;
  formatted_address: string;
  types: string[];
}

export interface CountrySearchParams {
  region?: string;
  language_code?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CountryAutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  onCountrySelect?: (country: ReferenceCountry | null) => void;
  error?: boolean;
  placeholder?: string;
  className?: string;
}

export interface CountryServiceConfig {
  enableGoogle: boolean;
  googleApiKey?: string;
  debounceMs: number;
  cacheTimeout: number;
}

export type CountrySearchMode = 'reference' | 'google' | 'manual';