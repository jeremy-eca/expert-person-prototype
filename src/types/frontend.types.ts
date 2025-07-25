// Frontend-specific types that map to UI components
// These types bridge the gap between API data and UI display

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
  languages?: string[];
  
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
  currentPosition?: {
    jobTitle: string;
    department: string;
    startDate: string;
    manager: string;
    employmentType: string;
    workLocation: 'Hybrid' | 'Remote' | 'Office';
  };
  employmentHistory?: EmploymentHistoryItem[];
  
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

// Supporting Types
export interface LocationHistoryItem {
  date: string;
  location: string;
  change: string;
}

export interface EmploymentHistoryItem {
  period: string;
  position: string;
  department: string;
  description: string;
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