import { useState, useEffect } from 'react';

export interface LanguageOption {
  code: string;
  display_label: string;
}

// Popular languages list - matches what's used in AdditionalInfoCardRHF
const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: 'en', display_label: 'English' },
  { code: 'es', display_label: 'Spanish' },
  { code: 'fr', display_label: 'French' },
  { code: 'de', display_label: 'German' },
  { code: 'it', display_label: 'Italian' },
  { code: 'pt', display_label: 'Portuguese' },
  { code: 'nl', display_label: 'Dutch' },
  { code: 'ru', display_label: 'Russian' },
  { code: 'zh', display_label: 'Chinese (Mandarin)' },
  { code: 'ja', display_label: 'Japanese' },
  { code: 'ko', display_label: 'Korean' },
  { code: 'ar', display_label: 'Arabic' },
  { code: 'hi', display_label: 'Hindi' },
  { code: 'bn', display_label: 'Bengali' },
  { code: 'ur', display_label: 'Urdu' },
  { code: 'tr', display_label: 'Turkish' },
  { code: 'pl', display_label: 'Polish' },
  { code: 'sv', display_label: 'Swedish' },
  { code: 'no', display_label: 'Norwegian' },
  { code: 'da', display_label: 'Danish' },
  { code: 'fi', display_label: 'Finnish' }
];

export interface UseLanguagesResult {
  languages: LanguageOption[];
  isLoading: boolean;
  error: Error | null;
}

export const useLanguages = (): UseLanguagesResult => {
  const [languages] = useState<LanguageOption[]>(POPULAR_LANGUAGES);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  return {
    languages,
    isLoading,
    error
  };
};