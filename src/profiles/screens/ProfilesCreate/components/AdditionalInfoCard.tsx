import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { LanguageEditor } from '../../../components/ui/language-editor';
import { NationalityAutocomplete } from '../../../components/ui/nationality-autocomplete';
import { InfoIcon } from 'lucide-react';
import { FormCardProps } from '../types/ProfilesCreateTypes';

interface AdditionalInfoCardProps extends FormCardProps {}

export const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const updateAdditional = (field: string, value: any) => {
    updateFormData({
      additional: {
        ...formData.additional,
        [field]: value
      }
    });
  };


  const hasError = (field: string) => !!errors[`additional.${field}`];
  const getError = (field: string) => errors[`additional.${field}`];

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center gap-3 p-6 pb-4">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          <InfoIcon className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-white text-lg font-medium">Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          {/* Bio */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Bio
            </label>
            <Textarea
              value={formData.additional.bio}
              onChange={(e) => updateAdditional('bio', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 min-h-[120px] resize-none ${
                hasError('bio') ? 'border-red-500' : ''
              }`}
              placeholder="Tell us about yourself, your background, interests, and experience..."
            />
            {hasError('bio') && (
              <p className="text-red-400 text-xs mt-1">{getError('bio')}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Share a brief overview of your professional background and interests.
            </p>
          </div>

          {/* Employee ID */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Employee ID
            </label>
            <Input
              value={formData.additional.employee_id || ''}
              onChange={(e) => updateAdditional('employee_id', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('employee_id') ? 'border-red-500' : ''
              }`}
              placeholder="e.g., EMP001, 12345, JDOE2024"
            />
            {hasError('employee_id') && (
              <p className="text-red-400 text-xs mt-1">{getError('employee_id')}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Optional employee identifier or badge number for organizational systems.
            </p>
          </div>

          {/* Languages */}
          <div>
            <label className="text-white text-sm font-medium mb-3 block">
              Languages
            </label>
            <div className="bg-[#2A3440] border border-[#40505C] rounded-md p-4">
              <LanguageEditor
                languages={formData.additional.languages}
                onLanguagesChange={(languages) => updateAdditional('languages', languages)}
                className="language-editor-dark"
              />
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Add languages you speak and your proficiency level in each.
            </p>
          </div>

          {/* Nationalities */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Nationalities
            </label>
            <NationalityAutocomplete
              selectedNationalities={formData.additional.nationalities}
              onNationalitiesChange={(nationalities) => updateAdditional('nationalities', nationalities)}
              error={hasError('nationalities')}
              placeholder="Search and select nationalities..."
              className="w-full"
            />
            {hasError('nationalities') && (
              <p className="text-red-400 text-xs mt-1">{getError('nationalities')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};