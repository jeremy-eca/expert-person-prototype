import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { PhoneIcon } from 'lucide-react';
import { FormCardProps } from '../types/ProfilesCreateTypes';

interface ContactDetailsCardProps extends FormCardProps {}

export const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const updateContact = (field: string, value: string) => {
    updateFormData({
      contact: {
        ...formData.contact,
        [field]: value
      }
    });
  };

  const hasError = (field: string) => !!errors[`contact.${field}`];
  const getError = (field: string) => errors[`contact.${field}`];

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center gap-3 p-6 pb-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <PhoneIcon className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-white text-lg font-medium">Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Email */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Work Email
            </label>
            <Input
              type="email"
              value={formData.contact.work_email}
              onChange={(e) => updateContact('work_email', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('work_email') ? 'border-red-500' : ''
              }`}
              placeholder="work.email@company.com"
            />
            {hasError('work_email') && (
              <p className="text-red-400 text-xs mt-1">{getError('work_email')}</p>
            )}
          </div>

          {/* Personal Email */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Personal Email
            </label>
            <Input
              type="email"
              value={formData.contact.personal_email}
              onChange={(e) => updateContact('personal_email', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('personal_email') ? 'border-red-500' : ''
              }`}
              placeholder="personal@email.com"
            />
            {hasError('personal_email') && (
              <p className="text-red-400 text-xs mt-1">{getError('personal_email')}</p>
            )}
          </div>

          {/* Work Phone */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Work Phone
            </label>
            <Input
              type="tel"
              value={formData.contact.work_phone}
              onChange={(e) => updateContact('work_phone', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('work_phone') ? 'border-red-500' : ''
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {hasError('work_phone') && (
              <p className="text-red-400 text-xs mt-1">{getError('work_phone')}</p>
            )}
          </div>

          {/* Mobile Phone */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Mobile Phone
            </label>
            <Input
              type="tel"
              value={formData.contact.mobile_phone}
              onChange={(e) => updateContact('mobile_phone', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('mobile_phone') ? 'border-red-500' : ''
              }`}
              placeholder="+1 (555) 987-6543"
            />
            {hasError('mobile_phone') && (
              <p className="text-red-400 text-xs mt-1">{getError('mobile_phone')}</p>
            )}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-gray-400 text-xs mt-4">
          Contact information helps colleagues and administrators reach you when needed.
        </p>
      </CardContent>
    </Card>
  );
};