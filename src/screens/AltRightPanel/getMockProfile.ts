import { PersonProfile } from '../../types/frontend.types';
import { PersonComposite } from '../../types/api.types';

// Mock profile data for development fallback
export function getMockProfile(id: string): PersonProfile {
  return {
    id,
    name: "Michael Chen",
    initials: "MC",
    isVIP: true,
    hasOutstandingTasks: true,
    
    bio: "Experienced software engineer specializing in cloud architecture and distributed systems. Passionate about building scalable solutions and mentoring junior developers.",
    dateOfBirth: "1985-03-15",
    nationality: "United States",
    nationalities: ["United States", "China"],
    languages: ["English", "Mandarin", "Spanish"],
    
    currentLocation: {
      address: "Barcelona, Spain",
      duration: "2 years",
      startDate: "2022-01-15"
    },
    permanentHome: {
      address: "San Francisco, CA, USA",
      propertyType: "Owned"
    },
    locationHistory: [
      { date: "2022-01-15", location: "Barcelona", change: "Moved to" },
      { date: "2019-06-01", location: "London", change: "Previous location" },
      { date: "2015-09-01", location: "San Francisco", change: "Previous location" }
    ],
    
    currentPosition: {
      jobTitle: "Senior Software Engineer",
      department: "Engineering",
      startDate: "2022-01-15",
      manager: "Sarah Johnson",
      employmentType: "Full-time",
      workLocation: "Hybrid"
    },
    employmentHistory: [
      {
        period: "2019-2021",
        position: "Software Engineer",
        department: "Product Development",
        description: "Led development of microservices architecture"
      },
      {
        period: "2015-2019",
        position: "Junior Developer",
        department: "Engineering",
        description: "Full-stack development using React and Node.js"
      }
    ],
    
    contact: {
      workEmail: "michael.chen@company.com",
      workPhone: "+34 612 345 678",
      personalEmail: "m.chen@gmail.com",
      mobilePhone: "+1 415 555 0123"
    },
    emergencyContact: {
      name: "Jennifer Chen",
      relationship: "Spouse",
      phone: "+1 415 555 0124"
    },
    
    familySummary: {
      maritalStatus: "Married",
      totalDependents: 2,
      passportsHeld: 2
    },
    familyMembers: [
      {
        id: "1",
        name: "Jennifer Chen",
        relationship: "Spouse",
        age: 36,
        passportStatus: "Valid",
        visaRequired: false
      },
      {
        id: "2",
        name: "Emma Chen",
        relationship: "Child",
        age: 8,
        passportStatus: "Valid",
        visaRequired: true
      },
      {
        id: "3",
        name: "Lucas Chen",
        relationship: "Child",
        age: 5,
        passportStatus: "Valid",
        visaRequired: true
      }
    ],
    
    workAuthorization: {
      visaType: "EU Blue Card",
      status: "Active",
      expiryDate: "2025-12-31",
      workCountries: ["Spain", "EU Countries"]
    },
    complianceDocuments: [
      {
        id: "1",
        name: "Work Permit Spain",
        type: "PDF",
        uploadDate: "2023-01-15",
        status: "Verified"
      },
      {
        id: "2",
        name: "Tax Registration",
        type: "PDF",
        uploadDate: "2023-02-01",
        status: "Verified"
      }
    ],
    
    communications: [
      {
        id: "1",
        type: "Email",
        date: "2024-01-10",
        time: "14:30",
        participants: ["Sarah Johnson", "Michael Chen"],
        subject: "Madrid Assignment Update",
        status: "Responded"
      }
    ],
    
    activities: [
      {
        id: "1",
        type: "Profile Updated",
        timestamp: "2024-01-10T10:00:00Z",
        user: "System",
        description: "Emergency contact information updated"
      }
    ]
  };
}

// Mock PersonComposite data that matches the API structure
export function getMockPersonComposite(id: string): PersonComposite {
  return {
    // Core person data
    person_id: id,
    employee_reference: {
      primary: "EMP001",
      secondary: "TECH-2024"
    },
    status: "active",
    title_id: "mr",
    pronouns_id: "he_him",
    first_name: "Michael",
    middle_names: "James",
    last_name: "Chen",
    preferred_name: "Mike",
    date_of_birth: "1985-03-15",
    country_of_birth_id: "US",
    city_of_birth_id: "san_francisco",
    marital_status_id: "married",
    time_zone: "America/Los_Angeles",
    job_grade_id: "senior",
    employment_type_id: "full_time",
    is_user: true,
    user_id: "user_123",
    email: "michael.chen@company.com",
    languages: {
      primary: "English",
      secondary: ["Mandarin", "Spanish"]
    },
    bio: "Experienced software engineer specializing in cloud architecture and distributed systems. Passionate about building scalable solutions and mentoring junior developers.",
    tenant_id: "tenant_123",
    created_date: "2022-01-15T10:00:00Z",
    created_by: "system",
    last_modified_date: "2024-01-10T14:30:00Z",
    last_modified_by: "admin",
    deleted_date: null,
    deleted_by: null,
    ethnicity_id: "asian",
    gender_identity_id: "male",
    hobbies: "Photography, hiking, cooking",
    food_preferences: "Vegetarian",
    allergies: "None",
    current_tax_domicile: "Spain",
    photo: null,
    gender_id: "male",
    current_employer_location_id: "barcelona_office",

    // Addresses array
    addresses: [
      {
        address_id: "addr_current",
        tenant_id: "tenant_123",
        owner_id: id,
        is_current_address: true,
        name: "Barcelona Apartment",
        line1: "Carrer de Mallorca, 123",
        line2: "Apt 4B",
        city: "Barcelona",
        state: "Catalonia",
        postcode: "08013",
        country: "Spain",
        address_components: {
          street_number: "123",
          route: "Carrer de Mallorca",
          locality: "Barcelona",
          administrative_area_level_1: "Catalonia",
          country: "Spain",
          postal_code: "08013"
        },
        google_place_id: "ChIJd3YzYzOipBIRQS4KdS0nGVA",
        formatted_address: "Carrer de Mallorca, 123, Apt 4B, 08013 Barcelona, Spain",
        latitude: 41.3851,
        longitude: 2.1734,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        address_id: "addr_permanent",
        tenant_id: "tenant_123",
        owner_id: id,
        is_current_address: false,
        name: "San Francisco Home",
        line1: "1234 Market Street",
        line2: "Unit 567",
        city: "San Francisco",
        state: "California",
        postcode: "94102",
        country: "United States",
        address_components: {
          street_number: "1234",
          route: "Market Street",
          locality: "San Francisco",
          administrative_area_level_1: "California",
          country: "United States",
          postal_code: "94102"
        },
        google_place_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        formatted_address: "1234 Market Street, Unit 567, San Francisco, CA 94102, USA",
        latitude: 37.7749,
        longitude: -122.4194,
        created_at: "2015-09-01T10:00:00Z",
        updated_at: "2015-09-01T10:00:00Z"
      }
    ],

    // Contact details
    contact_details: {
      contact_id: "contact_123",
      tenant_id: "tenant_123",
      owner_id: id,
      is_current: true,
      work_phone_number: "+34 612 345 678",
      phone_number: "+34 612 345 678",
      mobile_number: "+1 415 555 0123",
      work_email_address: "michael.chen@company.com",
      personal_email_address: "m.chen@gmail.com",
      is_active: true,
      created_at: "2022-01-15T10:00:00Z",
      updated_at: "2024-01-10T14:30:00Z"
    },

    // Employment array
    employment: [
      {
        id: "emp_current",
        person_id: id,
        tenant_id: "tenant_123",
        employment_start_date: "2022-01-15",
        employment_end_date: null,
        job_title: "Senior Software Engineer",
        department: "Engineering",
        employer_name: "TechCorp International",
        employment_type: "Full-time",
        job_grade: "Senior",
        job_function: "Software Development",
        role_description: "Lead development of microservices architecture and mentor junior developers",
        employer_location: "Barcelona, Spain",
        managers: [
          {
            id: "mgr_1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com"
          }
        ],
        is_active: true,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        id: "emp_previous",
        person_id: id,
        tenant_id: "tenant_123",
        employment_start_date: "2019-06-01",
        employment_end_date: "2021-12-31",
        job_title: "Software Engineer",
        department: "Product Development",
        employer_name: "TechCorp International",
        employment_type: "Full-time",
        job_grade: "Mid-level",
        job_function: "Software Development",
        role_description: "Full-stack development using React and Node.js",
        employer_location: "London, UK",
        managers: [
          {
            id: "mgr_2",
            name: "David Wilson",
            email: "david.wilson@company.com"
          }
        ],
        is_active: false,
        created_at: "2019-06-01T10:00:00Z",
        updated_at: "2021-12-31T10:00:00Z"
      }
    ],

    // Partners array
    partners: [
      {
        id: "partner_1",
        tenant_id: "tenant_123",
        person_id: id,
        first_name: "Jennifer",
        last_name: "Chen",
        middle_name: "Marie",
        date_of_birth: "1987-08-22",
        gender_id: "female",
        nationality_id: "US",
        relationship_type: "Spouse",
        marital_status_id: "married",
        since_date: "2015-06-20",
        until_date: null,
        is_current: true,
        notes: "Also works in tech industry",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      }
    ],

    // Children array
    children: [
      {
        id: "child_1",
        tenant_id: "tenant_123",
        person_id: id,
        first_name: "Emma",
        last_name: "Chen",
        middle_name: "Rose",
        date_of_birth: "2016-04-10",
        gender_id: "female",
        is_dependent: true,
        notes: "Attends international school in Barcelona",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        id: "child_2",
        tenant_id: "tenant_123",
        person_id: id,
        first_name: "Lucas",
        last_name: "Chen",
        middle_name: "James",
        date_of_birth: "2019-11-15",
        gender_id: "male",
        is_dependent: true,
        notes: "Enjoys soccer and art classes",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      }
    ],

    // Emergency contacts array
    emergency_contacts: [
      {
        id: "emergency_1",
        tenant_id: "tenant_123",
        owner_id: id,
        title: "Mrs.",
        first_name: "Jennifer",
        middle_names: "Marie",
        last_name: "Chen",
        preferred_name: "Jen",
        relationship: "Spouse",
        contact_id: "contact_emergency_1",
        address_id: "addr_current",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      }
    ],

    // Languages detail array
    languages_detail: [
      {
        id: "lang_1",
        tenant_id: "tenant_123",
        person_id: id,
        language_id: "en",
        proficiency: "native",
        is_primary: true,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        id: "lang_2",
        tenant_id: "tenant_123",
        person_id: id,
        language_id: "zh",
        proficiency: "professional",
        is_primary: false,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        id: "lang_3",
        tenant_id: "tenant_123",
        person_id: id,
        language_id: "es",
        proficiency: "conversational",
        is_primary: false,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      }
    ],

    // Permits/Visas array
    permits_visas: [
      {
        id: "visa_1",
        tenant_id: "tenant_123",
        person_id: id,
        case_id: "case_123",
        permit_type: "EU Blue Card",
        country_id: "ES",
        state_id: null,
        permit_application_date: "2021-10-01",
        permit_granted_date: "2021-12-15",
        permit_number: "ESP-BC-2021-123456",
        permit_start_date: "2022-01-01",
        permit_expiry_date: "2025-12-31",
        issued_by: "Spanish Immigration Office",
        status: "active",
        permit_conditions: "Authorized to work in EU countries",
        work_eligibility_status: "authorized",
        notes: "Renewable for additional 2 years",
        created_at: "2021-12-15T10:00:00Z",
        updated_at: "2021-12-15T10:00:00Z"
      }
    ],

    // Passports array
    passports: [
      {
        id: "passport_1",
        tenant_id: "tenant_123",
        person_id: id,
        passport_number: "123456789",
        issuing_country_id: "US",
        issue_date: "2020-03-15",
        expiry_date: "2030-03-14",
        is_primary: true,
        is_active: true,
        notes: "Primary US passport",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      },
      {
        id: "passport_2",
        tenant_id: "tenant_123",
        person_id: id,
        passport_number: "987654321",
        issuing_country_id: "CN",
        issue_date: "2019-08-10",
        expiry_date: "2029-08-09",
        is_primary: false,
        is_active: true,
        notes: "Chinese passport for family visits",
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2022-01-15T10:00:00Z"
      }
    ],

    // Notes array
    notes: [
      {
        id: "note_1",
        tenant_id: "tenant_123",
        person_id: id,
        case_id: "case_123",
        note_text: "Employee has requested extension of Barcelona assignment. Family is well-settled and children are thriving in local schools.",
        created_by: "hr_manager",
        created_at: "2024-01-10T14:30:00Z"
      },
      {
        id: "note_2",
        tenant_id: "tenant_123",
        person_id: id,
        case_id: null,
        note_text: "Updated emergency contact information. Spouse contact details verified.",
        created_by: "system",
        created_at: "2023-12-15T09:15:00Z"
      },
      {
        id: "note_3",
        tenant_id: "tenant_123",
        person_id: id,
        case_id: "case_456",
        note_text: "Visa renewal process initiated. All required documents submitted to Spanish authorities.",
        created_by: "immigration_specialist",
        created_at: "2023-11-20T16:45:00Z"
      }
    ]
  };
}