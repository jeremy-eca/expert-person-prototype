import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { MapPinIcon, HomeIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';

interface AddressInfoCardRHFProps {
  className?: string;
}

export const AddressInfoCardRHF: React.FC<AddressInfoCardRHFProps> = ({ className }) => {
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
          <HomeIcon className="w-5 h-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Address Name (Optional)
          </label>
          <Controller
            name="address.name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                placeholder="e.g., Home, Work, Primary Address"
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('address.name') && (
            <p className="text-red-400 text-sm">{getFieldError('address.name')}</p>
          )}
          <p className="text-xs text-gray-500">
            A descriptive name for this address
          </p>
        </div>

        {/* Address Lines */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4" />
              Address Line 1 (Optional)
            </label>
            <Controller
              name="address.line1"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter street address"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.line1') && (
              <p className="text-red-400 text-sm">{getFieldError('address.line1')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Address Line 2 (Optional)
            </label>
            <Controller
              name="address.line2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.line2') && (
              <p className="text-red-400 text-sm">{getFieldError('address.line2')}</p>
            )}
          </div>
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              City (Optional)
            </label>
            <Controller
              name="address.city"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter city"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.city') && (
              <p className="text-red-400 text-sm">{getFieldError('address.city')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              State/Province (Optional)
            </label>
            <Controller
              name="address.state"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter state/province"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.state') && (
              <p className="text-red-400 text-sm">{getFieldError('address.state')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Postal Code (Optional)
            </label>
            <Controller
              name="address.postcode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter postal code"
                  className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.postcode') && (
              <p className="text-red-400 text-sm">{getFieldError('address.postcode')}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Country (Optional)
          </label>
          <Controller
            name="address.country"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                placeholder="Enter country"
                className="bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('address.country') && (
            <p className="text-red-400 text-sm">{getFieldError('address.country')}</p>
          )}
          <p className="text-xs text-gray-500">
            You can also use the country autocomplete in the additional information section for enhanced features
          </p>
        </div>

        {/* Address Information Note */}
        <div className="mt-4 p-3 bg-[#1A1F28] border border-[#40505C] rounded-md">
          <p className="text-xs text-gray-400">
            <strong>Note:</strong> Address information is optional but helps with location-based services, 
            shipping, and emergency contacts. All fields support international address formats.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};