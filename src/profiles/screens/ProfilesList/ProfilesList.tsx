import React from "react";
import { BellIcon, SettingsIcon, PlusIcon } from "lucide-react";
import { SideNavigation, MenuItem } from "../../../shared/components/layout/SideNavigation";
import { TopBar, BreadcrumbItem, TopBarAction } from "../../../shared/components/layout/TopBar";
import { ProfilesListFormDark } from "../../components/ProfilesListFormDark";

interface ProfilesListProps {
  onPersonSelect: (personId: string | null) => void;
  onCreatePerson?: () => void;
}

export const ProfilesList = ({ onPersonSelect, onCreatePerson }: ProfilesListProps): JSX.Element => {
  // Navigation menu items
  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: "/iconset-03.svg",
      isActive: false,
    },
    {
      name: "Workspaces",
      icon: "/iconset-04.svg",
      isActive: false,
      hasShadow: true,
    },
    {
      name: "Moves",
      icon: "/iconset-02.png",
      isActive: false,
      hasDropdown: true,
    },
    {
      name: "Talent",
      icon: "/iconset-01-1.svg",
      isActive: true,
    },
    {
      name: "Discovery",
      icon: "/iconset-01-2.svg",
      isActive: false,
    },
  ];

  // Bottom action configuration
  const bottomAction = {
    icon: "/vector.svg",
    secondaryIcon: "/vector-1.svg",
    iconAlt: "Vector",
    secondaryIconAlt: "Vector",
  };

  // Toggle button configuration
  const toggleButton = {
    icon: "/iconset-01.svg",
    iconAlt: "Toggle",
    position: { top: "886px", left: "280px" }
  };

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Moves", href: "#" },
    { label: "People", href: "#" },
  ];

  // Top bar actions - removed API status indicator, updated for dark theme
  const topBarActions: TopBarAction[] = [
    {
      type: 'button',
      label: 'New Person',
      icon: <PlusIcon className="w-4 h-4" />,
      onClick: onCreatePerson,
      className: 'bg-[#3B82F6] hover:bg-[#2563EB] text-white border-0 px-4 py-2 rounded-lg transition-colors duration-200',
    },
    {
      type: 'icon',
      icon: <SettingsIcon className="w-5 h-5" />,
      variant: 'ghost',
      className: 'text-[#9CA3AF] hover:text-white hover:bg-[#374151] rounded-lg p-2 transition-colors duration-200',
    },
    {
      type: 'icon',
      icon: <BellIcon className="w-5 h-5" />,
      variant: 'ghost',
      className: 'text-[#9CA3AF] hover:text-white hover:bg-[#374151] rounded-lg p-2 transition-colors duration-200',
    },
    {
      type: 'button',
      label: 'Ask AI',
      variant: 'secondary',
      className: 'h-10 gap-2.5 px-3 py-1.5 bg-[#4C1D95] hover:bg-[#5B21B6] text-white rounded-lg transition-colors duration-200',
      icon: <div className="relative w-4 h-4 bg-[url(/fi-rr-confetti.svg)] bg-[100%_100%]" />,
    },
    {
      type: 'avatar',
      avatar: {
        initials: 'GM',
        bgColor: '#10B981'
      }
    },
  ];

  const handleMenuItemClick = (item: MenuItem, index: number) => {
    console.log(`Clicked on ${item.name} (index: ${index})`);
    // Handle navigation logic here
  };

  return (
    <main className="flex min-h-screen w-full bg-[#0F1419]">
      <SideNavigation
        menuItems={menuItems}
        bottomAction={bottomAction}
        toggleButton={toggleButton}
        onMenuItemClick={handleMenuItemClick}
        className="bg-[#1A1F2E] border-r border-[#2A2F3A]"
      />
      <div className="flex-1 flex flex-col">
        <div className="gap-8 p-6 flex flex-col items-start relative bg-[#0F1419]">
          <TopBar 
            breadcrumbs={breadcrumbs}
            actions={topBarActions}
            className="bg-[#252935] rounded-lg p-4"
          />
          <ProfilesListFormDark 
            onPersonSelect={onPersonSelect}
            onCreatePerson={onCreatePerson}
            className="w-full"
          />
        </div>
      </div>
    </main>
  );
};
