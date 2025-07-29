import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';
import { useTitles } from '../../../hooks/useTitles';
import { useGenders } from '../../../hooks/useGenders';
import { usePronouns } from '../../../hooks/usePronouns';

interface PersonalInfoCardRHFProps {
  className?: string;
}

export const PersonalInfoCardRHF: React.FC<PersonalInfoCardRHFProps> = ({ className }) => {
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
        <CardTitle className="text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Title (Optional)</label>
          <Controller
            name="personal.title_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || 'no-title'}
                onValueChange={field.onChange}
                disabled={titlesLoading}
              >
                <SelectTrigger className="bg-[#1A1F28] border-[#40505C] text-white">
                  <SelectValue placeholder="Select title..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F28] border-[#40505C]">
                  <SelectItem value="no-title">
                    <span className="text-white">No title</span>
                  </SelectItem>
                  {!titlesLoading && titles.map((title) => (
                    <SelectItem key={title.id} value={title.id}>
                      <span className="text-white">{title.display_label}</span>
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

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              First Name <span className="text-red-400">*</span>
            </label>
            <Controller
              name="personal.first_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter first name"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('personal.first_name') && (
              <p className="text-red-400 text-sm">{getFieldError('personal.first_name')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Last Name <span className="text-red-400">*</span>
            </label>
            <Controller
              name="personal.last_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter last name"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
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
          <label className="text-sm font-medium text-gray-300">Preferred Name (Optional)</label>
          <Controller
            name="personal.preferred_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Enter preferred name"
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('personal.preferred_name') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.preferred_name')}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date of Birth (Optional)
          </label>
          <Controller
            name="personal.date_of_birth"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                type="date"
                className="bg-[#1A1F28] border-[#40505C] text-white"
              />
            )}
          />
          {getFieldError('personal.date_of_birth') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.date_of_birth')}</p>
          )}
        </div>

        {/* Gender and Pronouns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Gender (Optional)</label>
            <Controller
              name="personal.gender_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'no-gender'}
                  onValueChange={field.onChange}
                  disabled={gendersLoading}
                >
                  <SelectTrigger className="bg-[#1A1F28] border-[#40505C] text-white">
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1F28] border-[#40505C]">
                    <SelectItem value="no-gender">
                      <span className="text-white">Prefer not to say</span>
                    </SelectItem>
                    {!gendersLoading && genders.map((gender) => (
                      <SelectItem key={gender.id} value={gender.id}>
                        <span className="text-white">{gender.display_label}</span>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Pronouns (Optional)</label>
            <Controller
              name="personal.pronouns_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'no-pronoun'}
                  onValueChange={field.onChange}
                  disabled={pronounsLoading}
                >
                  <SelectTrigger className="bg-[#1A1F28] border-[#40505C] text-white">
                    <SelectValue placeholder="Select pronouns..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1F28] border-[#40505C]">
                    <SelectItem value="no-pronoun">
                      <span className="text-white">Prefer not to say</span>
                    </SelectItem>
                    {!pronounsLoading && pronouns.map((pronoun) => (
                      <SelectItem key={pronoun.id} value={pronoun.id}>
                        <span className="text-white">{pronoun.pronoun_value}</span>
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

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email (Optional)</label>
          <Controller
            name="personal.email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                type="email"
                placeholder="Enter email address"
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('personal.email') && (
            <p className="text-red-400 text-sm">{getFieldError('personal.email')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};