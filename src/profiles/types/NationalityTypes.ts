// Nationality-related type definitions

export interface ReferenceNationality {
  id: string;
  nationality_value: string;
  display_label: string;
  language_code: string;
  sort_order: number;
  source: 'system' | 'custom';
  is_custom: boolean;
  has_custom_override: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface NationalitySearchParams {
  search?: string;
  is_active?: boolean;
  language_code?: string;
  limit?: number;
  offset?: number;
}

export interface SelectedNationality {
  id: string;
  display_label: string;
}

export interface NationalityAutocompleteProps {
  selectedNationalities: SelectedNationality[];
  onNationalitiesChange: (nationalities: SelectedNationality[]) => void;
  error?: boolean;
  placeholder?: string;
  className?: string;
}

export interface NationalityServiceConfig {
  debounceMs: number;
  cacheTimeout: number;
}