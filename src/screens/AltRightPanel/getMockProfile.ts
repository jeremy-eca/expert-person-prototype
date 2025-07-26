import { PersonProfile, LanguageSkill } from '../../types/frontend.types';
import { PersonComposite } from '../../types/api.types';
import { EmploymentRecord } from '../../types/frontend.types';

// Mock profile data for development fallback
export function getMockProfile(id: string): PersonProfile {
  // Generate comprehensive mock employment records
  const mockEmploymentRecords: EmploymentRecord[] = [
    // Current Primary Position
    {
      id: "emp_001",
      personId: id,
      jobTitle: "Senior Software Engineer",
      jobFunction: "Software Development",
      department: "Engineering",
      employerName: "TechCorp International",
      employmentType: "Full-time",
      jobGrade: "Senior Level",
      roleDescription: "Lead development of cloud-native applications using React, Node.js, and AWS. Mentor junior developers and collaborate with product teams to deliver scalable solutions. Responsible for architecture decisions and code reviews.",
      employerLocation: "Barcelona, Spain",
      startDate: "2022-01-15",
      endDate: undefined,
      isActive: true,
      isSecondaryContract: false,
      managers: [
        { id: "mgr_001", name: "Sarah Johnson", email: "sarah.johnson@techcorp.com" },
        { id: "mgr_002", name: "David Chen", email: "david.chen@techcorp.com" }
      ],
      employeeReferences: ["EMP-2022-001", "TECH-SEN-001"],
      createdAt: "2022-01-15T09:00:00Z",
      updatedAt: "2024-01-10T14:30:00Z"
    },
    // Secondary Active Contract (Consulting)
    {
      id: "emp_002",
      personId: id,
      jobTitle: "Technical Consultant",
      jobFunction: "Consulting",
      department: "Professional Services",
      employerName: "Innovation Labs Ltd",
      employmentType: "Part-time",
      jobGrade: "Consultant",
      roleDescription: "Provide technical expertise for digital transformation projects. Conduct architecture reviews and technology assessments for enterprise clients.",
      employerLocation: "Remote",
      startDate: "2023-06-01",
      endDate: undefined,
      isActive: true,
      isSecondaryContract: true,
      managers: [
        { id: "mgr_003", name: "Maria Rodriguez", email: "maria.rodriguez@innovationlabs.com" }
      ],
      employeeReferences: ["CONS-2023-001"],
      createdAt: "2023-06-01T10:00:00Z",
      updatedAt: "2023-06-01T10:00:00Z"
    },
    // Previous Position - London
    {
      id: "emp_003",
      personId: id,
      jobTitle: "Software Engineer",
      jobFunction: "Software Development",
      department: "Product Development",
      employerName: "TechCorp International",
      employmentType: "Full-time",
      jobGrade: "Mid Level",
      roleDescription: "Developed microservices architecture for e-commerce platform. Implemented CI/CD pipelines and automated testing frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.",
      employerLocation: "London, United Kingdom",
      startDate: "2019-06-01",
      endDate: "2021-12-31",
      isActive: false,
      isSecondaryContract: false,
      managers: [
        { id: "mgr_004", name: "James Wilson", email: "james.wilson@techcorp.com" }
      ],
      employeeReferences: ["EMP-2019-003", "PROD-DEV-001"],
      createdAt: "2019-06-01T09:00:00Z",
      updatedAt: "2021-12-31T17:00:00Z"
    },
    // Early Career Position - San Francisco
    {
      id: "emp_004",
      personId: id,
      jobTitle: "Junior Developer",
      jobFunction: "Software Development",
      department: "Engineering",
      employerName: "StartupTech Inc",
      employmentType: "Full-time",
      jobGrade: "Junior Level",
      roleDescription: "Built responsive web applications using React and Express.js. Participated in agile development processes and learned modern software development practices. Contributed to open-source projects and internal tools.",
      employerLocation: "San Francisco, CA, USA",
      startDate: "2017-09-01",
      endDate: "2019-05-15",
      isActive: false,
      isSecondaryContract: false,
      managers: [
        { id: "mgr_005", name: "Alex Thompson", email: "alex.thompson@startuptech.com" }
      ],
      employeeReferences: ["STARTUP-2017-001"],
      createdAt: "2017-09-01T09:00:00Z",
      updatedAt: "2019-05-15T17:00:00Z"
    },
    // Internship
    {
      id: "emp_005",
      personId: id,
      jobTitle: "Software Engineering Intern",
      jobFunction: "Software Development",
      department: "Engineering",
      employerName: "BigTech Corp",
      employmentType: "Internship",
      jobGrade: "Intern",
      roleDescription: "Developed internal tools and automation scripts. Learned software engineering best practices and worked on real-world projects under mentorship of senior engineers.",
      employerLocation: "Mountain View, CA, USA",
      startDate: "2017-06-01",
      endDate: "2017-08-31",
      isActive: false,
      isSecondaryContract: false,
      managers: [
        { id: "mgr_006", name: "Jennifer Lee", email: "jennifer.lee@bigtech.com" }
      ],
      employeeReferences: ["INTERN-2017-001"],
      createdAt: "2017-06-01T09:00:00Z",
      updatedAt: "2017-08-31T17:00:00Z"
    }
  ];
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
    languages: [
      {
        id: "lang_1",
        language: "English",
        proficiency: "Native",
        isPrimary: true,
        dateAdded: "2022-01-15"
      },
      {
        id: "lang_2", 
        language: "Mandarin",
        proficiency: "Professional",
        isPrimary: false,
        dateAdded: "2022-01-15"
      },
      {
        id: "lang_3",
        language: "Spanish", 
        proficiency: "Conversational",
        isPrimary: false,
        dateAdded: "2023-03-10"
      }
    ],
    
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
    
    // Work & Employment Section - using new structure
    employmentRecords: mockEmploymentRecords,
    
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
        type: "Employment Record Updated",
        timestamp: "2024-01-10T14:30:00Z",
        user: "System",
        description: "Updated role description for Senior Software Engineer position"
      },
      {
        id: "2",
        type: "Employment Record Created",
        timestamp: "2023-06-01T10:00:00Z",
        user: "HR Manager",
        description: "Added secondary contract: Technical Consultant at Innovation Labs Ltd"
      },
      {
        id: "3",
        type: "Employment Record Updated",
        timestamp: "2022-01-15T09:00:00Z",
        user: "HR Manager",
        description: "Promoted to Senior Software Engineer with salary adjustment"
      },
      {
        id: "4",
        type: "Employment Record Ended",
        timestamp: "2021-12-31T17:00:00Z",
        user: "HR Manager",
        description: "Ended employment at London office - Software Engineer position"
      },
      {
        id: "5",
        type: "Employment Record Created",
        timestamp: "2019-06-01T09:00:00Z",
        user: "HR Manager",
        description: "Started as Software Engineer in Product Development, London"
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
        id: "emp_001",
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
        role_description: "Lead development of cloud-native applications using React, Node.js, and AWS. Mentor junior developers and collaborate with product teams to deliver scalable solutions.",
        employer_location: "Barcelona, Spain",
        managers: [
          {
            id: "mgr_1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com"
          },
          {
            id: "mgr_2",
            name: "David Chen",
            email: "david.chen@company.com"
          }
        ],
        is_active: true,
        created_at: "2022-01-15T10:00:00Z",
        updated_at: "2024-01-10T14:30:00Z"
      },
      {
        id: "emp_002",
        person_id: id,
        tenant_id: "tenant_123",
        employment_start_date: "2023-06-01",
        employment_end_date: null,
        job_title: "Technical Consultant",
        department: "Professional Services",
        employer_name: "Innovation Labs Ltd",
        employment_type: "Part-time",
        job_grade: "Consultant",
        job_function: "Consulting",
        role_description: "Provide technical expertise for digital transformation projects. Conduct architecture reviews and technology assessments.",
        employer_location: "Remote",
        managers: [
          {
            id: "mgr_3",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@innovationlabs.com"
          }
        ],
        is_active: true,
        created_at: "2023-06-01T10:00:00Z",
        updated_at: "2023-06-01T10:00:00Z"
      },
      {
        id: "emp_003",
        person_id: id,
        tenant_id: "tenant_123",
        employment_start_date: "2019-06-01",
        employment_end_date: "2021-12-31",
        job_title: "Software Engineer",
        department: "Product Development",
        employer_name: "TechCorp International",
        employment_type: "Full-time",
        job_grade: "Mid Level",
        job_function: "Software Development",
        role_description: "Developed microservices architecture for e-commerce platform. Implemented CI/CD pipelines and automated testing frameworks.",
        employer_location: "London, UK",
        managers: [
          {
            id: "mgr_4",
            name: "James Wilson",
            email: "james.wilson@company.com"
          }
        ],
        is_active: false,
        created_at: "2019-06-01T10:00:00Z",
        updated_at: "2021-12-31T10:00:00Z"
      },
      {
        id: "emp_004",
        person_id: id,
        tenant_id: "tenant_123",
        employment_start_date: "2017-09-01",
        employment_end_date: "2019-05-15",
        job_title: "Junior Developer",
        department: "Engineering",
        employer_name: "StartupTech Inc",
        employment_type: "Full-time",
        job_grade: "Junior Level",
        job_function: "Software Development",
        role_description: "Built responsive web applications using React and Express.js. Participated in agile development processes.",
        employer_location: "San Francisco, CA, USA",
        managers: [
          {
            id: "mgr_5",
            name: "Alex Thompson",
            email: "alex.thompson@startuptech.com"
          }
        ],
        is_active: false,
        created_at: "2017-09-01T10:00:00Z",
        updated_at: "2019-05-15T10:00:00Z"
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