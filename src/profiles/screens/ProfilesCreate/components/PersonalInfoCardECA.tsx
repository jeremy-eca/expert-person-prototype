import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardBody, CardHeader, TextInput, Select, Label } from '@ecainternational/eca-components';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';
import { useTitles } from '../../../hooks/useTitles';
import { useGenders } from '../../../hooks/useGenders';
import { usePronouns } from '../../../hooks/usePronouns';

interface PersonalInfoCardECAProps {
  className?: string;
}

export const PersonalInfoCardECA: React.FC<PersonalInfoCardECAProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch 
  } = useFormContext<ProfilesCreateFormData>();
  
  const { titles, isLoading: titlesLoading } = useTitles();
  const { genders, isLoading: gendersLoading } = useGenders();
  const { pronouns, isLoading: pronounsLoading } = usePronouns();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <h3 className="text-white flex items-center gap-2 text-lg font-semibold">
          <UserIcon className="w-5 h-5" />
          Personal Information
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
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
                id="title-select"
                name="title_id"
                value={field.value || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value || null)}
                state={getFieldError('personal.title_id') ? 'error' : 'default'}
                variant="outline"
                size="medium"
                className="w-full bg-[#1A1F28] border-[#40505C] text-white"
                disabled={titlesLoading}
              >
                <option value="">Select a title...</option>
                {titles.map((title) => (
                  <option key={title.title_id} value={title.title_id}>
                    {title.display_label}
                  </option>
                ))}
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
                <TextInput
                  id="first-name"
                  name="first_name"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Enter first name"
                  state={getFieldError('personal.first_name') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
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
                <TextInput
                  id="last-name"
                  name="last_name"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Enter last name"
                  state={getFieldError('personal.last_name') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
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
              <TextInput
                id="preferred-name"
                name="preferred_name"
                value={field.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                placeholder="Enter preferred name"
                state={getFieldError('personal.preferred_name') ? 'error' : 'default'}
                variant="outline"
                className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
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
                <TextInput
                  id="date-of-birth"
                  name="date_of_birth"
                  type="date"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  state={getFieldError('personal.date_of_birth') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white"
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
                  id="gender-select"
                  name="gender_id"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value || null)}
                  state={getFieldError('personal.gender_id') ? 'error' : 'default'}
                  variant="outline"
                  size="medium"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white"
                  disabled={gendersLoading}
                >
                  <option value="">Select a gender...</option>
                  {genders.map((gender) => (
                    <option key={gender.gender_id} value={gender.gender_id}>
                      {gender.display_label}
                    </option>
                  ))}
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
                  id="pronouns-select"
                  name="pronoun_id"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value || null)}
                  state={getFieldError('personal.pronouns_id') ? 'error' : 'default'}
                  variant="outline"
                  size="medium"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white"
                  disabled={pronounsLoading}
                >
                  <option value="">Select pronouns...</option>
                  {pronouns.map((pronoun) => (
                    <option key={pronoun.pronoun_id} value={pronoun.pronoun_id}>
                      {pronoun.display_label}
                    </option>
                  ))}
                </Select>
              )}
            />
            {getFieldError('personal.pronouns_id') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.pronouns_id')}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">
            Primary Email (Optional)
          </Label>
          <Controller
            name="personal.email"
            control={control}
            render={({ field }) => (
              <TextInput
                id="email"
                name="email"
                type="email"
                value={field.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                placeholder="Enter email address"
                state={getFieldError('personal.email') ? 'error' : 'default'}
                variant="outline"
                className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('personal.email') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.email')}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};