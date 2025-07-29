// Unified API Client with HMAC Authentication
import { HMACService, initializeHMACService, getHMACService } from './hmac';
import { ApiResponse, ApiErrorResponse, PaginationParams } from '../../types/api.types';

export interface ApiClientConfig {
  baseUrl: string;
  clientId: string;
  secretKey: string;
  tenantId: string;
  timeout?: number;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private hmacService: HMACService;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    
    // Initialize HMAC service
    initializeHMACService({
      clientId: config.clientId,
      secretKey: config.secretKey,
      tenantId: config.tenantId,
    });
    
    this.hmacService = getHMACService();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any;
      params?: Record<string, any>;
    }
  ): Promise<ApiResponse<T>> {
    // Ensure path starts with /api
    if (!path.startsWith('/api')) {
      path = `/api${path}`;
    }

    // Build URL
    const url = new URL(path, this.baseUrl);
    
    // Add query parameters
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Generate HMAC headers
    const hmacHeaders = this.hmacService.generateHeaders(
      method,
      url.toString(),
      options?.body
    );

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: hmacHeaders,
      signal: AbortSignal.timeout(this.timeout),
    };

    // Add body if present
    if (options?.body) {
      const jsonBody = JSON.stringify(options.body);
      console.log('🔧 [API_CLIENT] Stringifying body for fetch');
      console.log('📦 [API_CLIENT] JSON body:', jsonBody);
      console.log('🔍 [API_CLIENT] Bio in JSON body:', jsonBody.includes('"bio"') ? 'PRESENT' : 'NOT PRESENT');
      fetchOptions.body = jsonBody;
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [API_CLIENT] Error Response Status:', response.status);
        console.error('❌ [API_CLIENT] Error Response Data:', data);
        console.error('❌ [API_CLIENT] Validation Errors:', data.errors);
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error: any, index: number) => {
            console.error(`❌ [API_CLIENT] Validation Error ${index + 1}:`, error);
          });
        }
        throw new ApiError(data.message || 'API request failed', response.status, data);
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('Network error:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed',
        0
      );
    }
  }

  // GET request
  async get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { params });
  }

  // POST request
  async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    console.log('🌐 [API_CLIENT] POST request initiated');
    console.log('📍 [API_CLIENT] Path:', path);
    console.log('📦 [API_CLIENT] Body:', JSON.stringify(body, null, 2));
    console.log('🔍 [API_CLIENT] Bio in body:', body?.bio ? `"${body.bio}"` : 'NOT PRESENT');
    
    const result = await this.request<T>('POST', path, { body });
    
    console.log('📨 [API_CLIENT] POST response received');
    console.log('📄 [API_CLIENT] Response:', JSON.stringify(result, null, 2));
    
    return result;
  }

  // PUT request
  async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body });
  }

  // PATCH request
  async patch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, { body });
  }

  // DELETE request
  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }

  // Convenience method for paginated lists
  async getList<T>(
    path: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<T[]>> {
    const params: Record<string, any> = {};
    
    if (pagination) {
      if (pagination.limit !== undefined) params.limit = pagination.limit;
      if (pagination.offset !== undefined) params.offset = pagination.offset;
      if (pagination.search) params.search = pagination.search;
      if (pagination.filter) {
        // Add filter parameters
        Object.entries(pagination.filter).forEach(([key, value]) => {
          params[`filter[${key}]`] = value;
        });
      }
      if (pagination.include) params.include = pagination.include;
    }

    return this.get<T[]>(path, params);
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Singleton instance
let apiClient: ApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): void {
  apiClient = new ApiClient(config);
}

export function getApiClient(): ApiClient {
  if (!apiClient) {
    throw new Error('API client not initialized. Call initializeApiClient first.');
  }
  return apiClient;
}