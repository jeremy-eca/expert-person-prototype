import { PersonProfile } from '../../types/frontend.types';

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