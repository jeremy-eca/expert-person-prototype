import React, { useState, useMemo } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { EmploymentRecord, EmploymentConflict } from '../../../profiles/types/frontend.types';
import { cn } from '../../lib/utils';
import { 
  CalendarIcon, 
  MapPinIcon, 
  BuildingIcon, 
  UserIcon, 
  ClockIcon,
  EditIcon,
  EyeIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrendingUpIcon
} from 'lucide-react';

interface EmploymentTimelineProps {
  employmentRecords: EmploymentRecord[];
  onEditRecord?: (record: EmploymentRecord) => void;
  onAddRecord?: () => void;
  onViewRecord?: (record: EmploymentRecord) => void;
  onEndRecord?: (record: EmploymentRecord) => void;
  className?: string;
  showAddButton?: boolean;
}

interface TimelineEvent {
  id: string;
  type: 'start' | 'end' | 'current' | 'future';
  date: Date;
  record: EmploymentRecord;
  label: string;
  description: string;
}

export function EmploymentTimeline({
  employmentRecords,
  onEditRecord,
  onAddRecord,
  onViewRecord,
  onEndRecord,
  className,
  showAddButton = true
}: EmploymentTimelineProps) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards'>('timeline');

  // Process records into timeline events
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    const now = new Date();

    employmentRecords.forEach(record => {
      const startDate = new Date(record.startDate);
      const endDate = record.endDate ? new Date(record.endDate) : null;

      // Add start event
      events.push({
        id: `${record.id}-start`,
        type: startDate > now ? 'future' : 'start',
        date: startDate,
        record,
        label: 'Started',
        description: `${record.jobTitle || 'Position'} at ${record.employerName || 'Company'}`
      });

      // Add end event if exists
      if (endDate) {
        events.push({
          id: `${record.id}-end`,
          type: 'end',
          date: endDate,
          record,
          label: 'Ended',
          description: `Completed ${record.jobTitle || 'Position'}`
        });
      } else if (record.isActive) {
        // Add current marker for active records
        events.push({
          id: `${record.id}-current`,
          type: 'current',
          date: now,
          record,
          label: 'Current',
          description: `Currently ${record.jobTitle || 'Position'}`
        });
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [employmentRecords]);

  // Get status configuration
  const getStatusConfig = (record: EmploymentRecord) => {
    const now = new Date();
    const startDate = new Date(record.startDate);
    const endDate = record.endDate ? new Date(record.endDate) : null;

    if (startDate > now) {
      return {
        status: 'future',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-900',
        label: 'Future',
        icon: CalendarIcon
      };
    }

    if (record.isActive && !endDate) {
      return {
        status: 'active',
        color: record.isSecondaryContract ? 'bg-purple-500' : 'bg-green-500',
        bgColor: record.isSecondaryContract ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200',
        textColor: record.isSecondaryContract ? 'text-purple-900' : 'text-green-900',
        label: record.isSecondaryContract ? 'Secondary' : 'Active',
        icon: CheckCircleIcon
      };
    }

    if (endDate && endDate <= now) {
      return {
        status: 'historical',
        color: 'bg-gray-500',
        bgColor: 'bg-gray-50 border-gray-200',
        textColor: 'text-gray-900',
        label: 'Historical',
        icon: ClockIcon
      };
    }

    return {
      status: 'unknown',
      color: 'bg-gray-400',
      bgColor: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-900',
      label: 'Unknown',
      icon: XCircleIcon
    };
  };

  // Calculate employment duration
  const getEmploymentDuration = (record: EmploymentRecord) => {
    const startDate = new Date(record.startDate);
    const endDate = record.endDate ? new Date(record.endDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years === 1 ? '' : 's'}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : ''}`;
    }
  };

  // Render employment conflicts
  const renderConflicts = (conflicts: EmploymentConflict[] = []) => {
    if (conflicts.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {conflicts.map(conflict => (
          <div
            key={conflict.id}
            className={cn(
              "flex items-center gap-2 text-xs px-2 py-1 rounded",
              conflict.severity === 'error' && "bg-red-50 text-red-700 border border-red-200",
              conflict.severity === 'warning' && "bg-yellow-50 text-yellow-700 border border-yellow-200",
              conflict.severity === 'info' && "bg-blue-50 text-blue-700 border border-blue-200"
            )}
          >
            <AlertTriangleIcon className="w-3 h-3" />
            <span>{conflict.message}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render timeline view
  const renderTimelineView = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Timeline Events */}
      <div className="space-y-6">
        {timelineEvents.map((event, index) => {
          const config = getStatusConfig(event.record);
          const isSelected = selectedRecord === event.record.id;

          return (
            <div key={event.id} className="relative flex items-start gap-4">
              {/* Timeline Dot */}
              <div className={cn(
                "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-md",
                config.color
              )}>
                <config.icon className="w-5 h-5 text-white" />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md",
                    config.bgColor,
                    isSelected && "ring-2 ring-blue-500"
                  )}
                  onClick={() => setSelectedRecord(isSelected ? null : event.record.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {event.record.jobTitle || 'Position Title'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.record.employerName || 'Company Name'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn("text-xs", config.textColor, config.bgColor)}>
                        {config.label}
                      </Badge>
                      
                      {event.record.isSecondaryContract && (
                        <Badge variant="outline" className="text-xs">
                          Secondary
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {event.date.toLocaleDateString()} - {event.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{getEmploymentDuration(event.record)}</span>
                    </div>
                    
                    {event.record.employerLocation && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{event.record.employerLocation}</span>
                      </div>
                    )}
                    
                    {event.record.department && (
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="w-4 h-4" />
                        <span>{event.record.department}</span>
                      </div>
                    )}
                  </div>

                  {/* Managers */}
                  {event.record.managers && event.record.managers.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <UserIcon className="w-4 h-4" />
                        <span>Managers:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {event.record.managers.map(manager => (
                          <Badge key={manager.id} variant="outline" className="text-xs">
                            {manager.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role Description */}
                  {event.record.roleDescription && isSelected && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {event.record.roleDescription}
                      </p>
                    </div>
                  )}

                  {/* Conflicts */}
                  {renderConflicts(event.record.conflicts)}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      {event.record.employmentType && (
                        <span>{event.record.employmentType}</span>
                      )}
                      {event.record.jobGrade && (
                        <span className="ml-2">• {event.record.jobGrade}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {onViewRecord && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewRecord(event.record);
                          }}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {onEditRecord && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditRecord(event.record);
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {onEndRecord && event.record.isActive && !event.record.endDate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEndRecord(event.record);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          End
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render cards view
  const renderCardsView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employmentRecords.map(record => {
        const config = getStatusConfig(record);
        
        return (
          <Card key={record.id} className={cn("p-4", config.bgColor)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {record.jobTitle || 'Position Title'}
                </h3>
                <p className="text-sm text-gray-600">
                  {record.employerName || 'Company Name'}
                </p>
              </div>
              
              <Badge variant="secondary" className={cn("text-xs", config.textColor, config.bgColor)}>
                {config.label}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {new Date(record.startDate).toLocaleDateString()}
                  {record.endDate && ` - ${new Date(record.endDate).toLocaleDateString()}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>{getEmploymentDuration(record)}</span>
              </div>
              
              {record.employerLocation && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{record.employerLocation}</span>
                </div>
              )}
            </div>

            {renderConflicts(record.conflicts)}

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              {onViewRecord && (
                <Button size="sm" variant="outline" onClick={() => onViewRecord(record)}>
                  <EyeIcon className="w-4 h-4" />
                </Button>
              )}
              
              {onEditRecord && (
                <Button size="sm" variant="outline" onClick={() => onEditRecord(record)}>
                  <EditIcon className="w-4 h-4" />
                </Button>
              )}
              
              {onEndRecord && record.isActive && !record.endDate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEndRecord(record)}
                  className="text-red-600 hover:text-red-700"
                >
                  End
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

  // Get employment statistics
  const stats = useMemo(() => {
    const active = employmentRecords.filter(r => r.isActive);
    const future = employmentRecords.filter(r => new Date(r.startDate) > new Date());
    const conflicts = employmentRecords.flatMap(r => r.conflicts || []);
    
    return {
      total: employmentRecords.length,
      active: active.length,
      future: future.length,
      historical: employmentRecords.length - active.length - future.length,
      conflicts: conflicts.length,
      hasErrors: conflicts.some(c => c.severity === 'error')
    };
  }, [employmentRecords]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Employment History</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>{stats.total} total</span>
            <span className="text-green-600">{stats.active} active</span>
            {stats.future > 0 && <span className="text-blue-600">{stats.future} future</span>}
            {stats.conflicts > 0 && (
              <span className={cn(
                "flex items-center gap-1",
                stats.hasErrors ? "text-red-600" : "text-yellow-600"
              )}>
                <AlertTriangleIcon className="w-4 h-4" />
                {stats.conflicts} conflict{stats.conflicts === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <Button
              size="sm"
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              onClick={() => setViewMode('timeline')}
              className="h-8 px-3"
            >
              Timeline
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              onClick={() => setViewMode('cards')}
              className="h-8 px-3"
            >
              Cards
            </Button>
          </div>

          {/* Add Record Button */}
          {showAddButton && onAddRecord && (
            <Button onClick={onAddRecord} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Employment
            </Button>
          )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="min-h-[400px]">
        {employmentRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUpIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Employment Records</h3>
            <p className="text-gray-600 mb-4">Get started by adding the first employment record.</p>
            {showAddButton && onAddRecord && (
              <Button onClick={onAddRecord} className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add First Employment Record
              </Button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'timeline' ? renderTimelineView() : renderCardsView()}
          </>
        )}
      </div>
    </div>
  );
}