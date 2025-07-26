import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { NavigationSection } from "./sections/NavigationSection";
import { ProfileSection } from "./sections/ProfileSection/ProfileSection";
import { EmploymentSection } from "./sections/EmploymentSection";
import { TopNavigation } from "./sections/TopNavigation/TopNavigation";
import { ThemeToggle } from "../../components/ThemeToggle";
import { ApiConnectionStatus } from "../../components/ui/api-connection-status";
import { usePersonData } from "../../hooks/usePersonData";
import { ChevronLeftIcon } from "lucide-react";

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
  
  // Use the new hook for person data with metadata support
  const {
    profile,
    metadata,
    isLoading: loading,
    error,
    updateProfile,
    getFieldLabel
  } = usePersonData({ 
    personId, 
    languageCode: 'en',
    autoRefresh: false 
  });

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
    <div className="flex flex-col min-h-screen bg-[#1D252D]">
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
        <div className="flex flex-col w-[72px] items-start gap-4 relative self-stretch border-r border-[#40505C] bg-[#252E38]">
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
                    icon.active ? "bg-[#1D252D]" : "hover:bg-[#2A3440]"
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
        <div className="flex flex-col h-[72px] items-center justify-center gap-4 relative self-stretch w-full border-t border-[#40505C]">
          <Button
            size="icon"
            className="inline-flex flex-col items-center justify-center p-2 bg-[#732cec] rounded-md hover:bg-[#5a23b8]"
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
          onProfileUpdate={updateProfile}
        />
        
        {/* API Connection Status for new persons */}
        {(!personId || personId === 'new') && (
          <div className="w-80 p-6">
            <ApiConnectionStatus 
              autoTest={true}
              showDetails={true}
              className="mb-6"
            />
          </div>
        )}

        {/* Render the appropriate section based on activeProfileSection */}
        {activeProfileSection === "work" ? (
          <EmploymentSection 
            personId={profile?.id || ""}
            onSuccess={(message) => {
              // Handle success notification - could add toast here
              console.log('Employment operation successful:', message);
            }}
            onError={(error) => {
              // Handle error notification - could add toast here  
              console.error('Employment operation failed:', error);
            }}
          />
        ) : (
          <ProfileSection 
            activeSection={activeProfileSection} 
            profile={profile}
            onProfileUpdate={updateProfile}
            metadata={metadata}
            getFieldLabel={getFieldLabel}
          />
        )}
      </div>
    </div>
  );
};