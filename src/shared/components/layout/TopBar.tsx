import {
  BellIcon,
  ChevronRightIcon,
  SettingsIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface TopBarAction {
  type: 'button' | 'icon' | 'status' | 'avatar';
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'ghost' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  // For status indicators
  status?: {
    color: string;
    text: string;
    bgColor?: string;
    borderColor?: string;
  };
  // For avatar
  avatar?: {
    initials?: string;
    src?: string;
    alt?: string;
    bgColor?: string;
  };
}

export interface TopBarProps {
  breadcrumbs: BreadcrumbItem[];
  actions: TopBarAction[];
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumbs = [],
  actions = [],
  className = "",
}) => {
  const renderAction = (action: TopBarAction, index: number) => {
    switch (action.type) {
      case 'status':
        return (
          <div 
            key={index}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${action.className || 'bg-green-50 border border-green-200'}`}
          >
            <div 
              className={`w-2 h-2 rounded-full`}
              style={{ backgroundColor: action.status?.color || '#10B981' }}
            />
            <span className={`text-xs font-medium ${action.status?.color ? 'text-green-800' : ''}`}>
              {action.status?.text || action.label}
            </span>
          </div>
        );
        
      case 'avatar':
        return (
          <Avatar 
            key={index}
            className={`w-10 h-10 rounded-[100px] ${action.className || ''}`}
            style={{ backgroundColor: action.avatar?.bgColor || '#00ceba' }}
            onClick={action.onClick}
          >
            {action.avatar?.src ? (
              <AvatarImage src={action.avatar.src} alt={action.avatar.alt || 'User'} />
            ) : (
              <AvatarFallback className="font-extrabold text-white text-sm tracking-[0.28px]">
                {action.avatar?.initials || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
        );
        
      case 'icon':
        return (
          <Button
            key={index}
            variant={action.variant || "ghost"}
            size="icon"
            className={`w-10 h-10 rounded-md ${action.className || ''}`}
            onClick={action.onClick}
          >
            {action.icon}
          </Button>
        );
        
      case 'button':
      default:
        return (
          <Button
            key={index}
            variant={action.variant || "default"}
            className={`gap-2 ${action.className || ''}`}
            onClick={action.onClick}
          >
            {action.icon}
            {action.label}
          </Button>
        );
    }
  };

  return (
    <header className={`flex items-center gap-2.5 relative w-full flex-[0_0_auto] ${className}`}>
      {/* Breadcrumbs section */}
      <div className="flex w-[369px] items-center gap-1 px-1 py-0 relative">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={crumb.href || "#"}
                    onClick={crumb.onClick}
                    className="font-medium text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRightIcon className="w-3 h-3 text-[#6B7280]" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative w-[68px] h-[17px]" />
      </div>

      {/* Actions section */}
      <div className="flex items-center justify-end gap-8 relative flex-1 grow">
        {actions.map((action, index) => renderAction(action, index))}
      </div>
    </header>
  );
};