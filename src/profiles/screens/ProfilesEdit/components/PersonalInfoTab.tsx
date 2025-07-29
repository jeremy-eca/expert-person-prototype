import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Label } from '../../../../shared/components/ui/label';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { ProfilesEditFormData } from '../schemas/profilesEditSchema';
import { useTitles } from '../../../hooks/useTitles';
import { useGenders } from '../../../hooks/useGenders';
import { usePronouns } from '../../../hooks/usePronouns';

interface PersonalInfoTabProps {
  className?: string;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch 
  } = useFormContext<ProfilesEditFormData>();
  
  const { titles, isLoading: titlesLoading } = useTitles();
  const { genders, isLoading: gendersLoading } = useGenders();
  const { pronouns, isLoading: pronounsLoading } = usePronouns();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  return (
    <Card className={`bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026] ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <UserIcon className="w-5 h-5 text-white" />
          <CardTitle className="text-white text-lg font-medium">Personal Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title-select" className="text-sm font-medium text-gray-300">
            Title (Optional)
          </Label>
          <Controller
            name="personal.title_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || 'no-title'}
                onValueChange={(value) => field.onChange(value === 'no-title' ? '' : value)}
              >
                <SelectTrigger className="w-full bg-[#2A3440] border-[#40505C] text-white">
                  <SelectValue placeholder="Select a title..." />
                </SelectTrigger>
                <SelectContent className="bg-[#2A3440] border-[#40505C]">
                  <SelectItem value="no-title" className="text-white hover:bg-[#1A1F28]">
                    No title
                  </SelectItem>
                  {titles.map((title) => (
                    <SelectItem 
                      key={title.id} 
                      value={title.id}
                      className="text-white hover:bg-[#1A1F28]"
                    >
                      {title.display_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {getFieldError('personal.title_id') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.title_id')}</p>
          )}
        </div>

        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-sm font-medium text-gray-300">
              First Name <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="personal.first_name"
              control={control}
              render={({ field }) => (
                <Input
                  id="first-name"
                  {...field}
                  placeholder="Enter first name"
                  className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                />
              )}
            />
            {getFieldError('personal.first_name') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.first_name')}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-sm font-medium text-gray-300">
              Last Name <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="personal.last_name"
              control={control}
              render={({ field }) => (
                <Input
                  id="last-name"
                  {...field}
                  placeholder="Enter last name"
                  className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                />
              )}
            />
            {getFieldError('personal.last_name') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.last_name')}</p>
            )}
          </div>
        </div>

        {/* Preferred Name */}
        <div className="space-y-2">
          <Label htmlFor="preferred-name" className="text-sm font-medium text-gray-300">
            Preferred Name (Optional)
          </Label>
          <Controller
            name="personal.preferred_name"
            control={control}
            render={({ field }) => (
              <Input
                id="preferred-name"
                {...field}
                placeholder="Enter preferred name"
                className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
              />
            )}
          />
          {getFieldError('personal.preferred_name') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.preferred_name')}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="date-of-birth" className="text-sm font-medium text-gray-300">
            Date of Birth (Optional)
          </Label>
          <Controller
            name="personal.date_of_birth"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  id="date-of-birth"
                  type="date"
                  {...field}
                  className="w-full bg-[#2A3440] border-[#40505C] text-white"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
          {getFieldError('personal.date_of_birth') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.date_of_birth')}</p>
          )}
        </div>

        {/* Gender and Pronouns Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender-select" className="text-sm font-medium text-gray-300">
              Gender (Optional)
            </Label>
            <Controller
              name="personal.gender_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'no-gender'}
                  onValueChange={(value) => field.onChange(value === 'no-gender' ? '' : value)}
                  disabled={gendersLoading}
                >
                  <SelectTrigger className="w-full bg-[#2A3440] border-[#40505C] text-white">
                    <SelectValue placeholder="Select a gender..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A3440] border-[#40505C]">
                    <SelectItem value="no-gender" className="text-white hover:bg-[#1A1F28]">
                      No gender specified
                    </SelectItem>
                    {genders.map((gender) => (
                      <SelectItem 
                        key={gender.id} 
                        value={gender.id}
                        className="text-white hover:bg-[#1A1F28]"
                      >
                        {gender.display_label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {getFieldError('personal.gender_id') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.gender_id')}</p>
            )}
          </div>

          {/* Pronouns */}
          <div className="space-y-2">
            <Label htmlFor="pronouns-select" className="text-sm font-medium text-gray-300">
              Pronouns (Optional)
            </Label>
            <Controller
              name="personal.pronouns_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'no-pronouns'}
                  onValueChange={(value) => field.onChange(value === 'no-pronouns' ? '' : value)}
                  disabled={pronounsLoading}
                >
                  <SelectTrigger className="w-full bg-[#2A3440] border-[#40505C] text-white">
                    <SelectValue placeholder="Select pronouns..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A3440] border-[#40505C]">
                    <SelectItem value="no-pronouns" className="text-white hover:bg-[#1A1F28]">
                      No pronouns specified
                    </SelectItem>
                    {pronouns.map((pronoun) => (
                      <SelectItem 
                        key={pronoun.id} 
                        value={pronoun.id}
                        className="text-white hover:bg-[#1A1F28]"
                      >
                        {pronoun.display_label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {getFieldError('personal.pronouns_id') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.pronouns_id')}</p>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-blue-300 text-sm">
            💡 <strong>Required fields:</strong> First Name and Last Name are required to save the profile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};