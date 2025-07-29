import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../../shared/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../../shared/components/ui/navigation-menu";

export const NavigationMenuSection = (): JSX.Element => {
  // Navigation menu items data
  const menuItems = [
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

  return (
    <div className="flex flex-col h-full border-r border-[#c8d3de] bg-[#f7fbfe]">
      {/* Top logo section */}
      <img className="w-full" alt="Top" src="/top.svg" />

      {/* Navigation menu */}
      <div className="flex flex-col gap-3 px-4 py-0 flex-1">
        <NavigationMenu orientation="vertical" className="w-full max-w-none">
          <NavigationMenuList className="flex flex-col w-full space-y-3">
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index} className="w-full">
                <NavigationMenuLink
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-md w-full ${
                    item.isActive ? "bg-[#dff1f8]" : "bg-[#f7fbfe]"
                  } ${item.hasShadow ? "shadow-[0px_4px_4px_#00000040]" : ""}`}
                  asChild
                >
                  <a href="#">
                    <img
                      className="w-4 h-4"
                      alt={`${item.name} icon`}
                      src={item.icon}
                    />
                    <span className="flex-1 mt-[-1.00px] font-label-sm-lighter text-[#1d252d] text-[length:var(--label-sm-lighter-font-size)] tracking-[var(--label-sm-lighter-letter-spacing)] leading-[var(--label-sm-lighter-line-height)]">
                      {item.name}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Bottom section with button */}
      <div className="w-full">
        <div className="flex items-center justify-start p-4 border-t border-[#d9e3ec]">
          <Button className="p-2 bg-[#732cec] rounded-md">
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

      {/* Toggle button (positioned absolutely in the original, but we'll keep it for reference) */}
      <div className="inline-flex items-center justify-center gap-2.5 absolute top-[886px] left-[280px] bg-[#f7fbfe] rounded-sm">
        <img className="w-6 h-6" alt="Iconset" src="/iconset-01.svg" />
      </div>
    </div>
  );
};
