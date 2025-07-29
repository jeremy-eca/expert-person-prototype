import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { Card } from './card';
import { Badge } from './badge';
import { Switch } from './switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { DatePicker } from './date-picker';
import { EmploymentRecord, EmploymentConflict } from '../../../profiles/types/frontend.types';
import { CreateEmploymentRequest, UpdateEmploymentRequest } from '../../../profiles/services/api/employmentService';
import { ReferenceDataService, ReferenceJobFunction, ReferenceJobGrade, ReferenceEmploymentType, ReferenceCity } from '../../../profiles/services/api/referenceDataService';
import { cn } from '../../lib/utils';
import { 
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertTriangleIcon,
  InfoIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
  BuildingIcon,
  UserIcon,
  MapPinIcon,
  BriefcaseIcon
} from 'lucide-react';

interface EmploymentFormProps {
  employmentRecord?: EmploymentRecord;
  personId: string;
  existingRecords?: EmploymentRecord[];
  onSubmit: (data: CreateEmploymentRequest | UpdateEmploymentRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

interface FormData {
  jobTitle: string;
  jobFunctionId: string;
  jobGradeId: string;
  department: string;
  employerName: string;
  employmentTypeId: string;
  roleDescription: string;
  employerLocationId: string;
  startDate: string;
  endDate: string;
  plannedEndDate: string;
  isActive: boolean;
  isSecondaryContract: boolean;
  isPrimaryEmployment: boolean;
  isFutureAssignment: boolean;
  workLocation: 'Office' | 'Remote' | 'Hybrid' | '';
  workArrangement: string;
  managers: Array<{
    id: string;
    name: string;
    email?: string;
    role?: string;
    isPrimary: boolean;
  }>;
  workingHours: {
    hoursPerWeek: number;
    schedule: string;
    timeZone: string;
  };
  compensation: {
    salaryBand: string;
    currency: string;
    reviewDate: string;
  };
  notes: string;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

interface ProgressiveSection {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  isRequired: boolean;
  hasErrors: boolean;
}

export function EmploymentForm({
  employmentRecord,
  personId,
  existingRecords = [],
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: EmploymentFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    jobTitle: employmentRecord?.jobTitle || '',
    jobFunctionId: employmentRecord?.jobFunctionId || '',
    jobGradeId: employmentRecord?.jobGradeId || '',
    department: employmentRecord?.department || '',
    employerName: employmentRecord?.employerName || '',
    employmentTypeId: employmentRecord?.employmentTypeId || '',
    roleDescription: employmentRecord?.roleDescription || '',
    employerLocationId: employmentRecord?.employerLocationId || '',
    startDate: employmentRecord?.startDate || '',
    endDate: employmentRecord?.endDate || '',
    plannedEndDate: employmentRecord?.plannedEndDate || '',
    isActive: employmentRecord?.isActive ?? true,
    isSecondaryContract: employmentRecord?.isSecondaryContract ?? false,
    isPrimaryEmployment: employmentRecord?.isPrimaryEmployment ?? true,
    isFutureAssignment: employmentRecord?.isFutureAssignment ?? false,
    workLocation: (employmentRecord?.workLocation as 'Office' | 'Remote' | 'Hybrid') || '',
    workArrangement: employmentRecord?.workArrangement || '',
    managers: employmentRecord?.managers?.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email || '',
      role: m.role || '',
      isPrimary: m.isPrimary || false
    })) || [],
    workingHours: {
      hoursPerWeek: employmentRecord?.workingHours?.hoursPerWeek || 40,
      schedule: employmentRecord?.workingHours?.schedule || '',
      timeZone: employmentRecord?.workingHours?.timeZone || '',
    },
    compensation: {
      salaryBand: employmentRecord?.compensation?.salaryBand || '',
      currency: employmentRecord?.compensation?.currency || 'USD',
      reviewDate: employmentRecord?.compensation?.reviewDate || '',
    },
    notes: employmentRecord?.notes || '',
    tags: employmentRecord?.tags || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [conflicts, setConflicts] = useState<EmploymentConflict[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reference data state
  const [jobFunctions, setJobFunctions] = useState<ReferenceJobFunction[]>([]);
  const [jobGrades, setJobGrades] = useState<ReferenceJobGrade[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<ReferenceEmploymentType[]>([]);
  const [cities, setCities] = useState<ReferenceCity[]>([]);
  const [isLoadingReference, setIsLoadingReference] = useState(true);

  // Search states for autocomplete
  const [jobFunctionSearch, setJobFunctionSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Progressive disclosure state
  const [sections, setSections] = useState<ProgressiveSection[]>([
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Job title, function, and employer details',
      isExpanded: true,
      isRequired: true,
      hasErrors: false
    },
    {
      id: 'employment',
      title: 'Employment Details',
      description: 'Employment type, dates, and status',
      isExpanded: true,
      isRequired: true,
      hasErrors: false
    },
    {
      id: 'location',
      title: 'Location & Work Arrangement',
      description: 'Work location and arrangement details',
      isExpanded: false,
      isRequired: false,
      hasErrors: false
    },
    {
      id: 'management',
      title: 'Management & Reporting',
      description: 'Manager relationships and reporting structure',
      isExpanded: false,
      isRequired: false,
      hasErrors: false
    },
    {
      id: 'compensation',
      title: 'Compensation & Benefits',
      description: 'Salary, benefits, and working hours',
      isExpanded: false,
      isRequired: false,
      hasErrors: false
    },
    {
      id: 'additional',
      title: 'Additional Information',
      description: 'Notes, tags, and other details',
      isExpanded: false,
      isRequired: false,
      hasErrors: false
    }
  ]);

  // Load reference data on mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setIsLoadingReference(true);
        const referenceData = await ReferenceDataService.getEmploymentReferenceData();
        setJobFunctions(referenceData.jobFunctions);
        setJobGrades(referenceData.jobGrades);
        setEmploymentTypes(referenceData.employmentTypes);
        // Initially load popular cities
        const citiesResponse = await ReferenceDataService.getCities({ limit: 100 });
        setCities(citiesResponse.data);
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setIsLoadingReference(false);
      }
    };

    loadReferenceData();
  }, []);

  // Search cities when city search changes
  useEffect(() => {
    const searchCities = async () => {
      if (citySearch.length >= 2) {
        try {
          const response = await ReferenceDataService.searchCities(citySearch);
          setCities(response.data);
        } catch (error) {
          console.error('Failed to search cities:', error);
        }
      }
    };

    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [citySearch]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData]);

  // Validate form and detect conflicts
  const validateForm = useMemo(() => {
    const newErrors: FormErrors = {};
    const newConflicts: EmploymentConflict[] = [];

    // Required field validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Future assignment validation
    if (formData.isFutureAssignment && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const now = new Date();
      if (startDate <= now) {
        newErrors.startDate = 'Future assignments must have a start date in the future';
      }
    }

    // Primary employment validation
    if (formData.isPrimaryEmployment && formData.isSecondaryContract) {
      newErrors.isPrimaryEmployment = 'An employment cannot be both primary and secondary';
    }

    // Conflict detection with existing records
    if (formData.startDate) {
      const newStart = new Date(formData.startDate);
      const newEnd = formData.endDate ? new Date(formData.endDate) : null;

      existingRecords.forEach(existing => {
        if (employmentRecord && existing.id === employmentRecord.id) return;

        const existingStart = new Date(existing.startDate);
        const existingEnd = existing.endDate ? new Date(existing.endDate) : null;

        // Check for overlap
        const hasOverlap = (
          newStart <= (existingEnd || new Date()) &&
          (newEnd || new Date()) >= existingStart
        );

        if (hasOverlap && existing.isActive && formData.isActive) {
          newConflicts.push({
            id: `overlap-${existing.id}`,
            type: 'overlap',
            severity: formData.isPrimaryEmployment && existing.isPrimaryEmployment ? 'error' : 'warning',
            message: `Overlaps with ${existing.jobTitle || 'existing employment'} at ${existing.employerName || 'Unknown Company'}`,
            conflictingRecordId: existing.id,
            suggestedAction: 'Consider adjusting dates or marking one as secondary'
          });
        }
      });
    }

    return { errors: newErrors, conflicts: newConflicts };
  }, [formData, existingRecords, employmentRecord]);

  // Update errors and conflicts when validation changes
  useEffect(() => {
    const { errors: newErrors, conflicts: newConflicts } = validateForm;
    setErrors(newErrors);
    setConflicts(newConflicts);

    // Update section error status
    setSections(prev => prev.map(section => ({
      ...section,
      hasErrors: Object.keys(newErrors).some(key => {
        switch (section.id) {
          case 'basic':
            return ['jobTitle', 'jobFunctionId', 'employerName'].includes(key);
          case 'employment':
            return ['startDate', 'endDate', 'employmentTypeId', 'isActive'].includes(key);
          case 'location':
            return ['employerLocationId', 'workLocation'].includes(key);
          case 'management':
            return ['managers'].includes(key);
          case 'compensation':
            return ['compensation'].includes(key);
          default:
            return false;
        }
      })
    })));
  }, [validateForm]);

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        (newData as any)[parent] = {
          ...((newData as any)[parent] || {}),
          [child]: value
        };
      } else {
        (newData as any)[field] = value;
      }
      return newData;
    });
  };

  // Handle section expansion
  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  // Handle manager addition
  const addManager = () => {
    setFormData(prev => ({
      ...prev,
      managers: [
        ...prev.managers,
        {
          id: `temp-${Date.now()}`,
          name: '',
          email: '',
          role: '',
          isPrimary: prev.managers.length === 0
        }
      ]
    }));
  };

  // Handle manager removal
  const removeManager = (index: number) => {
    setFormData(prev => ({
      ...prev,
      managers: prev.managers.filter((_, i) => i !== index)
    }));
  };

  // Handle tag addition
  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Handle tag removal
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      // Expand sections with errors
      setSections(prev => prev.map(section => ({
        ...section,
        isExpanded: section.hasErrors || section.isExpanded
      })));
      return;
    }

    const submitData = employmentRecord 
      ? {
          jobTitle: formData.jobTitle || undefined,
          jobFunction: jobFunctions.find(jf => jf.id === formData.jobFunctionId)?.job_function_name,
          jobGrade: jobGrades.find(jg => jg.id === formData.jobGradeId)?.job_grade_name,
          department: formData.department || undefined,
          employerName: formData.employerName || undefined,
          employmentType: employmentTypes.find(et => et.id === formData.employmentTypeId)?.employment_type_name,
          roleDescription: formData.roleDescription || undefined,
          employerLocation: cities.find(c => c.city_id === formData.employerLocationId)?.city_name,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          isActive: formData.isActive,
          isSecondaryContract: formData.isSecondaryContract,
          managers: formData.managers.filter(m => m.name.trim()).map(m => ({
            id: m.id,
            name: m.name,
            email: m.email || undefined
          }))
        } as UpdateEmploymentRequest
      : {
          personId,
          jobTitle: formData.jobTitle || undefined,
          jobFunction: jobFunctions.find(jf => jf.id === formData.jobFunctionId)?.job_function_name,
          jobGrade: jobGrades.find(jg => jg.id === formData.jobGradeId)?.job_grade_name,
          department: formData.department || undefined,
          employerName: formData.employerName || undefined,
          employmentType: employmentTypes.find(et => et.id === formData.employmentTypeId)?.employment_type_name,
          roleDescription: formData.roleDescription || undefined,
          employerLocation: cities.find(c => c.city_id === formData.employerLocationId)?.city_name,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          isActive: formData.isActive,
          isSecondaryContract: formData.isSecondaryContract,
          managers: formData.managers.filter(m => m.name.trim()).map(m => ({
            id: m.id,
            name: m.name,
            email: m.email || undefined
          }))
        } as CreateEmploymentRequest;

    try {
      await onSubmit(submitData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // Filter job functions based on search
  const filteredJobFunctions = useMemo(() => {
    if (!jobFunctionSearch) return jobFunctions;
    return jobFunctions.filter(jf => 
      jf.job_function_name.toLowerCase().includes(jobFunctionSearch.toLowerCase())
    );
  }, [jobFunctions, jobFunctionSearch]);

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && formData.startDate;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {employmentRecord ? 'Edit Employment Record' : 'Add Employment Record'}
          </h2>
          <p className="text-sm text-gray-600">
            {employmentRecord 
              ? 'Update employment information and track changes'
              : 'Create a new employment record with all relevant details'
            }
          </p>
        </div>
        
        {hasUnsavedChanges && (
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900 mb-2">Employment Conflicts Detected</h3>
              <div className="space-y-2">
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="text-sm text-yellow-800">
                    <span className="font-medium">{conflict.type.toUpperCase()}:</span> {conflict.message}
                    {conflict.suggestedAction && (
                      <div className="text-yellow-700 mt-1">
                        <InfoIcon className="w-3 h-3 inline mr-1" />
                        {conflict.suggestedAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Progressive Disclosure Sections */}
      <div className="space-y-4">
        {sections.map(section => (
          <Card key={section.id} className={cn(
            "transition-all duration-200",
            section.hasErrors && "border-red-200 bg-red-50"
          )}>
            <div 
              className="p-4 cursor-pointer select-none"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    section.hasErrors ? "bg-red-500" : 
                    section.isRequired ? "bg-blue-500" : "bg-gray-300"
                  )} />
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {section.isRequired && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                  {section.hasErrors && (
                    <Badge variant="destructive" className="text-xs">Errors</Badge>
                  )}
                  {section.isExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {section.isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-4 space-y-4">
                  {section.id === 'basic' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className={errors.jobTitle ? 'border-red-300' : ''}
                          />
                          {errors.jobTitle && (
                            <p className="text-sm text-red-600 mt-1">{errors.jobTitle}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="employerName">Employer Name</Label>
                          <Input
                            id="employerName"
                            value={formData.employerName}
                            onChange={(e) => handleFieldChange('employerName', e.target.value)}
                            placeholder="e.g. Acme Corporation"
                            className={errors.employerName ? 'border-red-300' : ''}
                          />
                          {errors.employerName && (
                            <p className="text-sm text-red-600 mt-1">{errors.employerName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobFunction">Job Function</Label>
                          <Select
                            value={formData.jobFunctionId}
                            onValueChange={(value: string) => handleFieldChange('jobFunctionId', value)}
                          >
                            <SelectTrigger className={errors.jobFunctionId ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Select job function" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredJobFunctions.map(jf => (
                                <SelectItem key={jf.id} value={jf.id}>
                                  <div className="flex items-center gap-2">
                                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-medium">{jf.job_function_name}</div>
                                      {jf.description && (
                                        <div className="text-sm text-gray-600">{jf.description}</div>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.jobFunctionId && (
                            <p className="text-sm text-red-600 mt-1">{errors.jobFunctionId}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="jobGrade">Job Grade</Label>
                          <Select
                            value={formData.jobGradeId}
                            onValueChange={(value) => handleFieldChange('jobGradeId', value)}
                          >
                            <SelectTrigger className={errors.jobGradeId ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Select job grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobGrades.map(jg => (
                                <SelectItem key={jg.id} value={jg.id}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{jg.job_grade_name}</span>
                                    {jg.level && (
                                      <Badge variant="outline" className="text-xs">
                                        {jg.level}
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.jobGradeId && (
                            <p className="text-sm text-red-600 mt-1">{errors.jobGradeId}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleFieldChange('department', e.target.value)}
                          placeholder="e.g. Engineering, Sales, Marketing"
                        />
                      </div>

                      <div>
                        <Label htmlFor="roleDescription">Role Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={formData.roleDescription}
                          onChange={(e) => handleFieldChange('roleDescription', e.target.value)}
                          placeholder="Describe the role responsibilities and requirements..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {section.id === 'employment' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="employmentType">Employment Type</Label>
                          <Select
                            value={formData.employmentTypeId}
                            onValueChange={(value) => handleFieldChange('employmentTypeId', value)}
                          >
                            <SelectTrigger className={errors.employmentTypeId ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {employmentTypes.map(et => (
                                <SelectItem key={et.id} value={et.id}>
                                  <div>
                                    <div className="font-medium">{et.employment_type_name}</div>
                                    {et.category && (
                                      <div className="text-sm text-gray-600">{et.category}</div>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.employmentTypeId && (
                            <p className="text-sm text-red-600 mt-1">{errors.employmentTypeId}</p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="isActive"
                              checked={formData.isActive}
                              onCheckedChange={(checked: boolean) => handleFieldChange('isActive', checked)}
                            />
                            <Label htmlFor="isActive">Active Employment</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="isSecondaryContract"
                              checked={formData.isSecondaryContract}
                              onCheckedChange={(checked: boolean) => handleFieldChange('isSecondaryContract', checked)}
                            />
                            <Label htmlFor="isSecondaryContract">Secondary Contract</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="isFutureAssignment"
                              checked={formData.isFutureAssignment}
                              onCheckedChange={(checked: boolean) => handleFieldChange('isFutureAssignment', checked)}
                            />
                            <Label htmlFor="isFutureAssignment">Future Assignment</Label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date *</Label>
                          <DatePicker
                            value={formData.startDate}
                            onChange={(date) => handleFieldChange('startDate', date)}
                            className={errors.startDate ? 'border-red-300' : ''}
                          />
                          {errors.startDate && (
                            <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <DatePicker
                            value={formData.endDate}
                            onChange={(date) => handleFieldChange('endDate', date)}
                            className={errors.endDate ? 'border-red-300' : ''}
                          />
                          {errors.endDate && (
                            <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
                          )}
                        </div>
                      </div>

                      {formData.isFutureAssignment && (
                        <div>
                          <Label htmlFor="plannedEndDate">Planned End Date</Label>
                          <DatePicker
                            value={formData.plannedEndDate}
                            onChange={(date) => handleFieldChange('plannedEndDate', date)}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {section.id === 'location' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="employerLocation">Employer Location</Label>
                          <Select
                            value={formData.employerLocationId}
                            onValueChange={(value: string) => handleFieldChange('employerLocationId', value)}
                          >
                            <SelectTrigger className={errors.employerLocationId ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map(city => (
                                <SelectItem key={city.city_id} value={city.city_id}>
                                  <div className="flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <div className="font-medium">{city.city_name}</div>
                                      <div className="text-sm text-gray-600">
                                        {city.adm1_name && `${city.adm1_name}, `}{city.country_code}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.employerLocationId && (
                            <p className="text-sm text-red-600 mt-1">{errors.employerLocationId}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="workLocation">Work Location Type</Label>
                          <Select
                            value={formData.workLocation}
                            onValueChange={(value: 'Office' | 'Remote' | 'Hybrid') => handleFieldChange('workLocation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select work location type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Office">Office</SelectItem>
                              <SelectItem value="Remote">Remote</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="workArrangement">Work Arrangement Details</Label>
                        <Textarea
                          id="workArrangement"
                          value={formData.workArrangement}
                          onChange={(e) => handleFieldChange('workArrangement', e.target.value)}
                          placeholder="Describe specific work arrangement details..."
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  {section.id === 'management' && (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Managers</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addManager}
                          >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Manager
                          </Button>
                        </div>

                        {formData.managers.map((manager, index) => (
                          <Card key={manager.id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-sm">Manager {index + 1}</span>
                                {manager.isPrimary && (
                                  <Badge variant="default" className="text-xs">Primary</Badge>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeManager(index)}
                              >
                                <XIcon className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`manager-name-${index}`}>Name</Label>
                                <Input
                                  id={`manager-name-${index}`}
                                  value={manager.name}
                                  onChange={(e) => {
                                    const newManagers = [...formData.managers];
                                    newManagers[index].name = e.target.value;
                                    handleFieldChange('managers', newManagers);
                                  }}
                                  placeholder="Manager's full name"
                                />
                              </div>

                              <div>
                                <Label htmlFor={`manager-email-${index}`}>Email</Label>
                                <Input
                                  id={`manager-email-${index}`}
                                  type="email"
                                  value={manager.email}
                                  onChange={(e) => {
                                    const newManagers = [...formData.managers];
                                    newManagers[index].email = e.target.value;
                                    handleFieldChange('managers', newManagers);
                                  }}
                                  placeholder="manager@company.com"
                                />
                              </div>

                              <div>
                                <Label htmlFor={`manager-role-${index}`}>Role/Title</Label>
                                <Input
                                  id={`manager-role-${index}`}
                                  value={manager.role}
                                  onChange={(e) => {
                                    const newManagers = [...formData.managers];
                                    newManagers[index].role = e.target.value;
                                    handleFieldChange('managers', newManagers);
                                  }}
                                  placeholder="e.g. Team Lead, Director"
                                />
                              </div>

                              <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                  id={`manager-primary-${index}`}
                                  checked={manager.isPrimary}
                                  onCheckedChange={(checked: boolean) => {
                                    const newManagers = formData.managers.map((m, i) => ({
                                      ...m,
                                      isPrimary: i === index ? checked : false
                                    }));
                                    handleFieldChange('managers', newManagers);
                                  }}
                                />
                                <Label htmlFor={`manager-primary-${index}`}>Primary Manager</Label>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {formData.managers.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No managers added yet</p>
                            <p className="text-sm">Click "Add Manager" to start</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {section.id === 'compensation' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="hoursPerWeek">Hours Per Week</Label>
                          <Input
                            id="hoursPerWeek"
                            type="number"
                            min="1"
                            max="80"
                            value={formData.workingHours.hoursPerWeek}
                            onChange={(e) => handleFieldChange('workingHours.hoursPerWeek', parseInt(e.target.value) || 40)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={formData.compensation.currency}
                            onValueChange={(value: string) => handleFieldChange('compensation.currency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                              <SelectItem value="AUD">AUD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="timeZone">Time Zone</Label>
                          <Input
                            id="timeZone"
                            value={formData.workingHours.timeZone}
                            onChange={(e) => handleFieldChange('workingHours.timeZone', e.target.value)}
                            placeholder="e.g. America/New_York"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="salaryBand">Salary Band</Label>
                          <Input
                            id="salaryBand"
                            value={formData.compensation.salaryBand}
                            onChange={(e) => handleFieldChange('compensation.salaryBand', e.target.value)}
                            placeholder="e.g. L4, Senior, Band 3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="reviewDate">Review Date</Label>
                          <DatePicker
                            value={formData.compensation.reviewDate}
                            onChange={(date) => handleFieldChange('compensation.reviewDate', date)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="schedule">Work Schedule</Label>
                        <Textarea
                          id="schedule"
                          value={formData.workingHours.schedule}
                          onChange={(e) => handleFieldChange('workingHours.schedule', e.target.value)}
                          placeholder="Describe the work schedule (e.g. Mon-Fri 9-5, Flexible hours, etc.)"
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  {section.id === 'additional' && (
                    <>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleFieldChange('notes', e.target.value)}
                          placeholder="Additional notes about this employment record..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 w-4 h-4"
                                onClick={() => removeTag(tag)}
                              >
                                <XIcon className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag and press Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                addTag(target.value.trim());
                                target.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {!isFormValid && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangleIcon className="w-4 h-4" />
              <span className="text-sm">Please fix errors before submitting</span>
            </div>
          )}
          
          {conflicts.some(c => c.severity === 'error') && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangleIcon className="w-4 h-4" />
              <span className="text-sm">Resolve conflicts to continue</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={!isFormValid || conflicts.some(c => c.severity === 'error') || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                {employmentRecord ? 'Update' : 'Create'} Employment
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}