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
} from '../types/api.types';
import { 
  PersonProfile, 
  PersonListItem,
  FamilyMember,
  EmploymentHistoryItem,
  LocationHistoryItem,
  ContactHistoryItem,
  Communication,
  Activity
} from '../types/frontend.types';

// Map API Person to List View Item
export function mapPersonToListItem(person: Person): PersonListItem {
  // For list view, we only have basic person data
  // Additional data would need to be fetched separately
  
  return {
    id: person.person_id,
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
    avatarBg: generateAvatarColor(person.person_id)
  };
}

// Map API PersonComposite to Frontend PersonProfile
export function mapPersonToProfile(person: PersonComposite): PersonProfile {
  const currentAddress = person.addresses?.find(a => a.is_current_address);
  const permanentAddress = person.addresses?.find(a => !a.is_current_address);
  const currentEmployment = person.employment?.find(e => e.is_active);
  const currentPartner = person.partners?.find(p => p.is_current);
  
  return {
    // Header info
    id: person.person_id,
    name: `${person.first_name} ${person.last_name}`,
    initials: getInitials(person.first_name, person.last_name),
    isVIP: false, // This would come from flags or custom field
    hasOutstandingTasks: false, // This would come from tasks/cases API
    
    // Details Section
    bio: person.bio || undefined,
    dateOfBirth: person.date_of_birth,
    nationality: person.country_of_birth_id, // Would need country lookup
    languages: (() => {
      if (!person.languages) return [];
      const langs = [];
      if (person.languages.primary) langs.push(person.languages.primary);
      if (person.languages.secondary) {
        if (Array.isArray(person.languages.secondary)) {
          langs.push(...person.languages.secondary);
        } else if (typeof person.languages.secondary === 'string') {
          langs.push(person.languages.secondary);
        }
      }
      return langs;
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
    currentPosition: currentEmployment ? {
      jobTitle: currentEmployment.job_title || '',
      department: currentEmployment.department || '',
      startDate: currentEmployment.employment_start_date || '',
      manager: currentEmployment.managers?.[0]?.name || '',
      employmentType: currentEmployment.employment_type || 'Full-time',
      workLocation: mapWorkLocation(currentEmployment.employer_location)
    } : undefined,
    employmentHistory: mapEmploymentHistory(person.employment || []),
    
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

function mapEmploymentHistory(employment: PersonEmployment[]): EmploymentHistoryItem[] {
  return employment
    .filter(e => !e.is_active)
    .sort((a, b) => new Date(b.employment_start_date || 0).getTime() - new Date(a.employment_start_date || 0).getTime())
    .map(emp => ({
      period: `${emp.employment_start_date} - ${emp.employment_end_date || 'Present'}`,
      position: emp.job_title || 'Unknown Position',
      department: emp.department || '',
      description: emp.role_description || ''
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
  
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}