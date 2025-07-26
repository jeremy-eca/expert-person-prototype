import { getApiClient } from './api-client';

// Reference data interfaces based on the API documentation
export interface ReferenceJobFunction {
  id: string;
  job_function_name: string;
  description?: string;
  category?: string;
  level?: 'Entry' | 'Professional' | 'Senior' | 'Executive';
  is_active: boolean;
  display_order?: number;
  source: 'system' | 'custom' | 'system-modified';
}

export interface ReferenceJobGrade {
  id: string;
  job_grade_name: string;
  description?: string;
  level?: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  numeric_value?: number;
  salary_range_min?: number;
  salary_range_max?: number;
  is_active: boolean;
  display_order?: number;
  source: 'system' | 'custom' | 'system-modified';
}

export interface ReferenceEmploymentType {
  id: string;
  employment_type_name: string;
  description?: string;
  category?: 'Permanent' | 'Contract' | 'Temporary';
  work_hours_min?: number;
  work_hours_max?: number;
  is_eligible_benefits?: boolean;
  is_active: boolean;
  display_order?: number;
  source: 'system' | 'custom' | 'system-modified';
}

export interface ReferenceCity {
  city_id: string;
  geonames_id?: number;
  country_id: string;
  city_name: string;
  asciiname?: string;
  alternate_names?: string;
  adm1_code?: string;
  adm2_code?: string;
  adm1_name?: string;
  adm2_name?: string;
  feature_code?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  time_zone?: string;
  population?: number;
  population_density?: number;
  postal_codes?: string;
  google_place_id?: string;
  formatted_address?: string;
  types?: string;
  gmt_offset?: number;
  dst_offset?: number;
  country_code?: string;
  country_code_iso3?: string;
  source: 'system' | 'custom' | 'system-modified';
}

export interface ReferenceCountry {
  id: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  region?: string;
  subregion?: string;
  capital?: string;
  currency_code?: string;
  currency_name?: string;
  phone_code?: string;
  is_active: boolean;
  source: 'system' | 'custom' | 'system-modified';
}

export interface SearchParams {
  q?: string;
  query?: string;
  search?: string;
  category?: string;
  country_id?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  language_code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
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

export class ReferenceDataService {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Generic cache management
   */
  private static getCacheKey(endpoint: string, params: any = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as any);
    return `${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  private static getCachedData<T>(cacheKey: string): T | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(cacheKey);
    return null;
  }

  private static setCachedData<T>(cacheKey: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear all cached reference data
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear specific cache entries by pattern
   */
  static clearCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Job Functions API
   */
  static async getJobFunctions(params: SearchParams = {}): Promise<PaginatedResponse<ReferenceJobFunction>> {
    const cacheKey = this.getCacheKey('job_functions', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceJobFunction>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_job_functions', { params });
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job functions:', error);
      throw new Error('Unable to fetch job functions. Please try again.');
    }
  }

  static async getJobFunction(functionId: string): Promise<ReferenceJobFunction> {
    const cacheKey = this.getCacheKey('job_function', { id: functionId });
    const cached = this.getCachedData<ReferenceJobFunction>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_job_functions/${functionId}`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job function:', error);
      throw new Error('Unable to fetch job function. Please try again.');
    }
  }

  /**
   * Job Grades API
   */
  static async getJobGrades(params: SearchParams = {}): Promise<PaginatedResponse<ReferenceJobGrade>> {
    const cacheKey = this.getCacheKey('job_grades', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceJobGrade>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_job_grades', { params });
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job grades:', error);
      throw new Error('Unable to fetch job grades. Please try again.');
    }
  }

  static async getJobGrade(gradeId: string): Promise<ReferenceJobGrade> {
    const cacheKey = this.getCacheKey('job_grade', { id: gradeId });
    const cached = this.getCachedData<ReferenceJobGrade>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_job_grades/${gradeId}`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch job grade:', error);
      throw new Error('Unable to fetch job grade. Please try again.');
    }
  }

  /**
   * Employment Types API
   */
  static async getEmploymentTypes(params: SearchParams = {}): Promise<PaginatedResponse<ReferenceEmploymentType>> {
    const cacheKey = this.getCacheKey('employment_types', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceEmploymentType>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_employment_types', { params });
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employment types:', error);
      throw new Error('Unable to fetch employment types. Please try again.');
    }
  }

  static async getEmploymentType(typeId: string): Promise<ReferenceEmploymentType> {
    const cacheKey = this.getCacheKey('employment_type', { id: typeId });
    const cached = this.getCachedData<ReferenceEmploymentType>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_employment_types/${typeId}`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employment type:', error);
      throw new Error('Unable to fetch employment type. Please try again.');
    }
  }

  /**
   * Cities API
   */
  static async getCities(params: SearchParams = {}): Promise<PaginatedResponse<ReferenceCity>> {
    const cacheKey = this.getCacheKey('cities', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceCity>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_cities', { params });
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      throw new Error('Unable to fetch cities. Please try again.');
    }
  }

  static async searchCities(query: string, countryId?: string, limit: number = 15): Promise<PaginatedResponse<ReferenceCity>> {
    const params = { query, country_id: countryId, limit };
    const cacheKey = this.getCacheKey('cities_search', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceCity>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_cities/search', { params });
      this.setCachedData(cacheKey, response.data, 2 * 60 * 1000); // 2 minute cache for searches
      return response.data;
    } catch (error) {
      console.error('Failed to search cities:', error);
      throw new Error('Unable to search cities. Please try again.');
    }
  }

  static async getCitiesByCountry(countryId: string, searchTerm?: string): Promise<PaginatedResponse<ReferenceCity>> {
    const params = { q: searchTerm, limit: 50 };
    const cacheKey = this.getCacheKey(`cities_country_${countryId}`, params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceCity>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_cities/country/${countryId}/search`, { params });
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cities by country:', error);
      throw new Error('Unable to fetch cities by country. Please try again.');
    }
  }

  static async getCity(cityId: string): Promise<ReferenceCity> {
    const cacheKey = this.getCacheKey('city', { id: cityId });
    const cached = this.getCachedData<ReferenceCity>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_cities/${cityId}`);
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch city:', error);
      throw new Error('Unable to fetch city. Please try again.');
    }
  }

  /**
   * Countries API
   */
  static async getCountries(params: SearchParams = {}): Promise<PaginatedResponse<ReferenceCountry>> {
    const cacheKey = this.getCacheKey('countries', params);
    const cached = this.getCachedData<PaginatedResponse<ReferenceCountry>>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get('/reference_countries', { params });
      this.setCachedData(cacheKey, response.data, 10 * 60 * 1000); // 10 minute cache for countries
      return response.data;
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      throw new Error('Unable to fetch countries. Please try again.');
    }
  }

  static async getCountry(countryId: string): Promise<ReferenceCountry> {
    const cacheKey = this.getCacheKey('country', { id: countryId });
    const cached = this.getCachedData<ReferenceCountry>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await getApiClient().get(`/reference_countries/${countryId}`);
      this.setCachedData(cacheKey, response.data, 10 * 60 * 1000); // 10 minute cache
      return response.data;
    } catch (error) {
      console.error('Failed to fetch country:', error);
      throw new Error('Unable to fetch country. Please try again.');
    }
  }

  /**
   * Utility methods for common operations
   */
  
  /**
   * Get all active reference data for employment forms
   */
  static async getEmploymentReferenceData() {
    try {
      const [jobFunctions, jobGrades, employmentTypes, countries] = await Promise.all([
        this.getJobFunctions({ is_active: true, limit: 500 }),
        this.getJobGrades({ is_active: true, limit: 500 }),
        this.getEmploymentTypes({ is_active: true, limit: 500 }),
        this.getCountries({ limit: 500 })
      ]);

      return {
        jobFunctions: jobFunctions.data,
        jobGrades: jobGrades.data,
        employmentTypes: employmentTypes.data,
        countries: countries.data
      };
    } catch (error) {
      console.error('Failed to fetch employment reference data:', error);
      throw new Error('Unable to fetch reference data for employment forms.');
    }
  }

  /**
   * Search across multiple reference types
   */
  static async searchAll(query: string, types: string[] = ['cities', 'countries', 'job_functions']) {
    const searches: Promise<any>[] = [];

    if (types.includes('cities')) {
      searches.push(
        this.searchCities(query, undefined, 5).then(result => ({
          type: 'cities',
          data: result.data
        })).catch(() => ({ type: 'cities', data: [] }))
      );
    }

    if (types.includes('countries')) {
      searches.push(
        this.getCountries({ search: query, limit: 5 }).then(result => ({
          type: 'countries',
          data: result.data
        })).catch(() => ({ type: 'countries', data: [] }))
      );
    }

    if (types.includes('job_functions')) {
      searches.push(
        this.getJobFunctions({ search: query, limit: 5 }).then(result => ({
          type: 'job_functions',
          data: result.data
        })).catch(() => ({ type: 'job_functions', data: [] }))
      );
    }

    try {
      const results = await Promise.all(searches);
      return results.reduce((acc, result) => {
        acc[result.type] = result.data;
        return acc;
      }, {} as Record<string, any[]>);
    } catch (error) {
      console.error('Failed to search reference data:', error);
      return {};
    }
  }
}

export default ReferenceDataService;