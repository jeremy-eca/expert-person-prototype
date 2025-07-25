import { HMACService, initializeHMACService, getHMACService } from './hmac';
import type { 
  Person, 
  PersonComposite, 
  PersonListResponse,
  PaginationParams,
  PersonAddress,
  PersonContactDetails,
  PersonEmployment,
  PersonPartner,
  PersonChild,
  PersonEmergencyContact,
  PersonLanguage,
  PersonPermitVisa,
  PersonPassport,
  PersonNote,
  ApiResponse
} from '../types/api.types';

export interface ProfileDataServiceConfig {
  baseUrl: string;
  clientId: string;
  secretKey: string;
  tenantId: string;
  timeout?: number;
}

/**
 * Unified ProfileDataService class for all person/profile-related API operations
 * Replaces the existing PersonService with a single, comprehensive data access layer
 */
export class ProfileDataService {
  private baseUrl: string;
  private timeout: number;
  private hmacService: HMACService;
  private basePath = '/persons';

  constructor(config: ProfileDataServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    
    // Initialize HMAC service for authentication
    initializeHMACService({
      clientId: config.clientId,
      secretKey: config.secretKey,
      tenantId: config.tenantId,
    });
    
    this.hmacService = getHMACService();
  }

  // =====================================
  // CORE HTTP REQUEST METHOD
  // =====================================
  
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
    console.log('ProfileDataService: Making request to URL:', url.toString());
    
    // Add query parameters
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Generate HMAC headers for authentication
    const hmacHeaders = this.hmacService.generateHeaders(
      method,
      url.toString(),
      options?.body
    );

    // Create timeout signal using AbortController for better compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: hmacHeaders,
      signal: controller.signal,
    };

    // Add body if present
    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      clearTimeout(timeoutId); // Clear timeout on successful response
      const response = await fetch(url.toString(), fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        console.error('ProfileDataService API Error:', data);
        throw new ProfileDataError(data.message || 'API request failed', response.status, data);
      }

      return data as ApiResponse<T>;
      clearTimeout(timeoutId); // Clear timeout on error
    } catch (error) {
      if (error instanceof ProfileDataError) {
        throw error;
      }
      
      console.error('ProfileDataService Network error:', error);
      throw new ProfileDataError(
        error instanceof Error ? error.message : 'Network request failed',
        0
      );
    }
  }

  // =====================================
  // PERSON LIST & CORE OPERATIONS
  // =====================================

  async getPersonsList(params?: PaginationParams & { 
    search?: string;
    filter?: Record<string, any>;
  }): Promise<PersonListResponse> {
    const response = await this.getList<Person>(this.basePath, params);
    
    return {
      persons: response.data,
      total: response.totalCount || response.data.length,
      limit: params?.limit || 100,
      offset: params?.offset || 0
    };
  }

  async getPersonProfile(id: string, include?: string[]): Promise<PersonComposite> {
    const params = include?.length ? { include: include.join(',') } : undefined;
    const response = await this.get<Person>(`${this.basePath}/${id}`, params);
    return response.data as PersonComposite;
  }

  async createPersonProfile(person: Partial<Person>): Promise<Person> {
    const response = await this.post<Person>(this.basePath, person);
    return response.data;
  }

  async updatePersonProfile(id: string, person: Partial<Person>): Promise<Person> {
    const response = await this.patch<Person>(`${this.basePath}/${id}`, person);
    return response.data;
  }

  async deletePersonProfile(id: string): Promise<void> {
    await this.delete(`${this.basePath}/${id}`);
  }

  // =====================================
  // COMPREHENSIVE PERSON DATA RETRIEVAL
  // =====================================

  async getPersonWithAllData(personId: string): Promise<PersonComposite> {
    const includes = [
      'addresses',
      'contact_details',
      'employment',
      'partners',
      'children',
      'emergency_contacts',
      'languages',
      'permits_visas',
      'passports',
      'notes'
    ];
    
    return this.getPersonProfile(personId, includes);
  }

  // =====================================
  // ADDRESS OPERATIONS
  // =====================================

  async getPersonAddresses(personId: string): Promise<PersonAddress[]> {
    const response = await this.get<PersonAddress[]>(`${this.basePath}/${personId}/addresses`);
    return response.data;
  }

  async createPersonAddress(personId: string, address: Partial<PersonAddress>): Promise<PersonAddress> {
    const response = await this.post<PersonAddress>(`${this.basePath}/${personId}/addresses`, address);
    return response.data;
  }

  async updatePersonAddress(personId: string, addressId: string, address: Partial<PersonAddress>): Promise<PersonAddress> {
    const response = await this.put<PersonAddress>(`${this.basePath}/${personId}/addresses/${addressId}`, address);
    return response.data;
  }

  async deletePersonAddress(personId: string, addressId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/addresses/${addressId}`);
  }

  // =====================================
  // CONTACT OPERATIONS  
  // =====================================

  async getPersonContactDetails(personId: string): Promise<PersonContactDetails> {
    const response = await this.get<PersonContactDetails>(`${this.basePath}/${personId}/contact-details`);
    return response.data;
  }

  async updatePersonContactDetails(personId: string, contactId: string, contact: Partial<PersonContactDetails>): Promise<PersonContactDetails> {
    const response = await this.put<PersonContactDetails>(`${this.basePath}/${personId}/contact-details/${contactId}`, contact);
    return response.data;
  }

  // =====================================
  // EMPLOYMENT OPERATIONS
  // =====================================

  async getPersonEmployment(personId: string): Promise<PersonEmployment[]> {
    const response = await this.get<PersonEmployment[]>(`${this.basePath}/${personId}/employment`);
    return response.data;
  }

  async createPersonEmployment(personId: string, employment: Partial<PersonEmployment>): Promise<PersonEmployment> {
    const response = await this.post<PersonEmployment>(`${this.basePath}/${personId}/employment`, employment);
    return response.data;
  }

  async updatePersonEmployment(personId: string, employmentId: string, employment: Partial<PersonEmployment>): Promise<PersonEmployment> {
    const response = await this.put<PersonEmployment>(`${this.basePath}/${personId}/employment/${employmentId}`, employment);
    return response.data;
  }

  async deletePersonEmployment(personId: string, employmentId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/employment/${employmentId}`);
  }

  // =====================================
  // FAMILY OPERATIONS - PARTNERS
  // =====================================

  async getPersonPartners(personId: string): Promise<PersonPartner[]> {
    const response = await this.get<PersonPartner[]>(`${this.basePath}/${personId}/partners`);
    return response.data;
  }

  async createPersonPartner(personId: string, partner: Partial<PersonPartner>): Promise<PersonPartner> {
    const response = await this.post<PersonPartner>(`${this.basePath}/${personId}/partners`, partner);
    return response.data;
  }

  async updatePersonPartner(personId: string, partnerId: string, partner: Partial<PersonPartner>): Promise<PersonPartner> {
    const response = await this.put<PersonPartner>(`${this.basePath}/${personId}/partners/${partnerId}`, partner);
    return response.data;
  }

  async deletePersonPartner(personId: string, partnerId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/partners/${partnerId}`);
  }

  // =====================================
  // FAMILY OPERATIONS - CHILDREN
  // =====================================

  async getPersonChildren(personId: string): Promise<PersonChild[]> {
    const response = await this.get<PersonChild[]>(`${this.basePath}/${personId}/children`);
    return response.data;
  }

  async createPersonChild(personId: string, child: Partial<PersonChild>): Promise<PersonChild> {
    const response = await this.post<PersonChild>(`${this.basePath}/${personId}/children`, child);
    return response.data;
  }

  async updatePersonChild(personId: string, childId: string, child: Partial<PersonChild>): Promise<PersonChild> {
    const response = await this.put<PersonChild>(`${this.basePath}/${personId}/children/${childId}`, child);
    return response.data;
  }

  async deletePersonChild(personId: string, childId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/children/${childId}`);
  }

  // =====================================
  // EMERGENCY CONTACT OPERATIONS
  // =====================================

  async getPersonEmergencyContacts(personId: string): Promise<PersonEmergencyContact[]> {
    const response = await this.get<PersonEmergencyContact[]>(`${this.basePath}/${personId}/emergency-contacts`);
    return response.data;
  }

  async createPersonEmergencyContact(personId: string, contact: Partial<PersonEmergencyContact>): Promise<PersonEmergencyContact> {
    const response = await this.post<PersonEmergencyContact>(`${this.basePath}/${personId}/emergency-contacts`, contact);
    return response.data;
  }

  async updatePersonEmergencyContact(personId: string, contactId: string, contact: Partial<PersonEmergencyContact>): Promise<PersonEmergencyContact> {
    const response = await this.put<PersonEmergencyContact>(`${this.basePath}/${personId}/emergency-contacts/${contactId}`, contact);
    return response.data;
  }

  async deletePersonEmergencyContact(personId: string, contactId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/emergency-contacts/${contactId}`);
  }

  // =====================================
  // LANGUAGE OPERATIONS
  // =====================================

  async getPersonLanguages(personId: string): Promise<PersonLanguage[]> {
    const response = await this.get<PersonLanguage[]>(`${this.basePath}/${personId}/languages`);
    return response.data;
  }

  async createPersonLanguage(personId: string, language: Partial<PersonLanguage>): Promise<PersonLanguage> {
    const response = await this.post<PersonLanguage>(`${this.basePath}/${personId}/languages`, language);
    return response.data;
  }

  async updatePersonLanguage(personId: string, languageId: string, language: Partial<PersonLanguage>): Promise<PersonLanguage> {
    const response = await this.put<PersonLanguage>(`${this.basePath}/${personId}/languages/${languageId}`, language);
    return response.data;
  }

  async deletePersonLanguage(personId: string, languageId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/languages/${languageId}`);
  }

  // =====================================
  // VISA/PERMIT OPERATIONS
  // =====================================

  async getPersonVisas(personId: string): Promise<PersonPermitVisa[]> {
    const response = await this.get<PersonPermitVisa[]>(`${this.basePath}/${personId}/visas`);
    return response.data;
  }

  async createPersonVisa(personId: string, visa: Partial<PersonPermitVisa>): Promise<PersonPermitVisa> {
    const response = await this.post<PersonPermitVisa>(`${this.basePath}/${personId}/visas`, visa);
    return response.data;
  }

  async updatePersonVisa(personId: string, visaId: string, visa: Partial<PersonPermitVisa>): Promise<PersonPermitVisa> {
    const response = await this.put<PersonPermitVisa>(`${this.basePath}/${personId}/visas/${visaId}`, visa);
    return response.data;
  }

  async deletePersonVisa(personId: string, visaId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/visas/${visaId}`);
  }

  // =====================================
  // PASSPORT OPERATIONS
  // =====================================

  async getPersonPassports(personId: string): Promise<PersonPassport[]> {
    const response = await this.get<PersonPassport[]>(`${this.basePath}/${personId}/passports`);
    return response.data;
  }

  async createPersonPassport(personId: string, passport: Partial<PersonPassport>): Promise<PersonPassport> {
    const response = await this.post<PersonPassport>(`${this.basePath}/${personId}/passports`, passport);
    return response.data;
  }

  async updatePersonPassport(personId: string, passportId: string, passport: Partial<PersonPassport>): Promise<PersonPassport> {
    const response = await this.put<PersonPassport>(`${this.basePath}/${personId}/passports/${passportId}`, passport);
    return response.data;
  }

  async deletePersonPassport(personId: string, passportId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/passports/${passportId}`);
  }

  // =====================================
  // NOTES/COMMUNICATION OPERATIONS
  // =====================================

  async getPersonNotes(personId: string): Promise<PersonNote[]> {
    const response = await this.get<PersonNote[]>(`${this.basePath}/${personId}/notes`);
    return response.data;
  }

  async createPersonNote(personId: string, note: Partial<PersonNote>): Promise<PersonNote> {
    const response = await this.post<PersonNote>(`${this.basePath}/${personId}/notes`, note);
    return response.data;
  }

  async updatePersonNote(personId: string, noteId: string, note: Partial<PersonNote>): Promise<PersonNote> {
    const response = await this.put<PersonNote>(`${this.basePath}/${personId}/notes/${noteId}`, note);
    return response.data;
  }

  async deletePersonNote(personId: string, noteId: string): Promise<void> {
    await this.delete(`${this.basePath}/${personId}/notes/${noteId}`);
  }

  // =====================================
  // PRIVATE HTTP HELPERS
  // =====================================

  private async get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { params });
  }

  private async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { body });
  }

  private async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body });
  }

  private async patch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, { body });
  }

  private async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }

  private async getList<T>(
    path: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<T[]>> {
    const params: Record<string, any> = {};
    
    if (pagination) {
      if (pagination.limit !== undefined) params.limit = pagination.limit;
      if (pagination.offset !== undefined) params.offset = pagination.offset;
      if (pagination.search) params.search = pagination.search;
      if (pagination.filter) {
        Object.entries(pagination.filter).forEach(([key, value]) => {
          params[`filter[${key}]`] = value;
        });
      }
      if (pagination.include) params.include = pagination.include;
    }

    return this.get<T[]>(path, params);
  }
}

// =====================================
// ERROR CLASS
// =====================================

export class ProfileDataError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ProfileDataError';
  }
}

// =====================================
// SINGLETON INSTANCE MANAGEMENT
// =====================================

let profileDataService: ProfileDataService | null = null;

export function initializeProfileDataService(config: ProfileDataServiceConfig): void {
  profileDataService = new ProfileDataService(config);
}

export function getProfileDataService(): ProfileDataService {
  if (!profileDataService) {
    throw new Error('ProfileDataService not initialized. Call initializeProfileDataService first.');
  }
  return profileDataService;
}