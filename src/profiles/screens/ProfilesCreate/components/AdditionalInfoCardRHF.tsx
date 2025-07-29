import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Button } from '../../../../shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Badge } from '../../../../shared/components/ui/badge';
import { UserIcon, LanguagesIcon, FlagIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';
import { NationalityAutocomplete } from '../../../components/ui/nationality-autocomplete';
import { LanguageAutocomplete } from '../../../components/ui/language-autocomplete';

interface AdditionalInfoCardRHFProps {
  className?: string;
}


export const AdditionalInfoCardRHF: React.FC<AdditionalInfoCardRHFProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch,
  } = useFormContext<ProfilesCreateFormData>();

  // Field arrays for dynamic fields
  const { fields: nationalityFields, append: appendNationality, remove: removeNationality } = useFieldArray({
    control,
    name: 'additional.nationalities',
  });

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  // Handle nationality selection
  const handleNationalitySelect = (nationalities: Array<{ id: string; display_label: string }>) => {
    // Clear existing nationalities and add new ones
    nationalityFields.forEach((_, index) => removeNationality(index));
    nationalities.forEach((nationality) => {
      appendNationality({
        id: nationality.id,
        display_label: nationality.display_label,
      });
    });
  };

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio/Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Bio/Description (Optional)
          </label>
          <Controller
            name="additional.bio"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Enter a brief bio or description..."
                rows={4}
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 resize-none"
              />
            )}
          />
          {getFieldError('additional.bio') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.bio')}</p>
          )}
          <p className="text-xs text-gray-500">
            Maximum 1000 characters. Share a brief description about yourself.
          </p>
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Employee ID (Optional)
          </label>
          <Controller
            name="additional.employee_id"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Enter employee ID"
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('additional.employee_id') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.employee_id')}</p>
          )}
          <p className="text-xs text-gray-500">
            Your organization's employee identification number
          </p>
        </div>

        {/* Language Skills */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <LanguagesIcon className="w-4 h-4" />
            Language Skills (Optional)
          </label>
          
          <Controller
            name="additional.languages"
            control={control}
            render={({ field }) => (
              <LanguageAutocomplete
                selectedLanguages={field.value || []}
                onLanguagesChange={field.onChange}
                placeholder="Search and select languages..."
                className="bg-[#1A1F28] border-[#40505C]"
              />
            )}
          />
          
          {getFieldError('additional.languages') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.languages')}</p>
          )}
        </div>

        {/* Nationalities */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <FlagIcon className="w-4 h-4" />
            Nationalities (Optional)
          </label>
          
          <Controller
            name="additional.nationalities"
            control={control}
            render={({ field }) => (
              <NationalityAutocomplete
                selectedNationalities={field.value}
                onNationalitiesChange={handleNationalitySelect}
                placeholder="Search and select nationalities..."
                className="bg-[#1A1F28] border-[#40505C]"
              />
            )}
          />

          {nationalityFields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nationalityFields.map((nationality, index) => (
                <Badge
                  key={nationality.id}
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                >
                  {nationality.display_label}
                  <Button
                    type="button"
                    onClick={() => removeNationality(index)}
                    size="sm"
                    variant="ghost"
                    className="ml-1 h-auto p-0 text-blue-300 hover:text-blue-100"
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {getFieldError('additional.nationalities') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.nationalities')}</p>
          )}
          
          <p className="text-xs text-gray-500">
            Select multiple nationalities if applicable. This helps with visa and travel requirements.
          </p>
        </div>

        {/* Additional Information Note */}
        <div className="mt-6 p-3 bg-[#1A1F28] border border-[#40505C] rounded-md">
          <p className="text-xs text-gray-400">
            <strong>Note:</strong> Additional information helps create a comprehensive profile. 
            Language skills and nationalities are particularly useful for international assignments and team collaboration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};