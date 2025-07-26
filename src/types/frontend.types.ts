// Frontend-specific types that map to UI components
// These types bridge the gap between API data and UI display

// Language skill with proficiency level for JSONB storage
export interface LanguageSkill {
  id: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
  isPrimary?: boolean;
  dateAdded?: string;
}

export interface PersonProfile {
  // Header info
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  isVIP?: boolean;
  hasOutstandingTasks?: boolean;
  
  // Details Section
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalities?: string[];
  languages?: LanguageSkill[];
  
  // Location Section
  currentLocation?: {
    address: string;
    duration?: string;
    startDate?: string;
  };
  permanentHome?: {
    address: string;
    propertyType?: 'Owned' | 'Rented';
  };
  locationHistory?: LocationHistoryItem[];
  
  // Work & Employment Section
  employmentRecords?: EmploymentRecord[];
  
  // Contact Section
  contact?: {
    workEmail: string;
    workPhone: string;
    personalEmail?: string;
    mobilePhone?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  contactHistory?: ContactHistoryItem[];
  
  // Family Section
  familySummary?: {
    maritalStatus: string;
    totalDependents: number;
    passportsHeld: number;
  };
  familyMembers?: FamilyMember[];
  
  // Legal & Compliance Section
  workAuthorization?: {
    visaType: string;
    status: string;
    expiryDate: string;
    workCountries: string[];
  };
  complianceDocuments?: ComplianceDocument[];
  
  // Moves Section (for future Case Management integration)
  moves?: Move[];
  
  // Documents Section
  documents?: Document[];
  
  // Communication Section
  communications?: Communication[];
  
  // Activity Section
  activities?: Activity[];
}

// Employment Status and Change Tracking
export interface EmploymentChangeHistory {
  id: string;
  employmentId: string;
  changeType: 'created' | 'updated' | 'ended' | 'extended' | 'promoted' | 'transferred' | 'role_changed' | 'salary_changed';
  changedBy: string;
  changeDate: string;
  changes: Record<string, { from: any; to: any; field: string }>;
  reason?: string;
  notes?: string;
}

export interface EmploymentStatus {
  status: 'active' | 'future' | 'historical' | 'terminated' | 'on_leave';
  statusDate: string;
  reason?: string;
  notes?: string;
}

export interface EmploymentConflict {
  id: string;
  type: 'overlap' | 'gap' | 'invalid_dates' | 'missing_data';
  severity: 'error' | 'warning' | 'info';
  message: string;
  conflictingRecordId?: string;
  suggestedAction?: string;
}

// Supporting Types
export interface EmploymentRecord {
  id: string;
  personId: string;
  
  // Core Employment Information
  jobTitle?: string;
  jobFunction?: string;
  jobFunctionId?: string; // Reference to API job function
  department?: string;
  employerName?: string;
  employmentType?: string;
  employmentTypeId?: string; // Reference to API employment type
  jobGrade?: string;
  jobGradeId?: string; // Reference to API job grade
  roleDescription?: string;
  
  // Location Information
  employerLocation?: string;
  employerLocationId?: string; // Reference to API city
  workLocation?: 'Office' | 'Remote' | 'Hybrid';
  workArrangement?: string;
  
  // Employment Period
  startDate: string;
  endDate?: string;
  isActive: boolean;
  plannedEndDate?: string; // For future assignments
  
  // Employment Type Classification
  isSecondaryContract: boolean;
  isPrimaryEmployment: boolean;
  isFutureAssignment: boolean;
  
  // Relationships
  managers?: Array<{
    id: string;
    name: string;
    email?: string;
    role?: string;
    isPrimary?: boolean;
  }>;
  employeeReferences?: string[];
  reportingStructure?: string;
  
  // Additional Information
  workingHours?: {
    hoursPerWeek?: number;
    schedule?: string;
    timeZone?: string;
  };
  compensation?: {
    salaryBand?: string;
    currency?: string;
    reviewDate?: string;
  };
  benefits?: {
    healthInsurance?: boolean;
    retirement?: boolean;
    vacation?: number;
    other?: string[];
  };
  
  // Status and Tracking
  status: EmploymentStatus;
  conflicts?: EmploymentConflict[];
  changeHistory?: EmploymentChangeHistory[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
  
  // Integration Fields
  externalId?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
  lastSyncDate?: string;
  
  // Notes and Tags
  notes?: string;
  tags?: string[];
  flags?: Array<{
    type: string;
    value: string;
    setBy: string;
    setDate: string;
  }>;
}

export interface LocationHistoryItem {
  date: string;
  location: string;
  change: string;
}


export interface ContactHistoryItem {
  date: string;
  type: string;
  details: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Partner' | 'Other';
  age?: number;
  dateOfBirth?: string;
  passportStatus?: 'Valid' | 'Expired' | 'None';
  visaRequired?: boolean;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Expired';
  downloadUrl?: string;
}

export interface Move {
  id: string;
  type: 'Long-term Assignment' | 'Business Trip' | 'Remote Work';
  location: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  details?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Personal' | 'Work' | 'Legal' | 'Medical';
  fileType: string;
  uploadDate: string;
  size: string;
  verificationStatus: 'Verified' | 'Pending' | 'Not Required';
}

export interface Communication {
  id: string;
  type: 'Email' | 'Call' | 'Meeting' | 'SMS';
  date: string;
  time: string;
  participants: string[];
  subject: string;
  notes?: string;
  status: 'Responded' | 'Pending' | 'No Response Needed';
}

export interface Activity {
  id: string;
  type: string;
  timestamp: string;
  user: string;
  description: string;
  details?: Record<string, any>;
}

// List View Types
export interface PersonListItem {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  currentLocation: string;
  permanentHome: string;
  status: {
    color: string;
    label: string;
  };
  email: string;
  personalEmail: string;
  phone?: string;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarBg?: string;
}