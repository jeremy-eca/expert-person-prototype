import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Label } from '../../../../shared/components/ui/label';
import { FileTextIcon, BadgeIcon, GlobeIcon } from 'lucide-react';
import { ProfilesEditFormData } from '../schemas/profilesEditSchema';

interface BioInfoTabProps {
  className?: string;
}

export const BioInfoTab: React.FC<BioInfoTabProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch 
  } = useFormContext<ProfilesEditFormData>();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  // Watch bio field for character count
  const bioText = watch('bio.bio') || '';

  return (
    <Card className={`bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026] ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <FileTextIcon className="w-5 h-5 text-white" />
          <CardTitle className="text-white text-lg font-medium">Biography & Additional Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 space-y-6">
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
            Biography (Optional)
          </Label>
          <Controller
            name="bio.bio"
            control={control}
            render={({ field }) => (
              <Textarea
                id="bio"
                {...field}
                placeholder="Enter biography or professional summary..."
                className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 min-h-[120px] resize-y"
                maxLength={1000}
              />
            )}
          />
          {getFieldError('bio.bio') && (
            <p className="text-red-400 text-sm">{getFieldError('bio.bio')}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-xs">
              Share professional background, expertise, or key achievements
            </p>
            <p className="text-gray-500 text-xs">
              {bioText.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <Label htmlFor="employee-id" className="text-sm font-medium text-gray-300">
            Employee ID (Optional)
          </Label>
          <Controller
            name="bio.employee_id"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  id="employee-id"
                  {...field}
                  placeholder="Enter employee ID"
                  className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
                />
                <BadgeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            )}
          />
          {getFieldError('bio.employee_id') && (
            <p className="text-red-400 text-sm">{getFieldError('bio.employee_id')}</p>
          )}
        </div>

        {/* Nationalities */}
        <div className="space-y-2">
          <Label htmlFor="nationalities" className="text-sm font-medium text-gray-300">
            Nationalities (Optional)
          </Label>
          <Controller
            name="bio.nationalities"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  id="nationalities"
                  {...field}
                  placeholder="Enter nationalities (comma-separated)"
                  className="w-full bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
                />
                <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            )}
          />
          {getFieldError('bio.nationalities') && (
            <p className="text-red-400 text-sm">{getFieldError('bio.nationalities')}</p>
          )}
          <p className="text-gray-500 text-xs">
            Enter multiple nationalities separated by commas (e.g., "American, British, Canadian")
          </p>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Bio Tips */}
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <h4 className="text-green-300 text-sm font-medium mb-2">💡 Bio Tips</h4>
            <ul className="text-green-300 text-xs space-y-1">
              <li>• Include key professional achievements</li>
              <li>• Mention areas of expertise</li>
              <li>• Add relevant certifications</li>
              <li>• Keep it concise and professional</li>
            </ul>
          </div>

          {/* Additional Info */}
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
            <h4 className="text-purple-300 text-sm font-medium mb-2">📝 Additional Info</h4>
            <ul className="text-purple-300 text-xs space-y-1">
              <li>• Employee ID helps with HR systems</li>
              <li>• Nationalities support global mobility</li>
              <li>• All fields are optional but helpful</li>
              <li>• Information can be updated anytime</li>
            </ul>
          </div>
        </div>

        {/* Form Status */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-blue-300 text-sm">
            ✨ <strong>Optional Information:</strong> This section helps create a more comprehensive profile 
            for better team collaboration and organizational management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};