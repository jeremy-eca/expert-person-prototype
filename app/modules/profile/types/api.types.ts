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

// Employee Reference
export interface EmployeeReference {
  primary: string;
  secondary?: string;
}

// Languages structure
export interface PersonLanguages {
  primary: string;
  secondary: string[];
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