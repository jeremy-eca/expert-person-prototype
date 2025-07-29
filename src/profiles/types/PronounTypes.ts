// Pronoun Types based on Reference Pronouns API
// From Expert Core API documentation

export interface ReferencePronoun {
  id: string;
  pronoun_value: string;
  display_label: string;
  description: string;
  language_code: string;
  sort_order: number;
  field_group: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  source: 'system' | 'custom' | 'system-modified';
  is_custom: boolean;
  has_custom_override: boolean;
}

export interface PronounSearchParams {
  limit?: number;
  offset?: number;
  language_code?: string;
  search?: string;
}

export interface PaginatedPronounResponse {
  success: boolean;
  data: ReferencePronoun[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  sources?: {
    system: number;
    custom: number;
    'system-modified': number;
  };
  message?: string;
}