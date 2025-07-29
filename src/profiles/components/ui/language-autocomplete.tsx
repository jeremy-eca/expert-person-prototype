import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '../../../shared/lib/utils';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Loader2, Search, Check, ChevronsUpDown, XIcon } from 'lucide-react';
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useLanguages, LanguageOption } from '../../hooks/useLanguages';

// Language proficiency levels
const PROFICIENCY_LEVELS = [
  { value: 'Basic', label: 'Basic', description: 'Simple phrases & greetings', color: '#6B7280' },
  { value: 'Conversational', label: 'Conversational', description: 'Daily communication', color: '#3B82F6' },
  { value: 'Professional', label: 'Professional', description: 'Work environment fluency', color: '#10B981' },
  { value: 'Native', label: 'Native', description: 'Mother tongue level', color: '#F59E0B' }
];

export interface SelectedLanguage {
  code: string;
  display_label: string;
  proficiency: string;
}

export interface LanguageAutocompleteProps {
  selectedLanguages: SelectedLanguage[];
  onLanguagesChange: (languages: SelectedLanguage[]) => void;
  error?: boolean;
  placeholder?: string;
  className?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export const LanguageAutocomplete: React.FC<LanguageAutocompleteProps> = ({
  selectedLanguages = [],
  onLanguagesChange,
  error = false,
  placeholder = 'Search languages...',
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [pendingLanguage, setPendingLanguage] = useState<LanguageOption | null>(null);
  const [showProficiencySelector, setShowProficiencySelector] = useState(false);

  // Debounce search value for filtering
  const debouncedSearch = useDebounce(searchValue, 300);

  // Hook for reference languages
  const { languages, isLoading, error: languagesError } = useLanguages();

  // Get filtered languages based on search
  const filteredLanguages = useMemo(() => {
    if (debouncedSearch.length >= 1) {
      return languages.filter(lang => 
        lang.display_label.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        !selectedLanguages.some(selected => selected.code === lang.code)
      );
    }
    return languages.filter(lang => 
      !selectedLanguages.some(selected => selected.code === lang.code)
    ).slice(0, 50); // Show top 50 initially
  }, [debouncedSearch, languages, selectedLanguages]);

  // Handle language selection (first step)
  const handleLanguageSelect = useCallback((language: LanguageOption) => {
    setPendingLanguage(language);
    setShowProficiencySelector(true);
    setSearchValue('');
    setOpen(false);
  }, []);

  // Handle proficiency selection (second step)
  const handleProficiencySelect = useCallback((proficiency: string) => {
    if (!pendingLanguage) return;

    const selectedLanguage: SelectedLanguage = {
      code: pendingLanguage.code,
      display_label: pendingLanguage.display_label,
      proficiency
    };
    
    const newLanguages = [...selectedLanguages, selectedLanguage];
    onLanguagesChange(newLanguages);
    
    // Reset state
    setPendingLanguage(null);
    setShowProficiencySelector(false);
  }, [pendingLanguage, selectedLanguages, onLanguagesChange]);

  // Handle language removal
  const handleLanguageRemove = useCallback((languageCodeToRemove: string) => {
    const newLanguages = selectedLanguages.filter(lang => lang.code !== languageCodeToRemove);
    onLanguagesChange(newLanguages);
  }, [selectedLanguages, onLanguagesChange]);

  // Cancel proficiency selection
  const handleCancelProficiency = useCallback(() => {
    setPendingLanguage(null);
    setShowProficiencySelector(false);
  }, []);

  // Get proficiency color
  const getProficiencyColor = useCallback((proficiency: string): string => {
    const level = PROFICIENCY_LEVELS.find(p => p.value === proficiency);
    return level?.color || '#6B7280';
  }, []);

  const hasError = error || !!languagesError;

  return (
    <div className="space-y-3">
      {/* Main Autocomplete Component */}
      <div className="relative">
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={showProficiencySelector}
              className={cn(
                'w-full h-11 min-h-[44px] rounded-md px-3 gap-3',
                'border border-[#86949F] bg-[#2A3440] text-white',
                'justify-between',
                hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                showProficiencySelector && 'opacity-50 cursor-not-allowed',
                className
              )}
            >
              <span className={cn(
                "truncate",
                !searchValue && selectedLanguages.length === 0 && "text-gray-400"
              )}>
                {showProficiencySelector 
                  ? `Select proficiency for ${pendingLanguage?.display_label}...`
                  : searchValue || (selectedLanguages.length > 0 
                    ? `${selectedLanguages.length} language${selectedLanguages.length === 1 ? '' : 's'} selected`
                    : placeholder
                  )
                }
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className="w-[var(--radix-popover-trigger-width)] p-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-[#2A3440] text-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              align="start"
            >
              {/* Search Input */}
              <div className="flex items-center border-b border-[#40505C] px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder={isLoading ? 'Loading...' : 'Search languages...'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-auto p-1">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-4 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Loading languages...</span>
                  </div>
                )}

                {/* Error State */}
                {languagesError && !isLoading && (
                  <div className="py-4 text-center text-red-400 text-sm">
                    Unable to load languages. Please try again.
                  </div>
                )}

                {/* Language Results */}
                {!isLoading && !languagesError && filteredLanguages.map((language) => (
                  <div
                    key={language.code}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    onClick={() => handleLanguageSelect(language)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{language.display_label}</span>
                        {language.display_label !== language.code && (
                          <span className="text-xs text-gray-400">({language.code})</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* No Results */}
                {!isLoading && !languagesError && filteredLanguages.length === 0 && debouncedSearch && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    No languages found for "{debouncedSearch}"
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !languagesError && languages.length === 0 && !debouncedSearch && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    No languages available
                  </div>
                )}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Proficiency Selector */}
      {showProficiencySelector && pendingLanguage && (
        <div className="p-4 bg-[#1A1F28] border border-[#40505C] rounded-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">
              Select proficiency for {pendingLanguage.display_label}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelProficiency}
              className="text-gray-400 hover:text-white p-1"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PROFICIENCY_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant="outline"
                onClick={() => handleProficiencySelect(level.value)}
                className="text-left justify-start bg-[#252E38] border-[#40505C] text-white hover:bg-[#2A3440]"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <div>
                    <div className="text-sm font-medium">{level.label}</div>
                    <div className="text-xs text-gray-400">{level.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Languages Display */}
      {selectedLanguages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedLanguages.map((language) => (
            <div key={language.code} className="relative group">
              <Badge 
                variant="secondary" 
                className="bg-[#2A3440] text-white border-0 text-xs flex items-center gap-1 pr-6"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getProficiencyColor(language.proficiency) }}
                />
                <span>{language.display_label}</span>
                <span className="text-gray-400">-</span>
                <span>{language.proficiency}</span>
                <button
                  type="button"
                  onClick={() => handleLanguageRemove(language.code)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {hasError && (
        <div className="text-xs text-red-400">
          {languagesError && (
            <div>Languages API: {languagesError.message}</div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        Search and select languages with proficiency levels. Multiple selections allowed.
      </div>
    </div>
  );
};

export default LanguageAutocomplete;