import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Badge } from '../../../../shared/components/ui/badge';
import { Edit2Icon, SaveIcon, XIcon } from 'lucide-react';
import { NationalityAutocomplete } from '../../../components/ui/nationality-autocomplete';
import { LanguageAutocomplete } from '../../../components/ui/language-autocomplete';
import { ProfilesEditFormData } from '../schemas/profilesEditSchema';
import { FieldMetadata } from '../../../types/api.types';
import { PersonProfile } from '../../../types/frontend.types';

interface BioCardProps {
  profile: PersonProfile;
  fieldMetadata?: Record<string, FieldMetadata>;
  onProfileUpdate: (profile: PersonProfile) => void;
}

export const BioCard: React.FC<BioCardProps> = ({
  profile,
  fieldMetadata,
  onProfileUpdate,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { control, handleSubmit, watch, reset, formState } = useFormContext<ProfilesEditFormData>();
  const errors = formState?.errors || {};

  // Watch current form values
  const bioValue = watch('bio.bio');
  const nationalitiesValue = watch('bio.nationalities');
  const languagesValue = watch('bio.languages');

  // Helper function to get field labels from metadata
  const getFieldLabel = (field: string, defaultLabel: string): string => {
    return fieldMetadata?.[field]?.label || defaultLabel;
  };

  // Helper function to get nationality flags
  const getNationalityFlag = (nationality: string): string => {
    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'China': '🇨🇳',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'India': '🇮🇳',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Switzerland': '🇨🇭'
    };
    return flagMap[nationality] || '🏳️';
  };

  const handleSaveBio = handleSubmit((data) => {
    // Update the profile with new bio data
    // Convert nationality objects to string array for profile storage
    const nationalitiesArray = Array.isArray(data.bio.nationalities) 
      ? data.bio.nationalities.map(nat => nat.display_label).filter(Boolean)
      : [];
    
    // Convert language objects to LanguageSkill format for profile storage
    const languagesArray = Array.isArray(data.bio.languages) 
      ? data.bio.languages.map(lang => ({
          id: `lang_${Date.now()}_${Math.random()}`,
          language: lang.display_label,
          proficiency: lang.proficiency as 'Basic' | 'Conversational' | 'Professional' | 'Native',
          isPrimary: false,
          dateAdded: new Date().toISOString()
        }))
      : [];
    
    onProfileUpdate({
      ...profile,
      bio: data.bio.bio || '',
      nationalities: nationalitiesArray,
      languages: languagesArray
    });
    setIsEditingBio(false);
  });

  const handleCancelBio = () => {
    // Reset form values to original profile data
    // Convert profile nationalities (string array) to nationality objects
    const nationalitiesArray = Array.isArray(profile?.nationalities) 
      ? profile.nationalities.map(nat => ({ id: '', display_label: nat }))
      : [];
    
    // Convert profile languages (LanguageSkill array) to language objects
    const languagesArray = Array.isArray(profile?.languages) 
      ? profile.languages.map(lang => ({
          code: lang.language.toLowerCase().replace(/\s+/g, '_'),
          display_label: lang.language,
          proficiency: lang.proficiency
        }))
      : [];
    
    reset({
      bio: {
        bio: profile?.bio || '',
        nationalities: nationalitiesArray,
        languages: languagesArray
      }
    });
    setIsEditingBio(false);
  };

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <CardTitle className="text-white text-lg font-medium">
          {getFieldLabel('bio', 'Bio')}
        </CardTitle>
        {!isEditingBio ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingBio(true)}
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
              onClick={handleCancelBio}
              className="text-white hover:bg-[#2A3440] p-2"
            >
              <XIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveBio}
              className="text-white hover:bg-[#2A3440] p-2"
            >
              <SaveIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {!isEditingBio ? (
          // VIEW MODE
          <div className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {getFieldLabel('bio', 'Bio')}
              </label>
              <p className="text-white leading-relaxed">
                {profile?.bio || 'No bio provided'}
              </p>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-3 block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {profile?.languages && profile.languages.length > 0 ? (
                  profile.languages.map((lang, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-400 border-0">
                      {lang.language} - {lang.proficiency}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No languages specified</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-3 block">Nationalities</label>
              <div className="flex flex-wrap gap-2">
                {nationalitiesValue && Array.isArray(nationalitiesValue) && nationalitiesValue.length > 0 ? (
                  nationalitiesValue.map((nationality, index) => (
                    <Badge key={index} className="bg-green-500/20 text-green-400 border-0">
                      {getNationalityFlag(nationality.display_label)} {nationality.display_label}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No nationalities specified</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="space-y-6">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {getFieldLabel('bio', 'Bio')}
              </label>
              <Controller
                name="bio.bio"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 min-h-[120px]"
                    placeholder="Enter bio..."
                  />
                )}
              />
              {errors.bio?.bio && (
                <p className="text-red-400 text-sm mt-1">{errors.bio.bio.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Languages
              </label>
              <Controller
                name="bio.languages"
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
              {errors.bio?.languages && (
                <p className="text-red-400 text-sm mt-1">{errors.bio.languages.message}</p>
              )}
            </div>
            
            {/* Nationalities Section */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Nationalities
              </label>
              <Controller
                name="bio.nationalities"
                control={control}
                render={({ field }) => (
                  <NationalityAutocomplete
                    selectedNationalities={field.value || []}
                    onNationalitiesChange={field.onChange}
                    placeholder="Search and select nationalities..."
                    className="bg-[#1A1F28] border-[#40505C]"
                  />
                )}
              />
              {errors.bio?.nationalities && (
                <p className="text-red-400 text-sm mt-1">{errors.bio.nationalities.message}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};