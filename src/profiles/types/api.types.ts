// API Response Types based on Expert Persons API

// Actual API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  totalCount?: number;
  data: T;
  _links?: {
    self: string;
  };
  _metadata?: {
    language_code: string;
    entity_context: any;
  };
  _fields?: Record<string, any>;
}

// Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: any;
}

// Employee Reference with correct JSONB structure
export interface EmployeeReference {
  primary: {
    id: string;
    source: string;
    type: string;
  };
  references: Array<{
    id: string;
    source: string;
    type: string;
    is_primary: boolean;
  }>;
}

// Languages structure
export interface PersonLanguages {
  primary: string;
  secondary: string[];
}

// Enhanced Language Object for new person profile API
export interface LanguageObject {
  code: string; // ISO 639-1/639-2 language code
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  is_active?: boolean; // defaults to true
  is_primary?: boolean; // defaults to false, only one allowed per person
}

// Address Object for person profile API
export interface AddressObject {
  name?: string; // Address description/name
  line1?: string; // Primary address line
  line2?: string; // Secondary address line
  city?: string; // City name
  state?: string; // State or province
  postcode?: string; // Postal/ZIP code
  country?: string; // Country name
  latitude?: number; // Geographic latitude (-90 to 90)
  longitude?: number; // Geographic longitude (-180 to 180)
  google_place_id?: string; // Google Places ID
  plus_code?: string; // Plus code location
}

// Contact Object for person profile API
export interface ContactObject {
  work_phone_number?: string; // Work phone number
  phone_number?: string; // General phone number
  mobile_number?: string; // Mobile phone number
  work_email_address?: string; // Work email address
  personal_email_address?: string; // Personal email address
}

// Person Profile Create Request (matches API spec exactly)
export interface PersonProfileCreateRequest {
  // Required person fields
  first_name: string;
  last_name: string;
  
  // Optional person fields
  preferred_name?: string;
  email?: string;
  date_of_birth?: string; // ISO 8601 format
  time_zone?: string;
  bio?: string;
  photo?: string;
  person_signature?: string;
  
  // UUID reference fields
  title_id?: string;
  gender_id?: string;
  pronouns_id?: string;
  country_of_birth_id?: string;
  city_of_birth_id?: string;
  marital_status_id?: string;
  job_grade_id?: string;
  employment_type_id?: string;
  ethnicity_id?: string;
  gender_identity_id?: string;
  current_line_manager_id?: string;
  
  // Employee reference fields (stored in JSONB)
  employee_id?: string;
  employee_id_source?: string;
  employee_reference?: EmployeeReference;
  
  // Enhanced languages with proficiency tracking
  languages?: LanguageObject[];
  
  // Nationalities (array of UUIDs, stored as JSONB)
  nationalities?: string[];
  
  // Optional address section
  address?: AddressObject;
  
  // Optional contact details section
  contact?: ContactObject;
}

// Person Profile Update Request (all fields optional for COALESCE updates)
export interface PersonProfileUpdateRequest {
  // All person fields are optional for updates
  first_name?: string;
  last_name?: string;
  preferred_name?: string;
  email?: string;
  date_of_birth?: string;
  time_zone?: string;
  bio?: string;
  photo?: string;
  person_signature?: string;
  
  // UUID reference fields (all optional for updates)
  title_id?: string;
  pronouns_id?: string;
  country_of_birth_id?: string;
  city_of_birth_id?: string;
  marital_status_id?: string;
  job_grade_id?: string;
  employment_type_id?: string;
  ethnicity_id?: string;
  gender_identity_id?: string;
  gender_id?: string;
  current_line_manager_id?: string;
  
  // Employee reference fields (merges with existing JSONB)
  employee_id?: string;
  employee_id_source?: string;
  
  // Languages (completely replaces existing if provided)
  languages?: LanguageObject[];
  
  // Nationalities (replaces existing if provided)
  nationalities?: string[];
  
  // Address section (upserts existing or creates new)
  address?: AddressObject;
  
  // Contact section (upserts existing or creates new)
  contact?: ContactObject;
}

// Person Profile Create Response
export interface PersonProfileCreateResponse {
  success: boolean;
  data: {
    person_id: string;
    address_id?: string; // null if no address data provided
    contact_id?: string; // null if no contact data provided
    tenant_id: string;
    created_at: string;
  };
  message: string;
}

// Person Profile Update Response
export interface PersonProfileUpdateResponse {
  success: boolean;
  data: {
    id: string; // for backward compatibility
    person_id: string;
    address_id?: string; // null if no address updated
    contact_id?: string; // null if no contact updated
    languages_updated: number;
    updated_at: string;
  };
  message: string;
}

// Core Person Type - matches actual API response
export interface Person {
  person_id: string;
  employee_reference: EmployeeReference;
  status: string;
  title_id: string | null;
  pronouns_id: string | null;
  first_name: string;
  middle_names: string | null;
  last_name: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  country_of_birth_id: string | null;
  city_of_birth_id: string | null;
  marital_status_id: string | null;
  time_zone: string | null;
  job_grade_id: string | null;
  employment_type_id: string | null;
  is_user: boolean;
  user_id: string | null;
  email: string;
  languages: PersonLanguages;
  bio: string | null;
  tenant_id: string;
  created_date: string;
  created_by: string;
  last_modified_date: string;
  last_modified_by: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  ethnicity_id: string | null;
  gender_identity_id: string | null;
  hobbies: string | null;
  food_preferences: string | null;
  allergies: string | null;
  current_tax_domicile: string | null;
  photo: string | null;
  gender_id: string | null;
  current_employer_location_id: string | null;
}

// Pagination parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  filter?: Record<string, any>;
  include?: string;
}

// List response structure
export interface PersonListResponse {
  persons: Person[];
  total: number;
  limit: number;
  offset: number;
}

// Address Types (keeping existing structure for now)
export interface PersonAddress {
  address_id: string;
  tenant_id: string;
  owner_id: string;
  is_current_address: boolean;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  address_components?: Record<string, any>;
  google_place_id?: string;
  formatted_address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

// Contact Details
export interface PersonContactDetails {
  contact_id: string;
  tenant_id: string;
  owner_id: string;
  is_current: boolean;
  work_phone_number?: string;
  phone_number?: string;
  mobile_number?: string;
  work_email_address?: string;
  personal_email_address?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Employment
export interface PersonEmployment {
  id: string;
  person_id: string;
  tenant_id: string;
  employment_start_date?: string;
  employment_end_date?: string;
  job_title?: string;
  department?: string;
  employer_name?: string;
  employment_type?: string;
  job_grade?: string;
  job_function?: string;
  role_description?: string;
  employer_location?: string;
  managers?: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Family - Partners
export interface PersonPartner {
  id: string;
  tenant_id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  gender_id?: string;
  nationality_id?: string;
  relationship_type?: string;
  marital_status_id?: string;
  since_date?: string;
  until_date?: string;
  is_current: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Family - Children
export interface PersonChild {
  id: string;
  tenant_id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  gender_id?: string;
  is_dependent: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Emergency Contacts
export interface PersonEmergencyContact {
  id: string;
  tenant_id: string;
  owner_id: string;
  title?: string;
  first_name: string;
  middle_names?: string;
  last_name: string;
  preferred_name?: string;
  relationship?: string;
  contact_id?: string;
  address_id?: string;
  created_at: string;
  updated_at: string;
}

// Languages (detailed)
export interface PersonLanguage {
  id: string;
  tenant_id: string;
  person_id: string;
  language_id: string;
  proficiency?: 'basic' | 'conversational' | 'professional' | 'native';
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Permits/Visas
export interface PersonPermitVisa {
  id: string;
  tenant_id: string;
  person_id: string;
  case_id?: string;
  permit_type?: string;
  country_id?: string;
  state_id?: string;
  permit_application_date?: string;
  permit_granted_date?: string;
  permit_number?: string;
  permit_start_date?: string;
  permit_expiry_date?: string;
  issued_by?: string;
  status?: string;
  permit_conditions?: string;
  work_eligibility_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Passports
export interface PersonPassport {
  id: string;
  tenant_id: string;
  person_id: string;
  passport_number: string;
  issuing_country_id: string;
  issue_date?: string;
  expiry_date?: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Notes
export interface PersonNote {
  id: string;
  tenant_id: string;
  person_id: string;
  case_id?: string;
  note_text: string;
  created_by: string;
  created_at: string;
}

// Field Metadata for labels and localization
export interface FieldMetadata {
  field_id: string;
  label: string;
  description?: string;
  placeholder?: string;
  help_text?: string;
  data_type: string;
  is_required: boolean;
  is_visible: boolean;
  validation_rules?: Record<string, any>;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

// Person With Metadata Response
export interface PersonWithMetadata {
  person: PersonComposite;
  metadata: {
    language_code: string;
    entity_context: string;
    fields: Record<string, FieldMetadata>;
  };
}

// Composite Person Data
export interface PersonComposite extends Person {
  addresses?: PersonAddress[];
  contact_details?: PersonContactDetails;
  employment?: PersonEmployment[];
  partners?: PersonPartner[];
  children?: PersonChild[];
  emergency_contacts?: PersonEmergencyContact[];
  languages_detail?: PersonLanguage[];
  permits_visas?: PersonPermitVisa[];
  passports?: PersonPassport[];
  notes?: PersonNote[];
}