import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { PhoneIcon, MailIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';

interface ContactDetailsCardRHFProps {
  className?: string;
}

export const ContactDetailsCardRHF: React.FC<ContactDetailsCardRHFProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
  } = useFormContext<ProfilesCreateFormData>();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <PhoneIcon className="w-5 h-5" />
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              Work Email (Optional)
            </label>
            <Controller
              name="contact.work_email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  type="email"
                  placeholder="Enter work email"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('contact.work_email') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.work_email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              Personal Email (Optional)
            </label>
            <Controller
              name="contact.personal_email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  type="email"
                  placeholder="Enter personal email"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('contact.personal_email') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.personal_email')}</p>
            )}
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              Work Phone (Optional)
            </label>
            <Controller
              name="contact.work_phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  type="tel"
                  placeholder="Enter work phone"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('contact.work_phone') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.work_phone')}</p>
            )}
            <p className="text-xs text-gray-500">
              Format: +1 (555) 123-4567 or similar
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              Mobile Phone (Optional)
            </label>
            <Controller
              name="contact.mobile_phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  type="tel"
                  placeholder="Enter mobile phone"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('contact.mobile_phone') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.mobile_phone')}</p>
            )}
            <p className="text-xs text-gray-500">
              Format: +1 (555) 123-4567 or similar
            </p>
          </div>
        </div>

        {/* Contact Information Note */}
        <div className="mt-4 p-3 bg-[#1A1F28] border border-[#40505C] rounded-md">
          <p className="text-xs text-gray-400">
            <strong>Note:</strong> Contact information helps with communication and account recovery. 
            Work email will be used as the primary contact method if no personal email is provided in the personal information section.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};