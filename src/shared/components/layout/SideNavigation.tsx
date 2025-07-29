import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export interface MenuItem {
  name: string;
  icon: string;
  isActive?: boolean;
  hasShadow?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
}

export interface BottomAction {
  icon: string;
  iconAlt?: string;
  secondaryIcon?: string;
  secondaryIconAlt?: string;
  onClick?: () => void;
}

export interface SideNavigationProps {
  logoSrc?: string;
  logoAlt?: string;
  menuItems: MenuItem[];
  bottomAction?: BottomAction;
  toggleButton?: {
    icon: string;
    iconAlt?: string;
    position?: { top?: string; left?: string };
  };
  className?: string;
  onMenuItemClick?: (item: MenuItem, index: number) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  logoSrc = "/top.svg",
  logoAlt = "Top",
  menuItems = [],
  bottomAction,
  toggleButton,
  className = "",
  onMenuItemClick,
}) => {
  const handleMenuItemClick = (item: MenuItem, index: number) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onMenuItemClick) {
      onMenuItemClick(item, index);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Top logo section */}
      <img className="w-full" alt={logoAlt} src={logoSrc} />

      {/* Navigation menu */}
      <div className="flex flex-col gap-3 px-4 py-0 flex-1">
        <NavigationMenu orientation="vertical" className="w-full max-w-none">
          <NavigationMenuList className="flex flex-col w-full space-y-3">
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index} className="w-full">
                <NavigationMenuLink
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-md w-full cursor-pointer transition-all duration-200 ${
                    item.isActive 
                      ? "bg-[#3B82F6] text-white shadow-lg" 
                      : "bg-transparent text-[#9CA3AF] hover:bg-[#374151] hover:text-white"
                  } ${item.hasShadow ? "shadow-[0px_4px_8px_rgba(0,0,0,0.3)]" : ""}`}
                  asChild
                >
                  <button
                    type="button"
                    onClick={() => handleMenuItemClick(item, index)}
                    className="w-full text-left"
                  >
                    <img
                      className="w-4 h-4 filter brightness-0 invert opacity-75"
                      alt={`${item.name} icon`}
                      src={item.icon}
                    />
                    <span className="flex-1 font-medium text-sm tracking-wide">
                      {item.name}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDownIcon className="w-4 h-4 opacity-75" />
                    )}
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Bottom section with button */}
      {bottomAction && (
        <div className="w-full">
          <div className="flex items-center justify-start p-4 border-t border-[#374151]">
            <Button 
              className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-md transition-colors duration-200"
              onClick={bottomAction.onClick}
            >
              <div className="relative w-[16.83px] h-4 overflow-hidden">
                <div className="relative w-[17px] h-4">
                  {bottomAction.secondaryIcon && (
                    <img
                      className="absolute w-[17px] h-[9px] top-[7px] left-0"
                      alt={bottomAction.iconAlt || "Vector"}
                      src={bottomAction.icon}
                    />
                  )}
                  <img
                    className={`absolute w-[17px] h-[9px] ${bottomAction.secondaryIcon ? 'top-0' : 'top-1/2 transform -translate-y-1/2'} left-0`}
                    alt={bottomAction.secondaryIconAlt || "Vector"}
                    src={bottomAction.secondaryIcon || bottomAction.icon}
                  />
                </div>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button (positioned absolutely if provided) */}
      {toggleButton && (
        <div 
          className="inline-flex items-center justify-center gap-2.5 absolute bg-[#1A1F2E] rounded-sm"
          style={{
            top: toggleButton.position?.top || '886px',
            left: toggleButton.position?.left || '280px'
          }}
        >
          <img 
            className="w-6 h-6 filter brightness-0 invert opacity-75" 
            alt={toggleButton.iconAlt || "Toggle"} 
            src={toggleButton.icon} 
          />
        </div>
      )}
    </div>
  );
};