import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '../../../shared/lib/utils';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Loader2, Globe, Settings, Search, Check, ChevronsUpDown } from 'lucide-react';
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Input } from '../../../shared/components/ui/input';
import { useCountries } from '../../hooks/useCountries';
import { googlePlacesService } from '../../services/googlePlacesService';
import { 
  CountryAutocompleteProps, 
  ReferenceCountry, 
  GoogleCountryResult, 
  CountrySearchMode 
} from '../../types/CountryTypes';

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

export const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  value = '',
  onValueChange,
  onCountrySelect,
  error = false,
  placeholder = 'Select country...',
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchMode, setSearchMode] = useState<CountrySearchMode>('reference');
  const [googleResults, setGoogleResults] = useState<GoogleCountryResult[]>([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<ReferenceCountry | null>(null);

  // Debounce search value for API calls
  const debouncedSearch = useDebounce(searchValue, 300);

  // Hook for reference countries
  const { 
    countries: referenceCountries, 
    isLoading: isReferenceLoading, 
    error: referenceError,
    searchCountries,
    getCountryByName
  } = useCountries();

  // Check if Google Places is available
  const isGoogleAvailable = googlePlacesService.isEnabled();

  // Set initial search mode based on Google availability
  useEffect(() => {
    if (!isGoogleAvailable && searchMode === 'google') {
      setSearchMode('reference');
    }
  }, [isGoogleAvailable, searchMode]);

  // Search Google Places when in Google mode
  useEffect(() => {
    if (searchMode === 'google' && debouncedSearch.length >= 2) {
      searchGooglePlaces(debouncedSearch);
    } else {
      setGoogleResults([]);
      setGoogleError(null);
    }
  }, [searchMode, debouncedSearch]);

  const searchGooglePlaces = useCallback(async (query: string) => {
    if (!isGoogleAvailable) return;

    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const results = await googlePlacesService.searchCountries(query);
      setGoogleResults(results);
    } catch (err) {
      console.error('Google Places search error:', err);
      setGoogleError(err instanceof Error ? err.message : 'Google search failed');
      setGoogleResults([]);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [isGoogleAvailable]);

  // Get filtered countries based on current mode
  const filteredCountries = useMemo(() => {
    if (searchMode === 'reference') {
      return debouncedSearch.length >= 1 
        ? searchCountries(debouncedSearch)
        : referenceCountries.slice(0, 50); // Show top 50 initially
    }
    return [];
  }, [searchMode, debouncedSearch, searchCountries, referenceCountries]);

  // Handle country selection
  const handleCountrySelect = useCallback((countryValue: string) => {
    onValueChange(countryValue);
    setOpen(false);
    
    // Try to find the selected country in reference data
    let country: ReferenceCountry | null = null;
    
    if (searchMode === 'reference') {
      country = referenceCountries.find(c => c.country_name === countryValue) || null;
    } else if (searchMode === 'google') {
      // Try to match Google result to reference data
      const googleResult = googleResults.find(r => r.country_name === countryValue);
      if (googleResult) {
        country = googlePlacesService.matchToReference(googleResult, referenceCountries);
      }
    }
    
    // Fallback: try to find by name
    if (!country) {
      country = getCountryByName(countryValue);
    }
    
    setSelectedCountry(country);
    if (onCountrySelect) {
      onCountrySelect(country);
    }
  }, [searchMode, referenceCountries, googleResults, onValueChange, onCountrySelect, getCountryByName]);

  // Update selected country when value changes externally
  useEffect(() => {
    if (value && value !== selectedCountry?.country_name) {
      const country = getCountryByName(value);
      setSelectedCountry(country);
      if (onCountrySelect) {
        onCountrySelect(country);
      }
    }
  }, [value, selectedCountry, getCountryByName, onCountrySelect]);

  const isLoading = isReferenceLoading || isGoogleLoading;
  const hasError = error || !!referenceError || !!googleError;

  // Get display value
  const getDisplayValue = () => {
    if (!value) return placeholder;
    return value;
  };

  return (
    <div className="space-y-2">
      {/* Mode Toggle (if Google is available) */}
      {isGoogleAvailable && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={searchMode === 'reference' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('reference')}
              className="h-7 text-xs"
            >
              <Globe className="w-3 h-3 mr-1" />
              Reference
            </Button>
            <Button
              type="button"
              variant={searchMode === 'google' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('google')}
              className="h-7 text-xs"
            >
              <Search className="w-3 h-3 mr-1" />
              Google + Manual
            </Button>
          </div>
          <Badge variant="secondary" className="text-xs">
            {searchMode === 'reference' ? 'Reference Countries' : 'Enhanced Search'}
          </Badge>
        </div>
      )}

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
                'w-[262px] h-11 min-h-[44px] rounded-md px-3 gap-3',
                'border border-[#86949F] bg-[#2A3440] text-white',
                'justify-between',
                !value && 'text-gray-400',
                hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                className
              )}
            >
              <span className="truncate">{getDisplayValue()}</span>
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
                  placeholder={isLoading ? 'Loading...' : 'Search countries...'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-auto p-1">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Loading countries...</span>
                  </div>
                )}

                {/* Reference Countries Results */}
                {searchMode === 'reference' && !isLoading && filteredCountries.map((country) => {
                  const isSelected = value === country.country_name;
                  return (
                    <div
                      key={country.id}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleCountrySelect(country.country_name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{country.country_name}</span>
                          <span className="text-xs text-gray-400">({country.country_code})</span>
                        </div>
                        {country.region && (
                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                            {country.region}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Google Results */}
                {searchMode === 'google' && !isLoading && googleResults.map((result) => {
                  const matchedCountry = googlePlacesService.matchToReference(result, referenceCountries);
                  const isSelected = value === result.country_name;
                  return (
                    <div
                      key={result.place_id}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleCountrySelect(result.country_name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{result.country_name}</span>
                          {result.country_code && (
                            <span className="text-xs text-gray-400">({result.country_code})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {matchedCountry && (
                            <Badge variant="outline" className="text-xs text-green-400 border-green-600">
                              Matched
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs text-blue-400 border-blue-600">
                            Google
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Manual Entry Option (Google mode) */}
                {searchMode === 'google' && searchValue && !googleResults.some(r => r.country_name === searchValue) && (
                  <div
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer border-t border-gray-600 mt-1 pt-1",
                      value === searchValue && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleCountrySelect(searchValue)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === searchValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-white">"{searchValue}"</span>
                        <span className="text-xs text-gray-400">(manual entry)</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-600">
                        Manual
                      </Badge>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!isLoading && (
                  (searchMode === 'reference' && filteredCountries.length === 0 && debouncedSearch) ||
                  (searchMode === 'google' && googleResults.length === 0 && debouncedSearch && !googleError)
                ) && (
                  <div className="py-2 text-center text-gray-400 text-sm">
                    No countries found for "{debouncedSearch}"
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

      {/* Error Messages */}
      {hasError && (
        <div className="text-xs text-red-400">
          {referenceError && (
            <div>Reference API: {referenceError}</div>
          )}
          {googleError && (
            <div>Google Places: {googleError}</div>
          )}
        </div>
      )}

      {/* Selected Country Info */}
      {selectedCountry && (
        <div className="text-xs text-gray-400">
          Selected: {selectedCountry.country_name} ({selectedCountry.country_code})
          {selectedCountry.region && ` • ${selectedCountry.region}`}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        {searchMode === 'reference' 
          ? 'Search from verified country database'
          : 'Enhanced search with Google Places + manual entry option'
        }
      </div>
    </div>
  );
};

export default CountryAutocomplete;