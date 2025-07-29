import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { UserIcon, CalendarIcon } from 'lucide-react';
import { FormCardProps } from '../types/ProfilesCreateTypes';
import { useTitles } from '../../../hooks/useTitles';
import { useGenders } from '../../../hooks/useGenders';
import { usePronouns } from '../../../hooks/usePronouns';

interface PersonalInfoCardProps extends FormCardProps {}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const { titles, isLoading: titlesLoading } = useTitles();
  const { genders, isLoading: gendersLoading } = useGenders();
  const { pronouns, isLoading: pronounsLoading } = usePronouns();

  const updatePersonal = (field: string, value: string) => {
    updateFormData({
      personal: {
        ...formData.personal,
        [field]: value
      }
    });
  };

  const hasError = (field: string) => !!errors[`personal.${field}`];
  const getError = (field: string) => errors[`personal.${field}`];

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center gap-3 p-6 pb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-white text-lg font-medium">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title Dropdown */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Title
            </label>
            <Select 
              value={formData.personal.title_id} 
              onValueChange={(value) => updatePersonal('title_id', value)}
            >
              <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white">
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A3440] border-[#40505C]">
                <SelectItem value="no-title">No Title</SelectItem>
                {!titlesLoading && titles.map((title) => (
                  <SelectItem key={title.id} value={title.id}>
                    <span className="text-white">{title.title_value}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* First Name */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              First Name *
            </label>
            <Input
              value={formData.personal.first_name}
              onChange={(e) => updatePersonal('first_name', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('first_name') ? 'border-red-500' : ''
              }`}
              placeholder="Enter first name"
            />
            {hasError('first_name') && (
              <p className="text-red-400 text-xs mt-1">{getError('first_name')}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Last Name *
            </label>
            <Input
              value={formData.personal.last_name}
              onChange={(e) => updatePersonal('last_name', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('last_name') ? 'border-red-500' : ''
              }`}
              placeholder="Enter last name"
            />
            {hasError('last_name') && (
              <p className="text-red-400 text-xs mt-1">{getError('last_name')}</p>
            )}
          </div>

          {/* Preferred Name */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Preferred Name
            </label>
            <Input
              value={formData.personal.preferred_name}
              onChange={(e) => updatePersonal('preferred_name', e.target.value)}
              className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
              placeholder="Enter preferred name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Date of Birth
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.personal.date_of_birth}
                onChange={(e) => updatePersonal('date_of_birth', e.target.value)}
                className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                  hasError('date_of_birth') ? 'border-red-500' : ''
                }`}
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {hasError('date_of_birth') && (
              <p className="text-red-400 text-xs mt-1">{getError('date_of_birth')}</p>
            )}
          </div>

          {/* Gender at Birth */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Gender at Birth
            </label>
            <Select 
              value={formData.personal.gender_id} 
              onValueChange={(value) => updatePersonal('gender_id', value)}
            >
              <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A3440] border-[#40505C]">
                <SelectItem value="no-gender">Prefer not to say</SelectItem>
                {!gendersLoading && genders.map((gender) => (
                  <SelectItem key={gender.id} value={gender.id}>
                    <span className="text-white">{gender.gender_value}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pronouns */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Pronouns
            </label>
            <Select 
              value={formData.personal.pronouns_id} 
              onValueChange={(value) => updatePersonal('pronouns_id', value)}
            >
              <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A3440] border-[#40505C]">
                <SelectItem value="no-pronoun">Prefer not to say</SelectItem>
                {!pronounsLoading && pronouns.map((pronoun) => (
                  <SelectItem key={pronoun.id} value={pronoun.id}>
                    <span className="text-white">{pronoun.pronoun_value}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email - Full Width */}
          <div className="md:col-span-2">
            <label className="text-white text-sm font-medium mb-2 block">
              Email
            </label>
            <Input
              type="email"
              value={formData.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('email') ? 'border-red-500' : ''
              }`}
              placeholder="Enter email address"
            />
            {hasError('email') && (
              <p className="text-red-400 text-xs mt-1">{getError('email')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};