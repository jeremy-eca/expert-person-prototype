import { GoogleCountryResult, ReferenceCountry } from '../types/CountryTypes';

// Cache for Google Places results
const googleCache = new Map<string, GoogleCountryResult[]>();
const GOOGLE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface GooglePlacesConfig {
  apiKey: string;
  enabled: boolean;
}

class GooglePlacesService {
  private config: GooglePlacesConfig;
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly MAX_REQUESTS_PER_SECOND = 10;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '',
      enabled: import.meta.env.VITE_ENABLE_GOOGLE_PLACES === 'true' && 
               !!import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    };
  }

  /**
   * Check if Google Places API is available and configured
   */
  isEnabled(): boolean {
    return this.config.enabled && this.config.apiKey.length > 0;
  }

  /**
   * Rate limiting to prevent API quota issues
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Reset counter every second
    if (timeSinceLastRequest >= 1000) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    // If we've hit the limit, wait
    if (this.requestCount >= this.MAX_REQUESTS_PER_SECOND) {
      const waitTime = 1000 - timeSinceLastRequest;
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      this.requestCount = 0;
      this.lastRequestTime = Date.now();
    }
    
    this.requestCount++;
  }

  /**
   * Search for countries using Google Places Autocomplete API
   */
  async searchCountries(query: string): Promise<GoogleCountryResult[]> {
    if (!this.isEnabled()) {
      throw new Error('Google Places API is not enabled or configured');
    }

    if (!query.trim()) {
      return [];
    }

    const cacheKey = query.toLowerCase().trim();
    
    // Check cache first
    const cached = googleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.rateLimit();

      // Use the new Google Places API (Autocomplete)
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.config.apiKey,
          },
          body: JSON.stringify({
            input: query,
            includedPrimaryTypes: ['country'], // Restrict to countries only
            languageCode: 'en',
            maxSuggestions: 10,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Google Places API key is invalid or restricted');
        } else if (response.status === 429) {
          throw new Error('Google Places API quota exceeded');
        } else {
          throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!data.suggestions || !Array.isArray(data.suggestions)) {
        return [];
      }

      // Transform Google results to our format
      const results: GoogleCountryResult[] = data.suggestions
        .filter((suggestion: any) => 
          suggestion.placePrediction && 
          suggestion.placePrediction.types?.includes('country')
        )
        .map((suggestion: any) => {
          const prediction = suggestion.placePrediction;
          return {
            place_id: prediction.placeId || '',
            description: prediction.text?.text || '',
            country_name: prediction.text?.text || '',
            country_code: this.extractCountryCode(prediction.text?.text || ''),
            formatted_address: prediction.text?.text || '',
            types: prediction.types || ['country'],
          };
        });

      // Cache results
      googleCache.set(cacheKey, results);
      
      // Clean up old cache entries
      setTimeout(() => {
        googleCache.delete(cacheKey);
      }, GOOGLE_CACHE_DURATION);

      return results;
    } catch (error) {
      console.error('Google Places API error:', error);
      throw error;
    }
  }

  /**
   * Extract country code from country name (basic implementation)
   * This is a fallback - ideally we'd use the Google Places Details API
   */
  private extractCountryCode(countryName: string): string {
    const countryCodeMap: Record<string, string> = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Spain': 'ES',
      'Italy': 'IT',
      'Netherlands': 'NL',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Poland': 'PL',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Russia': 'RU',
    };

    return countryCodeMap[countryName] || '';
  }

  /**
   * Match Google country result to reference country data
   */
  matchToReference(
    googleResult: GoogleCountryResult, 
    referenceCountries: ReferenceCountry[]
  ): ReferenceCountry | null {
    if (!googleResult || !referenceCountries.length) {
      return null;
    }

    // Try exact name match first
    let match = referenceCountries.find(country => 
      country.country_name.toLowerCase() === googleResult.country_name.toLowerCase()
    );

    if (match) return match;

    // Try country code match
    if (googleResult.country_code) {
      match = referenceCountries.find(country => 
        country.country_code === googleResult.country_code ||
        country.country_code_iso3 === googleResult.country_code
      );
    }

    if (match) return match;

    // Try partial name matches
    const googleName = googleResult.country_name.toLowerCase();
    match = referenceCountries.find(country => {
      const refName = country.country_name.toLowerCase();
      return refName.includes(googleName) || googleName.includes(refName);
    });

    return match || null;
  }

  /**
   * Get country details from Google Places (if needed for enhanced data)
   */
  async getCountryDetails(placeId: string): Promise<any> {
    if (!this.isEnabled() || !placeId) {
      throw new Error('Google Places API not available or invalid place ID');
    }

    try {
      await this.rateLimit();

      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.config.apiKey,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Places Details API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Places Details API error:', error);
      throw error;
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    googleCache.clear();
  }

  /**
   * Get current configuration
   */
  getConfig(): GooglePlacesConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();