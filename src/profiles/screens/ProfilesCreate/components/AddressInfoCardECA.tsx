import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardBody, CardHeader, TextInput, Select, Label } from '@ecainternational/eca-components';
import { MapPinIcon, GlobeIcon } from 'lucide-react';
import { ProfilesCreateFormData } from '../../../schemas/profilesCreateSchema';
import { useCountries } from '../../../hooks/useCountries';

interface AddressInfoCardECAProps {
  className?: string;
}

export const AddressInfoCardECA: React.FC<AddressInfoCardECAProps> = ({ className }) => {
  const { 
    control, 
    formState: { errors },
    watch
  } = useFormContext<ProfilesCreateFormData>();
  
  const { countries, isLoading: countriesLoading } = useCountries();

  // Helper function to get error message for nested fields
  const getFieldError = (field: string) => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  return (
    <Card className={`bg-[#252E38] border-[#40505C] ${className || ''}`}>
      <CardHeader className="pb-4">
        <h3 className="text-white flex items-center gap-2 text-lg font-semibold">
          <MapPinIcon className="w-5 h-5" />
          Address Information
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Address Name */}
        <div className="space-y-2">
          <Label htmlFor="address-name" className="text-sm font-medium text-gray-300">
            Address Name (Optional)
          </Label>
          <Controller
            name="address.name"
            control={control}
            render={({ field }) => (
              <TextInput
                id="address-name"
                name="address_name"
                value={field.value || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                placeholder="e.g., Home, Work, Primary"
                state={getFieldError('address.name') ? 'error' : 'default'}
                variant="outline"
                className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
              />
            )}
          />
          {getFieldError('address.name') && (
            <p className="text-red-400 text-sm">{getFieldError('address.name')}</p>
          )}
        </div>

        {/* Address Lines */}
        <div className="space-y-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="address-line-1" className="text-sm font-medium text-gray-300">
              Address Line 1 (Optional)
            </Label>
            <Controller
              name="address.line1"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="address-line-1"
                  name="address_line_1"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Street address, P.O. box, company name"
                  state={getFieldError('address.line1') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.line1') && (
              <p className="text-red-400 text-sm">{getFieldError('address.line1')}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="address-line-2" className="text-sm font-medium text-gray-300">
              Address Line 2 (Optional)
            </Label>
            <Controller
              name="address.line2"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="address-line-2"
                  name="address_line_2"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor"
                  state={getFieldError('address.line2') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.line2') && (
              <p className="text-red-400 text-sm">{getFieldError('address.line2')}</p>
            )}
          </div>
        </div>

        {/* City, State, Postal Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-300">
              City (Optional)
            </Label>
            <Controller
              name="address.city"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="city"
                  name="city"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="Enter city"
                  state={getFieldError('address.city') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.city') && (
              <p className="text-red-400 text-sm">{getFieldError('address.city')}</p>
            )}
          </div>

          {/* State/Province */}
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-300">
              State/Province (Optional)
            </Label>
            <Controller
              name="address.state"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="state"
                  name="state_province"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="State or province"
                  state={getFieldError('address.state') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
                />
              )}
            />
            {getFieldError('address.state') && (
              <p className="text-red-400 text-sm">{getFieldError('address.state')}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal-code" className="text-sm font-medium text-gray-300">
              Postal Code (Optional)
            </Label>
            <Controller
              name="address.postcode"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="postal-code"
                  name="postal_code"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                  placeholder="ZIP or postal code"
                  state={getFieldError('address.postcode') ? 'error' : 'default'}
                  variant="outline"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white placeholder-gray-500"
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
          <Label htmlFor="country-select" className="text-sm font-medium text-gray-300">
            Country (Optional)
          </Label>
          <Controller
            name="address.country"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Select
                  id="country-select"
                  name="country_id"
                  value={field.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => field.onChange(e.target.value || null)}
                  state={getFieldError('address.country') ? 'error' : 'default'}
                  variant="outline"
                  size="medium"
                  className="w-full bg-[#1A1F28] border-[#40505C] text-white pl-10"
                  disabled={countriesLoading}
                >
                  <option value="">Select a country...</option>
                  {countries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.display_label}
                    </option>
                  ))}
                </Select>
                <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          />
          {getFieldError('address.country') && (
            <p className="text-red-400 text-sm">{getFieldError('address.country')}</p>
          )}
        </div>

        {/* Address Note */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
          <p className="text-yellow-300 text-sm">
            📍 <strong>Note:</strong> Address information is optional but can be helpful for location-based services and verification.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};