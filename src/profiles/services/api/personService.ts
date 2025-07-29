// Person API Service
import { getApiClient } from '../../../shared/services/api/api-client';
import { 
  Person, 
  PersonComposite, 
  PersonWithMetadata,
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
  FieldMetadata,
  ApiResponse,
  PersonProfileCreateRequest,
  PersonProfileUpdateRequest,
  PersonProfileCreateResponse,
  PersonProfileUpdateResponse
} from '../../types/api.types';
import { 
  ReferencePronoun, 
  PronounSearchParams, 
  PaginatedPronounResponse 
} from '../../types/PronounTypes';
import { mapPersonListItemFromApi } from '../mappers/personMapper';
import { PersonListItem } from '../../types/frontend.types';

export class PersonService {
  private basePath = '/persons';

  // Optimized list endpoint for grid display
  async getPersonsList(params?: PaginationParams & { 
    search?: string;
    employmentType?: string;
    location?: string;
    status?: string;
  }): Promise<{
    persons: PersonListItem[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const client = getApiClient();
    
    const queryParams: any = {
      limit: params?.limit || 50,
      offset: params?.offset || 0
    };

    // Add search parameter if provided
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    // Add filter parameters if provided
    if (params?.employmentType) {
      queryParams.employment_type = params.employmentType;
    }
    if (params?.location) {
      queryParams.location = params.location;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    
    const response = await client.get<{
      success: boolean;
      count: number;
      totalCount: number;
      data: Array<{
        person_id: string;
        first_name: string;
        last_name: string;
        email: string | null;
        current_country: string | null;
        employment_type_id: string | null;
        employment_type: {
          name: string | null;
          description: string | null;
          category: string | null;
          source: string;
        } | null;
      }>;
      _links?: {
        self: string;
      };
    }>('/persons/list', queryParams);
    
    
    // Handle different possible response formats
    let dataArray: any[] = [];
    let totalCount = 0;
    
    if (Array.isArray(response.data)) {
      // API returns data directly as array
      dataArray = response.data;
      totalCount = response.data.length;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // API returns wrapped format {success, data, count, totalCount}
      dataArray = response.data.data;
      totalCount = response.data.totalCount ?? response.data.count ?? response.data.data.length;
    } else {
      console.error('🚨 [PERSON_SERVICE] Unexpected response format:', response.data);
      dataArray = [];
      totalCount = 0;
    }
    
    // Map the API response directly to PersonListItem format
    const mappedPersons = dataArray.map((item) => {
      return mapPersonListItemFromApi(item);
    });
    
    const result = {
      persons: mappedPersons,
      total: totalCount,
      limit: queryParams.limit,
      offset: queryParams.offset
    };
    return result;
  }

  // Get all people without pagination limits (useful for exports, reports, etc.)
  async getAllPersons(params?: { 
    search?: string;
    employmentType?: string;
    location?: string;
    status?: string;
  }): Promise<{
    persons: PersonListItem[];
    total: number;
  }> {
    const client = getApiClient();
    
    // Use a very high limit to get all records
    const queryParams: any = {
      limit: 10000, // High limit to get all records
      offset: 0
    };

    // Add search parameter if provided
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    // Add filter parameters if provided
    if (params?.employmentType) {
      queryParams.employment_type = params.employmentType;
    }
    if (params?.location) {
      queryParams.location = params.location;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    
    const response = await client.get<{
      success: boolean;
      count: number;
      totalCount: number;
      data: Array<{
        person_id: string;
        first_name: string;
        last_name: string;
        email: string | null;
        current_country: string | null;
        employment_type_id: string | null;
        employment_type: {
          name: string | null;
          description: string | null;
          category: string | null;
          source: string;
        } | null;
      }>;
      _links?: {
        self: string;
      };
    }>('/persons/list', queryParams);
    
    // Handle different possible response formats
    let dataArray: any[] = [];
    let totalCount = 0;
    
    if (Array.isArray(response.data)) {
      dataArray = response.data;
      totalCount = response.data.length;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      dataArray = response.data.data;
      totalCount = response.data.totalCount ?? response.data.count ?? response.data.data.length;
    } else {
      console.error('🚨 [PERSON_SERVICE] Unexpected response format:', response.data);
      dataArray = [];
      totalCount = 0;
    }
    
    const mappedPersons = dataArray.map((item) => {
      return mapPersonListItemFromApi(item);
    });
    
    return {
      persons: mappedPersons,
      total: totalCount
    };
  }

  // Core Person Operations
  async getPersons(params?: PaginationParams & { 
    search?: string;
    filter?: Record<string, any>;
  }): Promise<PersonListResponse> {
    const client = getApiClient();
    
    // Use the optimized list endpoint
    const queryParams = {
      limit: params?.limit || 50,
      offset: params?.offset || 0
    };
    
    const response = await client.get<{
      success: boolean;
      count: number;
      totalCount: number;
      data: Array<{
        person_id: string;
        first_name: string;
        last_name: string;
        email: string | null;
        current_country: string | null;
        employment_type_id: string | null;
        employment_type: {
          name: string | null;
          description: string | null;
          category: string | null;
          source: string;
        } | null;
      }>;
    }>('/persons/list', queryParams);
    
    // Transform the API response to match our expected format
    const transformedPersons = (response.data.data ?? []).map((item: any) => ({
      id: item.person_id,
      person_id: item.person_id,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      current_country: item.current_country,
      employment_type_id: item.employment_type_id,
      employment_type: item.employment_type,
      // Add computed fields that our frontend expects
      full_name: `${item.first_name} ${item.last_name}`,
      tenant_id: '', // This will be populated by the API
      created_at: new Date().toISOString(), // Placeholder
      updated_at: new Date().toISOString(), // Placeholder
    }));
    
    return {
      persons: transformedPersons as Person[],
      total: response.data.totalCount ?? 0,
      limit: queryParams.limit,
      offset: queryParams.offset
    };
  }

  async getPerson(id: string, include?: string[]): Promise<PersonComposite> {
    const client = getApiClient();
    const params = include?.length ? { include: include.join(',') } : undefined;
    const response = await client.get<Person>(`${this.basePath}/${id}`, params);
    return response.data as PersonComposite;
  }

  async createPerson(person: Partial<Person>): Promise<Person> {
    const client = getApiClient();
    const response = await client.post<Person>(this.basePath, person);
    return response.data;
  }

  async updatePerson(id: string, person: Partial<Person>): Promise<Person> {
    const client = getApiClient();
    const response = await client.patch<Person>(`${this.basePath}/${id}`, person);
    return response.data;
  }

  /**
   * Create a complete person profile with optional address and contact details
   * Uses the real API /persons endpoint with HMAC authentication
   * @param profileData - Complete person profile data
   * @returns Promise<PersonProfileCreateResponse>
   */
  async createPersonProfile(profileData: PersonProfileCreateRequest): Promise<PersonProfileCreateResponse> {
    try {
      console.log('🚀 [PERSON_SERVICE] createPersonProfile called');
      console.log('📥 [PERSON_SERVICE] Received profileData:', JSON.stringify(profileData, null, 2));
      console.log('🔍 [PERSON_SERVICE] Bio field specifically:', `"${profileData.bio}"`);
      
      const client = getApiClient();
      
      console.log('📤 [PERSON_SERVICE] About to send POST request to:', `${this.basePath}/profile`);
      console.log('📦 [PERSON_SERVICE] Payload being sent:', JSON.stringify(profileData, null, 2));
      
      // Use the /persons/profile endpoint - debugging 500 error
      const response = await client.post<PersonProfileCreateResponse>(
        `${this.basePath}/profile`,
        profileData
      );
      
      console.log('📨 [PERSON_SERVICE] Response received');
      console.log('📊 [PERSON_SERVICE] Response status:', response);
      console.log('📄 [PERSON_SERVICE] Response data:', JSON.stringify(response.data, null, 2));
      
      // Handle different possible response formats
      let result: PersonProfileCreateResponse;
      
      if (response.data && typeof response.data === 'object') {
        if ('success' in response.data) {
          // Response is wrapped format {success, data, message}
          if (!response.data.success) {
            throw new Error(`API returned error: ${response.data.message || 'Unknown error'}`);
          }
          result = response.data as PersonProfileCreateResponse;
        } else if ('person_id' in response.data || 'id' in response.data) {
          // Response is direct Person object, wrap it
          const personData = response.data as any;
          result = {
            success: true,
            data: {
              person_id: personData.person_id || personData.id,
              address_id: null,
              contact_id: null,
              tenant_id: personData.tenant_id,
              created_at: personData.created_at || new Date().toISOString()
            },
            message: 'Person created successfully'
          };
        } else {
          throw new Error('Unexpected response format from person creation endpoint');
        }
      } else {
        throw new Error('Invalid response format from person creation endpoint');
      }
      
      return result;
    } catch (error: any) {
      console.error('❌ [PERSON_SERVICE] Failed to create person profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Extract meaningful error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          error.message ||
                          'Unable to create person profile';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update an existing person profile with upsert semantics for related data
   * Uses the real API /persons/{personId}/profile endpoint with HMAC authentication
   * @param personId - The person ID to update
   * @param profileData - Profile update data (all fields optional)
   * @returns Promise<PersonProfileUpdateResponse>
   */
  async updatePersonProfile(
    personId: string, 
    profileData: PersonProfileUpdateRequest
  ): Promise<PersonProfileUpdateResponse> {
    try {
      console.log('🔄 [PERSON_SERVICE] Updating person profile:', personId);
      console.log('📤 [PERSON_SERVICE] Update payload:', JSON.stringify(profileData, null, 2));
      
      const client = getApiClient();
      
      const response = await client.put<PersonProfileUpdateResponse>(
        `${this.basePath}/${personId}/profile`,
        profileData
      );
      
      console.log('📨 [PERSON_SERVICE] Update response received:', JSON.stringify(response.data, null, 2));
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        // Check if response has success field
        if ('success' in response.data) {
          if (!response.data.success) {
            const errorMessage = response.data.message || 
                               response.data.error || 
                               JSON.stringify(response.data) ||
                               'API returned unsuccessful response';
            throw new Error(`API returned error: ${errorMessage}`);
          }
          return response.data;
        } else {
          // If no success field, assume it's a direct response and wrap it
          console.log('📝 [PERSON_SERVICE] Response without success field, treating as successful update');
          return {
            success: true,
            message: 'Profile updated successfully',
            data: response.data
          } as PersonProfileUpdateResponse;
        }
      } else {
        throw new Error('Invalid response format from update endpoint');
      }
    } catch (error: any) {
      console.error('❌ [PERSON_SERVICE] Failed to update person profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        fullError: error
      });
      
      // Handle specific HTTP status codes
      if (error.response?.status === 404) {
        throw new Error('Person not found or you do not have access to this person');
      } else if (error.response?.status === 400) {
        // Handle validation errors
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        if (validationErrors) {
          throw new Error(`Validation error: ${JSON.stringify(validationErrors)}`);
        }
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your credentials.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Insufficient permissions to update this person.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Extract meaningful error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.errors?.[0]?.msg ||
                          error.message ||
                          'Unable to update person profile';
      
      throw new Error(errorMessage);
    }
  }

  async deletePerson(id: string): Promise<void> {
    const client = getApiClient();
    await client.delete(`${this.basePath}/${id}`);
  }

  // Address Operations
  async getPersonAddresses(personId: string): Promise<PersonAddress[]> {
    const client = getApiClient();
    const response = await client.get<PersonAddress[]>(`${this.basePath}/${personId}/addresses`);
    return response.data;
  }

  async createPersonAddress(personId: string, address: Partial<PersonAddress>): Promise<PersonAddress> {
    const client = getApiClient();
    const response = await client.post<PersonAddress>(`${this.basePath}/${personId}/addresses`, address);
    return response.data;
  }

  async updatePersonAddress(personId: string, addressId: string, address: Partial<PersonAddress>): Promise<PersonAddress> {
    const client = getApiClient();
    const response = await client.put<PersonAddress>(`${this.basePath}/${personId}/addresses/${addressId}`, address);
    return response.data;
  }

  async deletePersonAddress(personId: string, addressId: string): Promise<void> {
    const client = getApiClient();
    await client.delete(`${this.basePath}/${personId}/addresses/${addressId}`);
  }

  // Contact Details Operations
  async getPersonContactDetails(personId: string): Promise<PersonContactDetails> {
    const client = getApiClient();
    const response = await client.get<PersonContactDetails>(`${this.basePath}/${personId}/contact-details`);
    return response.data;
  }

  async updatePersonContactDetails(personId: string, contactId: string, contact: Partial<PersonContactDetails>): Promise<PersonContactDetails> {
    const client = getApiClient();
    const response = await client.put<PersonContactDetails>(`${this.basePath}/${personId}/contact-details/${contactId}`, contact);
    return response.data;
  }

  // Employment Operations
  async getPersonEmployment(personId: string): Promise<PersonEmployment[]> {
    const client = getApiClient();
    const response = await client.get<PersonEmployment[]>(`${this.basePath}/${personId}/employment`);
    return response.data;
  }

  async createPersonEmployment(personId: string, employment: Partial<PersonEmployment>): Promise<PersonEmployment> {
    const client = getApiClient();
    const response = await client.post<PersonEmployment>(`${this.basePath}/${personId}/employment`, employment);
    return response.data;
  }

  async updatePersonEmployment(personId: string, employmentId: string, employment: Partial<PersonEmployment>): Promise<PersonEmployment> {
    const client = getApiClient();
    const response = await client.put<PersonEmployment>(`${this.basePath}/${personId}/employment/${employmentId}`, employment);
    return response.data;
  }

  // Family Operations - Partners
  async getPersonPartners(personId: string): Promise<PersonPartner[]> {
    const client = getApiClient();
    const response = await client.get<PersonPartner[]>(`${this.basePath}/${personId}/partners`);
    return response.data;
  }

  async createPersonPartner(personId: string, partner: Partial<PersonPartner>): Promise<PersonPartner> {
    const client = getApiClient();
    const response = await client.post<PersonPartner>(`${this.basePath}/${personId}/partners`, partner);
    return response.data;
  }

  async updatePersonPartner(personId: string, partnerId: string, partner: Partial<PersonPartner>): Promise<PersonPartner> {
    const client = getApiClient();
    const response = await client.put<PersonPartner>(`${this.basePath}/${personId}/partners/${partnerId}`, partner);
    return response.data;
  }

  // Family Operations - Children
  async getPersonChildren(personId: string): Promise<PersonChild[]> {
    const client = getApiClient();
    const response = await client.get<PersonChild[]>(`${this.basePath}/${personId}/children`);
    return response.data;
  }

  async createPersonChild(personId: string, child: Partial<PersonChild>): Promise<PersonChild> {
    const client = getApiClient();
    const response = await client.post<PersonChild>(`${this.basePath}/${personId}/children`, child);
    return response.data;
  }

  async updatePersonChild(personId: string, childId: string, child: Partial<PersonChild>): Promise<PersonChild> {
    const client = getApiClient();
    const response = await client.put<PersonChild>(`${this.basePath}/${personId}/children/${childId}`, child);
    return response.data;
  }

  // Emergency Contacts Operations
  async getPersonEmergencyContacts(personId: string): Promise<PersonEmergencyContact[]> {
    const client = getApiClient();
    const response = await client.get<PersonEmergencyContact[]>(`${this.basePath}/${personId}/emergency-contacts`);
    return response.data;
  }

  async createPersonEmergencyContact(personId: string, contact: Partial<PersonEmergencyContact>): Promise<PersonEmergencyContact> {
    const client = getApiClient();
    const response = await client.post<PersonEmergencyContact>(`${this.basePath}/${personId}/emergency-contacts`, contact);
    return response.data;
  }

  async updatePersonEmergencyContact(personId: string, contactId: string, contact: Partial<PersonEmergencyContact>): Promise<PersonEmergencyContact> {
    const client = getApiClient();
    const response = await client.put<PersonEmergencyContact>(`${this.basePath}/${personId}/emergency-contacts/${contactId}`, contact);
    return response.data;
  }

  // Language Operations
  async getPersonLanguages(personId: string): Promise<PersonLanguage[]> {
    const client = getApiClient();
    const response = await client.get<PersonLanguage[]>(`${this.basePath}/${personId}/languages`);
    return response.data;
  }

  async createPersonLanguage(personId: string, language: Partial<PersonLanguage>): Promise<PersonLanguage> {
    const client = getApiClient();
    const response = await client.post<PersonLanguage>(`${this.basePath}/${personId}/languages`, language);
    return response.data;
  }

  async updatePersonLanguage(personId: string, languageId: string, language: Partial<PersonLanguage>): Promise<PersonLanguage> {
    const client = getApiClient();
    const response = await client.put<PersonLanguage>(`${this.basePath}/${personId}/languages/${languageId}`, language);
    return response.data;
  }

  // Visa/Permit Operations
  async getPersonVisas(personId: string): Promise<PersonPermitVisa[]> {
    const client = getApiClient();
    const response = await client.get<PersonPermitVisa[]>(`${this.basePath}/${personId}/visas`);
    return response.data;
  }

  async createPersonVisa(personId: string, visa: Partial<PersonPermitVisa>): Promise<PersonPermitVisa> {
    const client = getApiClient();
    const response = await client.post<PersonPermitVisa>(`${this.basePath}/${personId}/visas`, visa);
    return response.data;
  }

  async updatePersonVisa(personId: string, visaId: string, visa: Partial<PersonPermitVisa>): Promise<PersonPermitVisa> {
    const client = getApiClient();
    const response = await client.put<PersonPermitVisa>(`${this.basePath}/${personId}/visas/${visaId}`, visa);
    return response.data;
  }

  // Passport Operations
  async getPersonPassports(personId: string): Promise<PersonPassport[]> {
    const client = getApiClient();
    const response = await client.get<PersonPassport[]>(`${this.basePath}/${personId}/passports`);
    return response.data;
  }

  async createPersonPassport(personId: string, passport: Partial<PersonPassport>): Promise<PersonPassport> {
    const client = getApiClient();
    const response = await client.post<PersonPassport>(`${this.basePath}/${personId}/passports`, passport);
    return response.data;
  }

  async updatePersonPassport(personId: string, passportId: string, passport: Partial<PersonPassport>): Promise<PersonPassport> {
    const client = getApiClient();
    const response = await client.put<PersonPassport>(`${this.basePath}/${personId}/passports/${passportId}`, passport);
    return response.data;
  }

  // Notes Operations
  async getPersonNotes(personId: string): Promise<PersonNote[]> {
    const client = getApiClient();
    const response = await client.get<PersonNote[]>(`${this.basePath}/${personId}/notes`);
    return response.data;
  }

  async createPersonNote(personId: string, note: Partial<PersonNote>): Promise<PersonNote> {
    const client = getApiClient();
    const response = await client.post<PersonNote>(`${this.basePath}/${personId}/notes`, note);
    return response.data;
  }

  // Composite Operations
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
    
    return this.getPerson(personId, includes);
  }

  /**
   * Get a person with metadata for field labels and localization
   * @param personId - The person ID to fetch
   * @param languageCode - Optional language code for localized metadata
   * @returns Promise<PersonWithMetadata>
   */
  async getPersonWithMetadata(
    personId: string, 
    languageCode: string = 'en'
  ): Promise<PersonWithMetadata> {
    try {
      const client = getApiClient();
      
      const response = await client.get<ApiResponse<PersonWithMetadata>>(
        `${this.basePath}/${personId}/with-metadata`,
        {
          params: {
            language_code: languageCode,
            include: 'addresses,contact_details,employment,partners,children,emergency_contacts,languages_detail,permits_visas,passports,notes'
          }
        }
      );
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        if ('success' in response.data) {
          // Wrapped format {success, data, ...}
          if (!response.data.success) {
            throw new Error(`API returned error: ${response.data.data || 'Unknown error'}`);
          }
          return response.data.data;
        } else {
          // Direct format - response contains {person, metadata, language_info}
          if ((response.data as any).person && (response.data as any).metadata) {
            return {
              person: (response.data as any).person as PersonComposite,
              metadata: (response.data as any).metadata
            };
          } else {
            // Fallback: assume entire response.data is the person data
            return {
              person: response.data as PersonComposite,
              metadata: {
                language_code: languageCode,
                entity_context: 'person',
                fields: {}
              }
            };
          }
        }
      } else {
        throw new Error('Invalid response format from metadata endpoint');
      }
    } catch (error: any) {
      console.error('Failed to fetch person with metadata:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // If metadata endpoint fails, try fallback to regular person endpoint
      if (error.response?.status === 404 || error.response?.status === 500) {
        try {
          const fallbackPerson = await this.getPersonWithAllData(personId);
          return {
            person: fallbackPerson,
            metadata: {
              language_code: languageCode,
              entity_context: 'person',
              fields: {}
            }
          };
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      throw new Error(
        error.response?.data?.message || 
        `Unable to fetch person details for ID: ${personId}`
      );
    }
  }

  /**
   * Get field metadata for a specific context (for form rendering)
   * @param entityContext - The entity context (e.g., 'person', 'employment')
   * @param languageCode - Language code for localization
   * @returns Promise<Record<string, FieldMetadata>>
   */
  async getFieldMetadata(
    entityContext: string = 'person',
    languageCode: string = 'en'
  ): Promise<Record<string, FieldMetadata>> {
    try {
      // Note: This endpoint doesn't exist on the API, so we return empty metadata
      // The forms will use default labels as fallback
      return {};
    } catch (error: any) {
      console.error('Failed to fetch field metadata:', error);
      // Return empty metadata object on error - forms will use default labels
      return {};
    }
  }

  // Reference Data Operations - Pronouns
  async getPronouns(params: PronounSearchParams = {}): Promise<PaginatedPronounResponse> {
    try {
      // Use the core API from environment variable (same pattern as titles/genders)
      const coreApiUrl = `${import.meta.env.VITE_EXPERT_CORE_URL}/api`;
      const queryParams = new URLSearchParams({
        limit: String(params.limit || 50),
        offset: String(params.offset || 0),
        language_code: params.language_code || import.meta.env.VITE_TEST_LANGUAGE || 'en',
        ...(params.search && { search: params.search })
      });

      // Generate HMAC signature for core API
      const crypto = await import('crypto-js');
      const timestamp = Date.now().toString();
      const secretKey = import.meta.env.VITE_HMAC_CLIENT_KEY;
      const path = '/reference_pronouns';
      const stringToSign = path.toLowerCase() + timestamp;
      const signature = crypto.default.HmacSHA256(stringToSign, secretKey).toString(crypto.default.enc.Base64);

      console.log('🗣️ [PERSON_SERVICE] Fetching pronouns from core API:', `${coreApiUrl}/reference_pronouns?${queryParams}`);
      
      const response = await fetch(`${coreApiUrl}/reference_pronouns?${queryParams}`, {
        method: 'GET',
        headers: {
          'x-client-id': import.meta.env.VITE_HMAC_CLIENT_ID,
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-tenant-id': import.meta.env.VITE_TEST_TENANT_ID,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as PaginatedPronounResponse;
      console.log('✅ [PERSON_SERVICE] Pronouns fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [PERSON_SERVICE] Failed to fetch pronouns:', error);
      throw new Error(`Unable to fetch pronouns: ${error.message}`);
    }
  }

  async getPronoun(pronounId: string): Promise<ReferencePronoun> {
    try {
      // Use the core API from environment variable (same pattern as titles/genders)
      const coreApiUrl = `${import.meta.env.VITE_EXPERT_CORE_URL}/api`;

      // Generate HMAC signature for core API
      const crypto = await import('crypto-js');
      const timestamp = Date.now().toString();
      const secretKey = import.meta.env.VITE_HMAC_CLIENT_KEY;
      const path = `/reference_pronouns/${pronounId}`;
      const stringToSign = path.toLowerCase() + timestamp;
      const signature = crypto.default.HmacSHA256(stringToSign, secretKey).toString(crypto.default.enc.Base64);

      console.log('🗣️ [PERSON_SERVICE] Fetching pronoun by ID from core API:', pronounId);
      
      const response = await fetch(`${coreApiUrl}/reference_pronouns/${pronounId}`, {
        method: 'GET',
        headers: {
          'x-client-id': import.meta.env.VITE_HMAC_CLIENT_ID,
          'x-signature': signature,
          'x-timestamp': timestamp,
          'x-tenant-id': import.meta.env.VITE_TEST_TENANT_ID,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as ReferencePronoun;
      console.log('✅ [PERSON_SERVICE] Pronoun fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [PERSON_SERVICE] Failed to fetch pronoun:', error);
      throw new Error(`Unable to fetch pronoun: ${error.message}`);
    }
  }

  /**
   * Helper method to get field label from metadata with fallback
   * @param fieldId - The field identifier
   * @param metadata - The metadata object
   * @param defaultLabel - Fallback label if metadata not available
   * @returns string
   */
  static getFieldLabel(
    fieldId: string, 
    metadata: Record<string, FieldMetadata>, 
    defaultLabel: string
  ): string {
    if (!metadata || typeof metadata !== 'object') {
      return defaultLabel;
    }
    const fieldMetadata = metadata[fieldId];
    return fieldMetadata?.label || defaultLabel;
  }

  /**
   * Helper method to get field description from metadata
   * @param fieldId - The field identifier
   * @param metadata - The metadata object
   * @returns string | undefined
   */
  static getFieldDescription(
    fieldId: string, 
    metadata: Record<string, FieldMetadata>
  ): string | undefined {
    if (!metadata || typeof metadata !== 'object') {
      return undefined;
    }
    return metadata[fieldId]?.description;
  }

  /**
   * Helper method to get field placeholder from metadata
   * @param fieldId - The field identifier
   * @param metadata - The metadata object
   * @param defaultPlaceholder - Fallback placeholder
   * @returns string | undefined
   */
  static getFieldPlaceholder(
    fieldId: string, 
    metadata: Record<string, FieldMetadata>,
    defaultPlaceholder?: string
  ): string | undefined {
    if (!metadata || typeof metadata !== 'object') {
      return defaultPlaceholder;
    }
    return metadata[fieldId]?.placeholder || defaultPlaceholder;
  }

  /**
   * Helper method to check if field is required from metadata
   * @param fieldId - The field identifier
   * @param metadata - The metadata object
   * @param defaultRequired - Fallback required state
   * @returns boolean
   */
  static isFieldRequired(
    fieldId: string, 
    metadata: Record<string, FieldMetadata>,
    defaultRequired: boolean = false
  ): boolean {
    if (!metadata || typeof metadata !== 'object') {
      return defaultRequired;
    }
    const fieldMetadata = metadata[fieldId];
    return fieldMetadata?.is_required ?? defaultRequired;
  }

  /**
   * Helper method to check if field is visible from metadata
   * @param fieldId - The field identifier
   * @param metadata - The metadata object
   * @param defaultVisible - Fallback visible state
   * @returns boolean
   */
  static isFieldVisible(
    fieldId: string, 
    metadata: Record<string, FieldMetadata>,
    defaultVisible: boolean = true
  ): boolean {
    if (!metadata || typeof metadata !== 'object') {
      return defaultVisible;
    }
    const fieldMetadata = metadata[fieldId];
    return fieldMetadata?.is_visible ?? defaultVisible;
  }
}

// Export singleton instance
export const personService = new PersonService();