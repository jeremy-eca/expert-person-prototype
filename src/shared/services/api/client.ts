// API Client for Expert Persons API
import { BrowserHMACAuth, AuthConfig } from './auth';
import { ApiResponse } from '../../../profiles/types/api.types';

export interface ApiClientConfig extends AuthConfig {
  baseUrl: string;
  timeout?: number;
}

export class ApiClient {
  private config: ApiClientConfig;
  private auth: BrowserHMACAuth;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.auth = new BrowserHMACAuth({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      tenantId: config.tenantId,
    });
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    }
  ): Promise<ApiResponse<T>> {
    // Build URL with query params
    const url = new URL(path, this.config.baseUrl);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Generate auth headers - use the path without query params for signature
    const authHeaders = await this.auth.generateAuthHeaders(
      method,
      url.pathname,
      options?.body
    );

    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      },
    };

    if (options?.body && method !== 'GET') {
      requestOptions.body = JSON.stringify(options.body);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 30000
    );

    try {
      const response = await fetch(url.toString(), {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message, 500);
      }
      
      throw new ApiError('Unknown error occurred', 500);
    }
  }

  // Convenience methods
  async get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { params });
  }

  async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { body });
  }

  async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body });
  }

  async patch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, { body });
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}

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

// Default client instance (to be configured in app initialization)
let defaultClient: ApiClient | null = null;

export function initializeApiClient(config: ApiClientConfig): void {
  defaultClient = new ApiClient(config);
}

export function getApiClient(): ApiClient {
  if (!defaultClient) {
    throw new Error('API client not initialized. Call initializeApiClient first.');
  }
  return defaultClient;
}