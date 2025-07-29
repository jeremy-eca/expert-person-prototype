import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Card, CardBody, CardHeader, TextArea, TextInput, Select, Button, Label } from '@ecainternational/eca-components';
import { InfoIcon, PlusIcon, XIcon, GlobeIcon, LanguagesIcon, BadgeIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';
import { useLanguages } from '../../../hooks/useLanguages';
import { useNationalities } from '../../../hooks/useNationalities';

interface AdditionalInfoCardECAProps {
  className?: string;
}

export const AdditionalInfoCardECA: React.FC<AdditionalInfoCardECAProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch
  } = useFormContext<ProfilesCreateFormData>();
  
  const { languages, isLoading: languagesLoading } = useLanguages();
  const { nationalities, isLoading: nationalitiesLoading } = useNationalities();

  // Field arrays for dynamic sections
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control,
    name: 'additional.languages'
  });

  const {
    fields: nationalityFields,
    append: appendNationality,
    remove: removeNationality
  } = useFieldArray({
    control,
    name: 'additional.nationalities'
  });

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  // Language proficiency options
  const proficiencyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native' }
  ];

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <h3 className="text-white flex items-center gap-2 text-lg font-semibold">
          <InfoIcon className="w-5 h-5" />
          Additional Information
        </h3>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
            Biography (Optional)
          </Label>
          <Controller
            name="additional.bio"
            control={control}
            render={({ field }) => (
              <TextArea
                id="bio"
                name="bio"
                value={field.value || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.onChange(e.target.value)}
                placeholder="Brief description or biography..."
                maxLength={500}
                disabled={false}
                className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 min-h-[100px] resize-y"
              />
            )}
          />
          {getFieldError('additional.bio') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.bio')}</p>
          )}
          <p className="text-gray-500 text-xs">
            {watch('additional.bio')?.length || 0}/500 characters
          </p>
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <Label htmlFor="employee-id" className="text-sm font-medium text-gray-300">
            Employee ID (Optional)
          </Label>
          <Controller
            name="additional.employee_id"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <TextInput
                  id="employee-id"
                  name="employee_id"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Enter employee ID"
                  state={getFieldError('additional.employee_id') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 pl-10"
                />
                <BadgeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            )}
          />
          {getFieldError('additional.employee_id') && (
            <p className="text-red-400 text-sm">{getFieldError('additional.employee_id')}</p>
          )}
        </div>

        {/* Languages Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              Languages (Optional)
            </Label>
            <Button
              name="add-language"
              variant="outline"
              size="small"
              onClick={() => appendLanguage({ language: '', proficiency: 'beginner' })}
              className="text-white border-[#40505C] hover:bg-[#2A3440] text-xs"
            >
              <PlusIcon className="w-3 h-3 mr-1" />
              Add Language
            </Button>
          </div>

          {languageFields.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-[#40505C] rounded-md">
              <p className="text-gray-400 text-sm">No languages added yet</p>
              <p className="text-gray-500 text-xs mt-1">Click "Add Language" to include language skills</p>
            </div>
          ) : (
            <div className="space-y-3">
              {languageFields.map((field, index) => (
                <div key={field.id} className="p-3 bg-[#1A1F28] rounded-md border border-[#40505C]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm font-medium">Language {index + 1}</span>
                    <Button
                      name={`remove-language-${index}`}
                      variant="ghost"
                      size="small"
                      onClick={() => removeLanguage(index)}
                      className="text-red-400 hover:bg-red-500/20 p-1"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Language Selection */}
                    <div className="space-y-1">
                      <Label htmlFor={`language-${index}`} className="text-xs text-gray-400">
                        Language
                      </Label>
                      <Controller
                        name={`additional.languages.${index}.language`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            id={`language-${index}`}
                            name={`language_${index}`}
                            value={field.value || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value)}
                            state={getFieldError(`additional.languages.${index}.language`) ? 'error' : 'default'}
                            variant="outline"
                            size="small"
                            className="w-full bg-[#252E38] border-[#40505C] text-white"
                            disabled={languagesLoading}
                          >
                            <option value="">Select language...</option>
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.display_label}>
                                {lang.display_label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {getFieldError(`additional.languages.${index}.language`) && (
                        <p className="text-red-400 text-xs">{getFieldError(`additional.languages.${index}.language`)}</p>
                      )}
                    </div>

                    {/* Proficiency Selection */}
                    <div className="space-y-1">
                      <Label htmlFor={`proficiency-${index}`} className="text-xs text-gray-400">
                        Proficiency
                      </Label>
                      <Controller
                        name={`additional.languages.${index}.proficiency`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            id={`proficiency-${index}`}
                            name={`proficiency_${index}`}
                            value={field.value || 'beginner'}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value)}
                            state={getFieldError(`additional.languages.${index}.proficiency`) ? 'error' : 'default'}
                            variant="outline"
                            size="small"
                            className="w-full bg-[#252E38] border-[#40505C] text-white"
                          >
                            {proficiencyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {getFieldError(`additional.languages.${index}.proficiency`) && (
                        <p className="text-red-400 text-xs">{getFieldError(`additional.languages.${index}.proficiency`)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nationalities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <GlobeIcon className="w-4 h-4" />
              Nationalities (Optional)
            </Label>
            <Button
              name="add-nationality"
              variant="outline"
              size="small"
              onClick={() => appendNationality({ id: '', display_label: '' })}
              className="text-white border-[#40505C] hover:bg-[#2A3440] text-xs"
            >
              <PlusIcon className="w-3 h-3 mr-1" />
              Add Nationality
            </Button>
          </div>

          {nationalityFields.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-[#40505C] rounded-md">
              <p className="text-gray-400 text-sm">No nationalities added yet</p>
              <p className="text-gray-500 text-xs mt-1">Click "Add Nationality" to include nationalities</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nationalityFields.map((field, index) => (
                <div key={field.id} className="p-3 bg-[#1A1F28] rounded-md border border-[#40505C]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor={`nationality-${index}`} className="text-xs text-gray-400 block mb-1">
                        Nationality {index + 1}
                      </Label>
                      <Controller
                        name={`additional.nationalities.${index}.id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            id={`nationality-${index}`}
                            name={`nationality_${index}`}
                            value={field.value || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const selectedNationality = nationalities.find(n => n.id === e.target.value);
                              if (selectedNationality) {
                                field.onChange(selectedNationality.id);
                                // Also update the display_label field
                                const displayLabelField = `additional.nationalities.${index}.display_label` as any;
                                control.setValue(displayLabelField, selectedNationality.display_label);
                              }
                            }}
                            state={getFieldError(`additional.nationalities.${index}.id`) ? 'error' : 'default'}
                            variant="outline"
                            size="small"
                            className="w-full bg-[#252E38] border-[#40505C] text-white"
                            disabled={nationalitiesLoading}
                          >
                            <option value="">Select nationality...</option>
                            {nationalities.map((nationality) => (
                              <option key={nationality.id} value={nationality.id}>
                                {nationality.display_label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {getFieldError(`additional.nationalities.${index}.id`) && (
                        <p className="text-red-400 text-xs mt-1">{getFieldError(`additional.nationalities.${index}.id`)}</p>
                      )}

                      {/* Hidden field for display_label */}
                      <Controller
                        name={`additional.nationalities.${index}.display_label`}
                        control={control}
                        render={() => null}
                      />
                    </div>
                    <Button
                      name={`remove-nationality-${index}`}
                      variant="ghost"
                      size="small"
                      onClick={() => removeNationality(index)}
                      className="text-red-400 hover:bg-red-500/20 p-1"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
          <p className="text-purple-300 text-sm">
            ✨ <strong>Optional Information:</strong> This section helps create a more comprehensive profile. 
            Add languages and nationalities to enhance the person's profile for better matching and identification.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};