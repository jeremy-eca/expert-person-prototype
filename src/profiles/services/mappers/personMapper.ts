// Mapper functions to transform backend API data to frontend UI format
// Preserves the exact UI structure while adapting to backend data

import { 
  Person, 
  PersonComposite, 
  PersonAddress, 
  PersonContactDetails,
  PersonEmployment,
  PersonPartner,
  PersonChild,
  PersonEmergencyContact,
  PersonLanguage,
  PersonPermitVisa,
  PersonNote
} from '../../types/api.types';
import { 
  PersonProfile, 
  PersonListItem,
  EmploymentRecord,
  FamilyMember,
  LanguageSkill,
  LocationHistoryItem,
  ContactHistoryItem,
  Communication,
  Activity
} from '../../types/frontend.types';

// Map API PersonEmployment to Frontend EmploymentRecord
export function mapEmploymentToFrontend(employment: PersonEmployment): EmploymentRecord {
  return {
    id: employment.id,
    personId: employment.person_id,
    jobTitle: employment.job_title,
    jobFunction: employment.job_function,
    department: employment.department,
    employerName: employment.employer_name,
    employmentType: employment.employment_type,
    jobGrade: employment.job_grade,
    roleDescription: employment.role_description,
    employerLocation: employment.employer_location,
    startDate: employment.employment_start_date || '',
    endDate: employment.employment_end_date,
    isActive: employment.is_active || false,
    isSecondaryContract: false, // Default value, would come from API
    managers: employment.managers || [],
    employeeReferences: [], // Would need to parse from JSONB
    createdAt: employment.created_at,
    updatedAt: employment.updated_at
  };
}

// Map API Person to List View Item (for backward compatibility)
export function mapPersonToListItem(person: Person): PersonListItem {
  return {
    id: person.id || person.person_id,
    name: `${person.first_name} ${person.last_name}`,
    jobTitle: 'Job title', // Would need to fetch employment data
    department: 'Department', // Would need to fetch employment data
    currentLocation: 'Unknown', // Would need to fetch address data
    permanentHome: 'Unknown', // Would need to fetch address data
    status: determinePersonStatus(person),
    email: person.email || '',
    personalEmail: '–', // Would need to fetch contact details
    phone: undefined, // Would need to fetch contact details
    avatarInitials: getInitials(person.first_name, person.last_name),
    avatarBg: generateAvatarColor(person.id || person.person_id)
  };
}

// Map optimized list endpoint data to List View Item
export function mapPersonListItemFromApi(item: {
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
}): PersonListItem {
  const mapped = {
    id: item.person_id,
    name: `${item.first_name} ${item.last_name}`,
    jobTitle: item.employment_type?.name || 'Not specified',
    department: item.employment_type?.category || 'Not specified',
    currentLocation: item.current_country || 'Not specified',
    permanentHome: 'Not specified', // Not available in list endpoint
    status: determinePersonStatusFromCountry(item.current_country),
    email: item.email || '',
    personalEmail: '–', // Not available in list endpoint
    phone: undefined, // Not available in list endpoint
    avatarInitials: getInitials(item.first_name, item.last_name),
    avatarBg: generateAvatarColor(item.person_id)
  };
  
  return mapped;
}

// Map API PersonComposite to Frontend PersonProfile
export function mapPersonToProfile(person: PersonComposite): PersonProfile {
  const currentAddress = person.addresses?.find(a => a.is_current_address);
  const permanentAddress = person.addresses?.find(a => !a.is_current_address);
  const currentPartner = person.partners?.find(p => p.is_current);
  
  const profile = {
    // Header info
    id: person.person_id,
    name: `${person.first_name || 'Unknown'} ${person.last_name || 'Person'}`,
    initials: getInitials(person.first_name || 'U', person.last_name || 'P'),
    isVIP: false, // This would come from flags or custom field
    hasOutstandingTasks: false, // This would come from tasks/cases API
    
    // Details Section
    bio: person.bio || undefined,
    dateOfBirth: person.date_of_birth || undefined,
    nationality: person.country_of_birth_id || undefined, // Would need country lookup
    nationalities: person.nationalities ? 
      (Array.isArray(person.nationalities) ? person.nationalities : [person.nationalities]) : 
      undefined,
    languages: (() => {
      if (!person.languages) return [];
      const languages: LanguageSkill[] = [];
      
      // Add primary language
      if (person.languages.primary) {
        languages.push({
          id: `lang_primary_${Date.now()}`,
          language: person.languages.primary,
          proficiency: 'Native',
          isPrimary: true,
          dateAdded: new Date().toISOString()
        });
      }
      
      // Add secondary languages
      if (person.languages.secondary) {
        const secondaryLangs = Array.isArray(person.languages.secondary) 
          ? person.languages.secondary 
          : [person.languages.secondary];
          
        secondaryLangs.forEach((lang, index) => {
          languages.push({
            id: `lang_secondary_${index}_${Date.now()}`,
            language: lang,
            proficiency: 'Professional', // Default proficiency for secondary languages
            isPrimary: false,
            dateAdded: new Date().toISOString()
          });
        });
      }
      
      return languages;
    })(),
    
    // Location Section
    currentLocation: currentAddress ? {
      address: formatAddress(currentAddress),
      startDate: currentAddress.created_at,
      duration: calculateDuration(currentAddress.created_at)
    } : undefined,
    permanentHome: permanentAddress ? {
      address: formatAddress(permanentAddress),
      propertyType: undefined // Not in database
    } : undefined,
    locationHistory: mapLocationHistory(person.addresses || []),
    
    // Work & Employment Section
    employmentRecords: person.employment?.map(mapEmploymentToFrontend) || [],
    
    // Contact Section
    contact: person.contact_details ? {
      workEmail: person.contact_details.work_email_address || '',
      workPhone: person.contact_details.work_phone_number || '',
      personalEmail: person.contact_details.personal_email_address,
      mobilePhone: person.contact_details.mobile_number
    } : undefined,
    emergencyContact: mapEmergencyContact(person.emergency_contacts?.[0]),
    contactHistory: [], // Would need audit log
    
    // Family Section
    familySummary: {
      maritalStatus: mapMaritalStatus(currentPartner),
      totalDependents: person.children?.filter(c => c.is_dependent).length || 0,
      passportsHeld: person.passports?.length || 0
    },
    familyMembers: mapFamilyMembers(person.partners || [], person.children || []),
    
    // Legal & Compliance Section
    workAuthorization: mapWorkAuthorization(person.permits_visas),
    complianceDocuments: [], // Would come from documents API
    
    // Other sections
    moves: [], // Will come from Case Management API
    documents: [], // Will come from Documents API
    communications: mapCommunications(person.notes || []),
    activities: mapActivities(person)
  };
  
  return profile;
}

// Helper Functions
function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

function generateAvatarColor(id: string): string {
  const colors = ['#f04e98', '#814ef0', '#9817a4', '#00ceba'];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
}

function determinePersonStatus(person: Person): { color: string; label: string } {
  // This is mock logic - would need real business rules
  const statuses = [
    { color: '#98f2c9', label: 'Working remotely' },
    { color: '#c8d3de', label: 'As usual' },
    { color: '#cd6eff', label: 'On assignment' },
    { color: '#02add2', label: 'On business trip' }
  ];
  
  return statuses[0]; // Default status
}

function determinePersonStatusFromCountry(country: string | null): { color: string; label: string } {
  // Determine status based on country - this would be real business logic
  const statuses = [
    { color: '#98f2c9', label: 'Working remotely' },
    { color: '#c8d3de', label: 'As usual' },
    { color: '#cd6eff', label: 'On assignment' },
    { color: '#02add2', label: 'On business trip' }
  ];
  
  // Simple logic: if country is provided, they might be on assignment
  if (country && country !== 'USA') {
    return statuses[2]; // On assignment
  }
  
  return statuses[1]; // As usual
}

function formatAddress(address: PersonAddress): string {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postcode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ') || address.formatted_address || '';
}

function calculateDuration(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  const months = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  if (months < 1) return 'Less than a month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year' : `${years} years`;
}

function mapWorkLocation(location?: string): 'Hybrid' | 'Remote' | 'Office' {
  // This would need business logic based on the location string
  return 'Hybrid';
}

function mapLocationHistory(addresses: PersonAddress[]): LocationHistoryItem[] {
  return addresses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(addr => ({
      date: new Date(addr.created_at).toLocaleDateString(),
      location: addr.city || 'Unknown',
      change: addr.is_current_address ? 'Moved to' : 'Previous location'
    }));
}

function mapEmergencyContact(contact?: PersonEmergencyContact): PersonProfile['emergencyContact'] {
  if (!contact) return undefined;
  
  return {
    name: `${contact.first_name} ${contact.last_name}`,
    relationship: contact.relationship || '',
    phone: '' // Would need to fetch from linked contact_details
  };
}

function mapMaritalStatus(partner?: PersonPartner): string {
  if (!partner) return 'Single';
  if (partner.marital_status_id) {
    // Would need to lookup marital status by ID
    return 'Married';
  }
  return partner.relationship_type || 'In Relationship';
}

function mapFamilyMembers(partners: PersonPartner[], children: PersonChild[]): FamilyMember[] {
  const members: FamilyMember[] = [];
  
  // Add partners
  partners.forEach(partner => {
    if (partner.is_current) {
      members.push({
        id: partner.id,
        name: `${partner.first_name} ${partner.last_name}`,
        relationship: 'Spouse',
        dateOfBirth: partner.date_of_birth,
        age: partner.date_of_birth ? calculateAge(partner.date_of_birth) : undefined
      });
    }
  });
  
  // Add children
  children.forEach(child => {
    members.push({
      id: child.id,
      name: `${child.first_name} ${child.last_name}`,
      relationship: 'Child',
      dateOfBirth: child.date_of_birth,
      age: child.date_of_birth ? calculateAge(child.date_of_birth) : undefined,
      visaRequired: child.is_dependent
    });
  });
  
  return members;
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function mapWorkAuthorization(visas?: PersonPermitVisa[]): PersonProfile['workAuthorization'] {
  const activeVisa = visas?.find(v => v.status === 'active' || v.status === 'valid');
  
  if (!activeVisa) return undefined;
  
  return {
    visaType: activeVisa.permit_type || '',
    status: activeVisa.status || '',
    expiryDate: activeVisa.permit_expiry_date || '',
    workCountries: [activeVisa.country_id || ''].filter(Boolean) // Would need country lookup
  };
}

function mapCommunications(notes: PersonNote[]): Communication[] {
  return notes.map(note => ({
    id: note.id,
    type: 'Meeting' as const, // Would need to parse from note content
    date: new Date(note.created_at).toLocaleDateString(),
    time: new Date(note.created_at).toLocaleTimeString(),
    participants: [note.created_by],
    subject: note.note_text.substring(0, 50) + '...',
    notes: note.note_text,
    status: 'No Response Needed' as const
  }));
}

function mapActivities(person: PersonComposite): Activity[] {
  const activities: Activity[] = [];
  
  // Add creation activity
  activities.push({
    id: `created-${person.person_id}`,
    type: 'Profile Created',
    timestamp: person.created_date,
    user: person.created_by || 'System',
    description: 'Profile created'
  });
  
  // Add update activity if different from creation
  if (person.last_modified_date !== person.created_date) {
    activities.push({
      id: `updated-${person.person_id}`,
      type: 'Profile Updated',
      timestamp: person.last_modified_date,
      user: person.last_modified_by || 'System',
      description: 'Profile information updated'
    });
  }
  
  // Add employment-related activities
  person.employment?.forEach((emp, index) => {
    activities.push({
      id: `employment-created-${emp.id}`,
      type: 'Employment Record Created',
      timestamp: emp.created_at,
      user: emp.created_by || 'System',
      description: `Employment record created: ${emp.job_title || 'Unknown Position'} at ${emp.employer_name || 'Unknown Company'}`
    });
    
    if (emp.updated_at !== emp.created_at) {
      activities.push({
        id: `employment-updated-${emp.id}`,
        type: 'Employment Record Updated',
        timestamp: emp.updated_at,
        user: emp.updated_by || 'System',
        description: `Employment record updated: ${emp.job_title || 'Unknown Position'}`
      });
    }
  });
  
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Maps PersonEmployment from API to frontend EmploymentRecord format
 */
export function mapPersonEmploymentToRecord(employment: PersonEmployment): EmploymentRecord {
  return {
    id: employment.id,
    personId: employment.person_id,
    jobTitle: employment.job_title,
    jobFunction: employment.job_function,
    jobFunctionId: employment.job_function_id,
    department: employment.department,
    employerName: employment.employer_name,
    employmentType: employment.employment_type,
    employmentTypeId: employment.employment_type_id,
    jobGrade: employment.job_grade,
    jobGradeId: employment.job_grade_id,
    roleDescription: employment.role_description,
    employerLocation: employment.employer_location,
    employerLocationId: employment.employer_location_id,
    workLocation: employment.work_location as 'Office' | 'Remote' | 'Hybrid',
    workArrangement: employment.work_arrangement,
    startDate: employment.employment_start_date || '',
    endDate: employment.employment_end_date,
    isActive: employment.is_active,
    plannedEndDate: employment.planned_end_date,
    isSecondaryContract: employment.is_secondary_contract || false,
    isPrimaryEmployment: employment.is_primary_employment ?? true,
    isFutureAssignment: employment.is_future_assignment || false,
    managers: employment.managers?.map(manager => ({
      id: manager.id || `temp-${Date.now()}`,
      name: manager.name,
      email: manager.email,
      role: manager.role,
      isPrimary: manager.isPrimary || false
    })) || [],
    employeeReferences: employment.employee_references || [],
    reportingStructure: employment.reporting_structure,
    workingHours: {
      hoursPerWeek: employment.working_hours_per_week,
      schedule: employment.work_schedule,
      timeZone: employment.time_zone
    },
    compensation: {
      salaryBand: employment.salary_band,
      currency: employment.currency,
      reviewDate: employment.review_date
    },
    benefits: {
      healthInsurance: employment.health_insurance,
      retirement: employment.retirement_benefits,
      vacation: employment.vacation_days,
      other: employment.other_benefits ? employment.other_benefits.split(',') : []
    },
    status: {
      status: employment.employment_status as 'active' | 'future' | 'historical' | 'terminated' | 'on_leave' || 'active',
      statusDate: employment.status_date || employment.created_at,
      reason: employment.status_reason,
      notes: employment.status_notes
    },
    conflicts: [],
    changeHistory: [],
    createdAt: employment.created_at,
    updatedAt: employment.updated_at,
    createdBy: employment.created_at,
    updatedBy: employment.updated_at,
    version: employment.version,
    externalId: employment.external_id,
    syncStatus: employment.sync_status as 'synced' | 'pending' | 'error',
    lastSyncDate: employment.last_sync_date,
    notes: employment.notes,
    tags: employment.tags ? employment.tags.split(',') : [],
    flags: employment.flags || []
  };
}