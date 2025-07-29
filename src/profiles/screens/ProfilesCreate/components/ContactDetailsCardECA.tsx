import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardBody, CardHeader, TextInput, Label } from '@ecainternational/eca-components';
import { PhoneIcon, MailIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';

interface ContactDetailsCardECAProps {
  className?: string;
}

export const ContactDetailsCardECA: React.FC<ContactDetailsCardECAProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors } 
  } = useFormContext<ProfilesCreateFormData>();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <h3 className="text-white flex items-center gap-2 text-lg font-semibold">
          <PhoneIcon className="w-5 h-5" />
          Contact Details
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Email Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Email */}
          <div className="space-y-2">
            <Label htmlFor="work-email" className="text-sm font-medium text-gray-300">
              Work Email (Optional)
            </Label>
            <Controller
              name="contact.work_email"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextInput
                    id="work-email"
                    name="work_email"
                    type="email"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                    placeholder="Enter work email address"
                    state={getFieldError('contact.work_email') ? 'error' : 'default'}
                    variant="outline"
                    className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 pl-10"
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              )}
            />
            {getFieldError('contact.work_email') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.work_email')}</p>
            )}
          </div>

          {/* Personal Email */}
          <div className="space-y-2">
            <Label htmlFor="personal-email" className="text-sm font-medium text-gray-300">
              Personal Email (Optional)
            </Label>
            <Controller
              name="contact.personal_email"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextInput
                    id="personal-email"
                    name="personal_email"
                    type="email"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                    placeholder="Enter personal email address"
                    state={getFieldError('contact.personal_email') ? 'error' : 'default'}
                    variant="outline"
                    className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 pl-10"
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              )}
            />
            {getFieldError('contact.personal_email') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.personal_email')}</p>
            )}
          </div>
        </div>

        {/* Phone Number Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Phone */}
          <div className="space-y-2">
            <Label htmlFor="work-phone" className="text-sm font-medium text-gray-300">
              Work Phone (Optional)
            </Label>
            <Controller
              name="contact.work_phone_number"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextInput
                    id="work-phone"
                    name="work_phone_number"
                    type="tel"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                    placeholder="Enter work phone number"
                    state={getFieldError('contact.work_phone_number') ? 'error' : 'default'}
                    variant="outline"
                    className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 pl-10"
                  />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              )}
            />
            {getFieldError('contact.work_phone_number') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.work_phone_number')}</p>
            )}
          </div>

          {/* Personal Phone */}
          <div className="space-y-2">
            <Label htmlFor="personal-phone" className="text-sm font-medium text-gray-300">
              Personal Phone (Optional)
            </Label>
            <Controller
              name="contact.personal_phone_number"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <TextInput
                    id="personal-phone"
                    name="personal_phone_number"
                    type="tel"
                    value={field.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                    placeholder="Enter personal phone number"
                    state={getFieldError('contact.personal_phone_number') ? 'error' : 'default'}
                    variant="outline"
                    className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500 pl-10"
                  />
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              )}
            />
            {getFieldError('contact.personal_phone_number') && (
              <p className="text-red-400 text-sm">{getFieldError('contact.personal_phone_number')}</p>
            )}
          </div>
        </div>

        {/* Contact Preference Note */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Adding contact information helps with communication and verification processes.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};