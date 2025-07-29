import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '../../../shared/lib/utils';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Input } from '../../../shared/components/ui/input';
import { Loader2, Search, Check, ChevronsUpDown, XIcon } from 'lucide-react';
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useNationalities } from '../../hooks/useNationalities';
import { 
  NationalityAutocompleteProps, 
  ReferenceNationality,
  SelectedNationality
} from '../../types/NationalityTypes';

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

export const NationalityAutocomplete: React.FC<NationalityAutocompleteProps> = ({
  selectedNationalities = [],
  onNationalitiesChange,
  error = false,
  placeholder = 'Search nationalities...',
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Debounce search value for filtering
  const debouncedSearch = useDebounce(searchValue, 300);

  // Hook for reference nationalities
  const { 
    nationalities, 
    isLoading, 
    error: nationalitiesError,
    searchNationalities
  } = useNationalities();

  // Get filtered nationalities based on search
  const filteredNationalities = useMemo(() => {
    if (debouncedSearch.length >= 1) {
      return searchNationalities(debouncedSearch);
    }
    return nationalities.slice(0, 50); // Show top 50 initially
  }, [debouncedSearch, searchNationalities, nationalities]);

  // Handle nationality selection
  const handleNationalitySelect = useCallback((nationality: ReferenceNationality) => {
    const selectedNationality: SelectedNationality = {
      id: nationality.id,
      display_label: nationality.display_label
    };
    
    // Don't add if already selected (check by ID)
    if (selectedNationalities.some(n => n.id === nationality.id)) {
      return;
    }
    
    const newNationalities = [...selectedNationalities, selectedNationality];
    onNationalitiesChange(newNationalities);
    setSearchValue(''); // Clear search after selection
    setOpen(false); // Close dropdown after selection
  }, [selectedNationalities, onNationalitiesChange]);

  // Handle nationality removal
  const handleNationalityRemove = useCallback((nationalityIdToRemove: string) => {
    const newNationalities = selectedNationalities.filter(n => n.id !== nationalityIdToRemove);
    onNationalitiesChange(newNationalities);
  }, [selectedNationalities, onNationalitiesChange]);

  // Get nationality flag emoji (basic implementation)
  const getNationalityFlag = useCallback((nationality: string): string => {
    const flagMap: Record<string, string> = {
      // Actual API values
      'US': '🇺🇸',
      'UK': '🇬🇧', 
      'FR': '🇫🇷',
      // Display labels
      'American': '🇺🇸',
      'British': '🇬🇧',
      'French': '🇫🇷',
      'Canadian': '🇨🇦',
      'Australian': '🇦🇺',
      'German': '🇩🇪',
      'Spanish': '🇪🇸',
      'Italian': '🇮🇹',
      'Dutch': '🇳🇱',
      'Swedish': '🇸🇪',
      'Norwegian': '🇳🇴',
      'Danish': '🇩🇰',
      'Finnish': '🇫🇮',
      'Polish': '🇵🇱',
      'Brazilian': '🇧🇷',
      'Mexican': '🇲🇽',
      'Japanese': '🇯🇵',
      'Chinese': '🇨🇳',
      'Indian': '🇮🇳',
      'Russian': '🇷🇺',
      'South African': '🇿🇦',
      'Korean': '🇰🇷',
      'Singaporean': '🇸🇬',
      'New Zealand': '🇳🇿',
      'Swiss': '🇨🇭'
    };
    return flagMap[nationality] || '🌍';
  }, []);

  const hasError = error || !!nationalitiesError;

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
              className={cn(
                // Design specifications from requirements
                'w-full h-11 min-h-[44px] rounded-md px-3 gap-3',
                'border border-[#86949F] bg-[#2A3440] text-white',
                'justify-between',
                hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                className
              )}
            >
              <span className={cn(
                "truncate",
                !searchValue && selectedNationalities.length === 0 && "text-gray-400"
              )}>
                {searchValue || (selectedNationalities.length > 0 
                  ? `${selectedNationalities.length} nationalit${selectedNationalities.length === 1 ? 'y' : 'ies'} selected`
                  : placeholder
                )}
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
                  placeholder={isLoading ? 'Loading...' : 'Search nationalities...'}
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
                    <span className="text-sm">Loading nationalities...</span>
                  </div>
                )}

                {/* Error State */}
                {nationalitiesError && !isLoading && (
                  <div className="py-4 text-center text-red-400 text-sm">
                    Unable to load nationalities. Please try again.
                  </div>
                )}

                {/* Nationality Results */}
                {!isLoading && !nationalitiesError && filteredNationalities.map((nationality) => {
                  const isSelected = selectedNationalities.some(n => n.id === nationality.id);
                  return (
                    <div
                      key={nationality.id}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground opacity-50"
                      )}
                      onClick={() => !isSelected && handleNationalitySelect(nationality)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getNationalityFlag(nationality.nationality_value)}</span>
                          <div className="flex flex-col">
                            <span className="text-white">{nationality.display_label}</span>
                            {nationality.display_label !== nationality.nationality_value && (
                              <span className="text-xs text-gray-400">{nationality.nationality_value}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* No Results */}
                {!isLoading && !nationalitiesError && filteredNationalities.length === 0 && debouncedSearch && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    No nationalities found for "{debouncedSearch}"
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !nationalitiesError && nationalities.length === 0 && !debouncedSearch && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    No nationalities available
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

      {/* Selected Nationalities Display */}
      {selectedNationalities.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedNationalities.map((nationality) => (
            <div key={nationality.id} className="relative group">
              <Badge 
                variant="secondary" 
                className="bg-[#2A3440] text-white border-0 text-xs flex items-center gap-1 pr-6"
              >
                <span className="text-lg">{getNationalityFlag(nationality.display_label)}</span>
                <span>{nationality.display_label}</span>
                <button
                  type="button"
                  onClick={() => handleNationalityRemove(nationality.id)}
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
          {nationalitiesError && (
            <div>Nationalities API: {nationalitiesError}</div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        Search and select nationalities from the verified database. Multiple selections allowed.
      </div>
    </div>
  );
};

export default NationalityAutocomplete;