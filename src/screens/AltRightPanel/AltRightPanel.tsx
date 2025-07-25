import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { NavigationSection } from "./sections/NavigationSection";
import { ProfileSection } from "./sections/ProfileSection/ProfileSection";
import { TopNavigation } from "./sections/TopNavigation/TopNavigation";
import { ThemeToggle } from "../../components/ThemeToggle";
import { personService } from "../../services/api/personService";
import { mapPersonToProfile } from "../../services/mappers/personMapper";
import { PersonProfile } from "../../types/frontend.types";
import { ChevronLeftIcon } from "lucide-react";
import { getMockProfile } from "./getMockProfile";

export type ProfileSectionType = 
  | "details" 
  | "location" 
  | "work" 
  | "contact" 
  | "family" 
  | "legal"
  | "moves"
  | "documents"
  | "communication"
  | "activity";

interface AltRightPanelProps {
  personId: string | null;
  onBack: () => void;
}

export const AltRightPanel = ({ personId, onBack }: AltRightPanelProps): JSX.Element => {
  const [activeProfileSection, setActiveProfileSection] = useState<ProfileSectionType>("details");
  const [profile, setProfile] = useState<PersonProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!personId) {
        // Create empty profile for new person
        setProfile({
          id: 'new',
          name: 'New Person',
          initials: 'NP',
          isVIP: false,
          hasOutstandingTasks: false,
          // Initialize with empty values for all required fields
          dateOfBirth: undefined,
          nationality: undefined,
          languages: [],
          currentLocation: undefined,
          permanentHome: undefined,
          locationHistory: [],
          currentPosition: undefined,
          employmentHistory: [],
          contact: {
            workEmail: '',
            workPhone: '',
            personalEmail: undefined,
            mobilePhone: undefined
          },
          emergencyContact: undefined,
          contactHistory: [],
          familySummary: {
            maritalStatus: 'Single',
            totalDependents: 0,
            passportsHeld: 0
          },
          familyMembers: [],
          workAuthorization: undefined,
          complianceDocuments: [],
          moves: [],
          documents: [],
          communications: [],
          activities: []
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch person with all related data
        const person = await personService.getPersonWithAllData(personId);
        const mappedProfile = mapPersonToProfile(person);
        setProfile(mappedProfile);
      } catch (err) {
        console.error('Failed to fetch person:', err);
        setError('Failed to load person details.');
        
        // Fallback to mock data for development
        setProfile(getMockProfile(personId));
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [personId]);

  // Navigation icons data for mapping
  const navigationIcons = [
    { src: "/iconset-03.svg", alt: "Dashboard", active: false, action: "dashboard" },
    { src: "/iconset-04.svg", alt: "Reports", active: false, action: "reports" },
    { src: "/iconset-02.svg", alt: "Settings", active: false, action: "settings" },
    { src: "/iconset-01-1.svg", alt: "People", active: true, action: "people" },
    { src: "/iconset-01.svg", alt: "Help", active: false, action: "help" },
  ];

  const handleSidebarNavigation = (action: string) => {
    // Handle sidebar navigation
    console.log(`Navigating to: ${action}`);
    // For now, only "people" action is functional
    if (action === "people") {
      // Already on people/person view
      return;
    }
    // Future: Add navigation to other sections
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading person details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Please select a person from the list'}</p>
        <Button onClick={onBack}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <TopNavigation />
      
      {/* Main Content Area */}
      <div className="flex flex-1 items-start relative">
        {/* Back button and API status */}
        <div className="absolute top-4 left-20 z-10 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to List
          </Button>
          {!personId && (
            <span className="text-sm font-medium text-primary">
              Creating New Person
            </span>
          )}
          {personId && personId !== 'new' && (
            <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-xs text-green-800">
                ✅ Connected to API • Real-time editing enabled
              </span>
            </div>
          )}
        </div>
        
        {/* Left sidebar navigation */}
        <div className="flex flex-col w-[72px] items-start gap-4 relative self-stretch border-r border-border bg-card">
        {/* Top logo */}
        <img
          className="relative self-stretch w-full flex-[0_0_auto]"
          alt="Top"
          src="/top.svg"
        />

        <div className="flex flex-col items-start justify-between px-4 py-0 relative flex-1 self-stretch w-full">
          {/* Navigation icons */}
          <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
            <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
              {navigationIcons.map((icon, index) => (
                <Button
                  key={`nav-icon-${index}`}
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-full rounded-md flex items-center justify-center ${
                    icon.active ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => handleSidebarNavigation(icon.action)}
                  title={icon.alt}
                >
                  <img
                    className="relative w-4 h-4"
                    alt={icon.alt}
                    src={icon.src}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Theme toggle button */}
          <div className="flex items-center justify-center w-full">
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom section with purple button */}
        <div className="flex flex-col h-[72px] items-center justify-center gap-4 relative self-stretch w-full border-t border-border">
          <Button
            size="icon"
            className="inline-flex flex-col items-center justify-center p-2 bg-primary rounded-md hover:bg-primary/90"
          >
            <div className="relative w-[16.83px] h-4 overflow-hidden">
              <div className="relative w-[17px] h-4">
                <img
                  className="absolute w-[17px] h-[9px] top-[7px] left-0"
                  alt="Vector"
                  src="/vector.svg"
                />
                <img
                  className="absolute w-[17px] h-[9px] top-0 left-0"
                  alt="Vector"
                  src="/vector-1.svg"
                />
              </div>
            </div>
          </Button>
        </div>
      </div>

        {/* Main content sections */}
        <NavigationSection 
          activeSection={activeProfileSection}
          onSectionChange={setActiveProfileSection}
          profile={profile}
        />
        <ProfileSection 
          activeSection={activeProfileSection} 
          profile={profile}
          onProfileUpdate={setProfile}
        />
      </div>
    </div>
  );
};