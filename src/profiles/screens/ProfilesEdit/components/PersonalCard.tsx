import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Edit2Icon, SaveIcon, XIcon, Loader2Icon } from 'lucide-react';
import { ProfilesEditFormData } from '../schemas/profilesEditSchema';
import { FieldMetadata } from '../../../types/api.types';
import { PersonProfile } from '../../../types/frontend.types';
import { useTitles } from '../../../hooks/useTitles';
import { useGenders } from '../../../hooks/useGenders';
import { usePronouns } from '../../../hooks/usePronouns';

interface PersonalCardProps {
  profile: PersonProfile;
  fieldMetadata?: Record<string, FieldMetadata>;
  onProfileUpdate: (profile: PersonProfile, updateData?: Partial<PersonProfile>) => Promise<{ success: boolean; message: string }>;
  onDataRefresh?: () => Promise<void>;
  isNewPerson?: boolean;
}

export const PersonalCard: React.FC<PersonalCardProps> = ({
  profile,
  fieldMetadata,
  onProfileUpdate,
  onDataRefresh,
  isNewPerson = false,
}) => {
  const [isEditingPersonal, setIsEditingPersonal] = useState(isNewPerson);
  const [isSaving, setIsSaving] = useState(false);
  const { control, handleSubmit, watch, reset, formState } = useFormContext<ProfilesEditFormData>();
  const errors = formState?.errors || {};

  // Fetch reference data
  const { titles, isLoading: titlesLoading, error: titlesError } = useTitles();
  const { genders, isLoading: gendersLoading, error: gendersError } = useGenders();
  const { pronouns, isLoading: pronounsLoading, error: pronounsError } = usePronouns();

  // Watch current form values
  const firstNameValue = watch('personal.first_name');
  const lastNameValue = watch('personal.last_name');
  const preferredNameValue = watch('personal.preferred_name');
  const titleValue = watch('personal.title_id');
  const dateOfBirthValue = watch('personal.date_of_birth');
  const genderValue = watch('personal.gender_id');
  const pronounsValue = watch('personal.pronouns_id');

  // Helper function to get field labels from metadata
  const getFieldLabel = (field: string, defaultLabel: string): string => {
    return fieldMetadata?.[field]?.label || defaultLabel;
  };

  // Helper function to format display name
  const getDisplayName = (): string => {
    const firstName = firstNameValue || profile?.name?.split(" ")[0] || '';
    const lastName = lastNameValue || profile?.name?.split(" ").slice(1).join(" ") || '';
    const titleDisplay = getTitleDisplay();
    
    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) return 'No name provided';
    
    // If there's a title and it's not "No title specified", prepend it
    if (titleDisplay && titleDisplay !== 'No title specified') {
      return `${titleDisplay} ${fullName}`;
    }
    
    return fullName;
  };

  // Helper function to get title display
  const getTitleDisplay = (): string => {
    if (titleValue && titleValue !== 'no-title') {
      const title = titles?.find(t => t.id === titleValue);
      return title?.display_label || 'Unknown Title';
    }
    return 'No title specified';
  };

  // Helper function to get gender display
  const getGenderDisplay = (): string => {
    if (genderValue && genderValue !== 'no-gender') {
      const gender = genders?.find(g => g.id === genderValue);
      return gender?.display_label || 'Unknown Gender';
    }
    return 'No gender specified';
  };

  // Helper function to get pronouns display
  const getPronounsDisplay = (): string => {
    if (pronounsValue && pronounsValue !== 'no-pronouns') {
      const pronoun = pronouns?.find(p => p.id === pronounsValue);
      return pronoun?.display_label || 'Unknown Pronouns';
    }
    return 'No pronouns specified';
  };

  // Helper function to format date for API (yyyy-MM-dd)
  const formatDateForAPI = (dateString: string | undefined): string | undefined => {
    if (!dateString) return undefined;
    
    // If it's already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's an ISO string or other format, convert to yyyy-MM-dd
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return undefined;
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.warn('Failed to format date for API:', dateString, error);
      return undefined;
    }
  };

  const handleSavePersonal = handleSubmit(async (data) => {
    setIsSaving(true);
    
    try {
      // Prepare the updated profile data
      const updatedProfile: PersonProfile = {
        ...profile,
        name: `${data.personal.first_name || ''} ${data.personal.last_name || ''}`.trim(),
        dateOfBirth: formatDateForAPI(data.personal.date_of_birth) || profile.dateOfBirth,
      };
      
      // More debugging
      
      // Prepare the update data for API
      const updateData = {
        name: updatedProfile.name,
        preferredName: data.personal.preferred_name,
        dateOfBirth: formatDateForAPI(data.personal.date_of_birth),
        // Map form fields that aren't directly in PersonProfile but are in API
        titleId: data.personal.title_id,
        genderId: data.personal.gender_id,
        pronounsId: data.personal.pronouns_id,
      };
      
      
      // Call the API through onProfileUpdate
      const result = await onProfileUpdate(updatedProfile, updateData);
      
      if (result.success) {
        toast.success(
          'Personal information updated successfully!', 
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          }
        );
        
        // Refresh data to get updated reference values
        if (onDataRefresh) {
          await onDataRefresh();
        }
        
        setIsEditingPersonal(false);
      } else {
        throw new Error(result.message || 'Failed to update personal information');
      }
    } catch (error: any) {
      console.error('Failed to save personal information:', error);
      toast.error(
        error.message || 'Failed to update personal information. Please try again.',
        {
          duration: 6000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        }
      );
    } finally {
      setIsSaving(false);
    }
  });

  const handleCancelPersonal = () => {
    // Reset form values to original profile data
    const nameParts = profile?.name?.split(" ") || ['', ''];
    reset({
      personal: {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(" ") || '',
        preferred_name: '', // This would need to come from form context or API
        title_id: 'no-title', // This would need to come from form context or API
        date_of_birth: profile?.dateOfBirth || '',
        gender_id: 'no-gender', // This would need to come from form context or API
        pronouns_id: 'no-pronouns', // This would need to come from form context or API
      }
    });
    setIsEditingPersonal(false);
  };

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <CardTitle className="text-white text-lg font-medium">Personal</CardTitle>
        {!isEditingPersonal ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingPersonal(true)}
            className="text-white hover:bg-[#2A3440] p-2"
          >
            <Edit2Icon className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelPersonal}
              className="text-white hover:bg-[#2A3440] p-2"
            >
              <XIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSavePersonal}
              disabled={isSaving}
              className="text-white hover:bg-[#2A3440] p-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <SaveIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {!isEditingPersonal ? (
          // VIEW MODE
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Title</label>
              <p className="text-white font-medium">{getTitleDisplay()}</p>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <p className="text-white font-medium">{getDisplayName()}</p>
            </div>
            
            {preferredNameValue && (
              <div>
                <label className="text-gray-400 text-sm">Preferred Name</label>
                <p className="text-white font-medium">{preferredNameValue}</p>
              </div>
            )}
            
            {dateOfBirthValue && (
              <div>
                <label className="text-gray-400 text-sm">Date of Birth</label>
                <p className="text-white font-medium">{dateOfBirthValue}</p>
              </div>
            )}
            
            <div>
              <label className="text-gray-400 text-sm">Gender</label>
              <p className="text-white font-medium">{getGenderDisplay()}</p>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm">Pronouns</label>
              <p className="text-white font-medium">{getPronounsDisplay()}</p>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('title_id', 'Title')}
              </label>
              <Controller
                name="personal.title_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'no-title'} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A3440] border-[#40505C]">
                      <SelectItem value="no-title" className="text-white hover:bg-[#1A1F28]">
                        No title specified
                      </SelectItem>
                      {!titlesLoading && titles?.map((title) => (
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  {getFieldLabel('first_name', 'First Name')} *
                </label>
                <Controller
                  name="personal.first_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      placeholder="First name"
                    />
                  )}
                />
                {errors.personal?.first_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.personal.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  {getFieldLabel('last_name', 'Last Name')} *
                </label>
                <Controller
                  name="personal.last_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      placeholder="Last name"
                    />
                  )}
                />
                {errors.personal?.last_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.personal.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('preferred_name', 'Preferred Name')}
              </label>
              <Controller
                name="personal.preferred_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    placeholder="Preferred name (optional)"
                  />
                )}
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('date_of_birth', 'Date of Birth')}
              </label>
              <Controller
                name="personal.date_of_birth"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={formatDateForAPI(field.value) || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="date"
                    className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                  />
                )}
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('gender_id', 'Gender')}
              </label>
              <Controller
                name="personal.gender_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'no-gender'} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A3440] border-[#40505C]">
                      <SelectItem value="no-gender" className="text-white hover:bg-[#1A1F28]">
                        No gender specified
                      </SelectItem>
                      {!gendersLoading && genders?.map((gender) => (
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
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('pronouns_id', 'Pronouns')}
              </label>
              <Controller
                name="personal.pronouns_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'no-pronouns'} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400">
                      <SelectValue placeholder="Select pronouns" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A3440] border-[#40505C]">
                      <SelectItem value="no-pronouns" className="text-white hover:bg-[#1A1F28]">
                        No pronouns specified
                      </SelectItem>
                      {!pronounsLoading && pronouns?.map((pronoun) => (
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};