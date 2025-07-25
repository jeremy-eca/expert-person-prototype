import React from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

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
    <div className="flex items-center h-14 px-6 border-b border-border bg-background">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href={item.href} 
                  className={`font-label-sm-mid ${
                    item.active 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};