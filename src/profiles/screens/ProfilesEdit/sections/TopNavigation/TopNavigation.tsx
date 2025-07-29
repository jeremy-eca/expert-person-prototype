import React from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../../shared/components/ui/breadcrumb";

interface TopNavigationProps {
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
}

export const TopNavigation = ({ 
  breadcrumbItems = [
    { label: "Moves", href: "#" },
    { label: "Cases", href: "#" },
    { label: "Case Label", active: true }
  ]
}: TopNavigationProps): JSX.Element => {
  return (
    <div className="flex items-center h-14 px-6 border-b border-[#40505C] bg-[#252E38]">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href={item.href} 
                  className={`font-label-sm-mid transition-colors ${
                    item.active 
                      ? "text-white font-medium" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};