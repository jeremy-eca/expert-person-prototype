import { ChevronLeftIcon, FileTextIcon, FlagIcon, FolderCogIcon, MapPinIcon, MessageSquareIcon, MoveIcon, PanelLeftOpenIcon, BaselineIcon as TimelineIcon, UserIcon } from "lucide-react";
import React from "react";
import { ProfileSectionType } from "../../AltRightPanel";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { CameraIcon } from "lucide-react";

import { PersonProfile } from "../../../../types/frontend.types";

interface NavigationSectionProps {
  activeSection: ProfileSectionType;
  onSectionChange: (section: ProfileSectionType) => void;
  profile?: PersonProfile | null;
  onProfileUpdate?: (profile: PersonProfile) => void;
}

export const NavigationSection = ({ 
  activeSection, 
  onSectionChange,
  profile,
  onProfileUpdate
}: NavigationSectionProps): JSX.Element => {
  const [isEditingPhoto, setIsEditingPhoto] = React.useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile && onProfileUpdate) {
      const photoUrl = URL.createObjectURL(file);
      onProfileUpdate({
        ...profile,
        avatarUrl: photoUrl
      });
      setIsEditingPhoto(false);
    }
  };

  // Navigation menu items data
  const navigationItems = [
    {
      id: "details" as ProfileSectionType,
      icon: <UserIcon className="h-4 w-4" />,
      label: "Details",
      alt: "User details",
    },
    {
      id: "location" as ProfileSectionType,
      icon: <MapPinIcon className="h-4 w-4" />,
      label: "Location",
      alt: "Map pin",
    },
    {
      id: "work" as ProfileSectionType,
      icon: <FlagIcon className="h-4 w-4" />,
      label: "Work & Employment",
      alt: "Work details",
    },
    {
      id: "contact" as ProfileSectionType,
      icon: <UserIcon className="h-4 w-4" />,
      label: "Contact",
      alt: "Contact information",
    },
    {
      id: "family" as ProfileSectionType,
      icon: <UserIcon className="h-4 w-4" />,
      label: "Family",
      alt: "Family information",
    },
    {
      id: "legal" as ProfileSectionType,
      icon: <FolderCogIcon className="h-4 w-4" />,
      label: "Legal & Compliance",
      alt: "Legal documents",
    },
    {
      id: "moves" as ProfileSectionType,
      icon: <MoveIcon className="h-4 w-4" />,
      label: "Moves",
      alt: "Employee moves and assignments",
    },
    {
      id: "documents" as ProfileSectionType,
      icon: <FileTextIcon className="h-4 w-4" />,
      label: "Documents",
      alt: "Document management",
    },
    {
      id: "communication" as ProfileSectionType,
      icon: <MessageSquareIcon className="h-4 w-4" />,
      label: "Communication",
      alt: "Communication history",
    },
    {
      id: "activity" as ProfileSectionType,
      icon: <TimelineIcon className="h-4 w-4" />,
      label: "Activity",
      alt: "Profile activity timeline",
    },
  ];

  return (
    <aside className="flex flex-col w-[220px] items-start gap-4 self-stretch border-r bg-[#252E38] border-r-[#40505C]">
      {/* Header with Talent button */}
      <div className="flex flex-col items-start justify-center p-4 w-full">
        <Button
          variant="outline"
          className="flex items-center gap-4 px-3 py-2.5 bg-[#1D252D] border-[#40505C] text-white hover:bg-[#2A3440] rounded-md w-full justify-start"
        >
          <div className="flex items-center gap-3">
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="font-label-sm-lighter text-white tracking-[var(--label-sm-lighter-letter-spacing)] leading-[var(--label-sm-lighter-line-height)] font-[number:var(--label-sm-lighter-font-weight)] text-[length:var(--label-sm-lighter-font-size)]">
              Talent
            </span>
          </div>
        </Button>
      </div>

      {/* Profile and Navigation Section */}
      <div className="flex flex-col items-start gap-6 px-4 py-0 flex-1 w-full">
        {/* Profile Card */}
        <div className="flex flex-col items-center gap-3 w-full rounded-lg overflow-hidden">
          <div className="relative">
            <Avatar className="w-[108px] h-[108px]">
              {profile?.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={profile?.name || "Profile"} />
              ) : (
                <AvatarFallback className="text-2xl font-bold">{profile?.initials || "??"}</AvatarFallback>
              )}
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#732cec] hover:bg-[#5a23b8] p-0"
              onClick={() => setIsEditingPhoto(true)}
            >
              <CameraIcon className="w-4 h-4" />
            </Button>
            {isEditingPhoto && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <h3 className="w-full mt-[-1.00px] font-label-md-heavier font-[number:var(--label-md-heavier-font-weight)] text-white text-[length:var(--label-md-heavier-font-size)] text-center tracking-[var(--label-md-heavier-letter-spacing)] leading-[var(--label-md-heavier-line-height)]">
              {profile?.name || "Loading..."}
            </h3>

            <Badge
              variant="outline"
              className="bg-[#1D252D] text-gray-300 border-[#40505C] px-3 py-1 font-label-xs-lighter font-[number:var(--label-xs-lighter-font-weight)] text-[length:var(--label-xs-lighter-font-size)] tracking-[var(--label-xs-lighter-letter-spacing)] leading-[var(--label-xs-lighter-line-height)]"
            >
              Employee ID: #{profile?.id?.substring(0, 6) || "------"}
            </Badge>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 w-full">
              {profile?.isVIP && (
                <Badge className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium">
                  VIP
                </Badge>
              )}
              {profile?.hasOutstandingTasks && (
                <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium animate-pulse">
                  Tasks Pending!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col items-start gap-2 w-full">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={`flex h-[42px] items-start justify-start gap-3 p-3 w-full rounded-md transition-colors ${
                activeSection === item.id ? "bg-[#1D252D] text-white" : "text-gray-300 hover:bg-[#2A3440] hover:text-white"
              }`}
            >
              {item.icon}
              <span
                className={`flex-1 text-sm tracking-[0.28px] leading-4 text-left transition-colors ${
                  activeSection === item.id
                    ? "text-white font-medium"
                    : "text-gray-300 font-normal"
                }`}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Panel toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-[898px] left-52 bg-[#1D252D] text-white hover:bg-[#2A3440] rounded-[3px] p-0 h-6 w-6"
      >
        <PanelLeftOpenIcon className="h-6 w-6" />
      </Button>
    </aside>
  );
};
