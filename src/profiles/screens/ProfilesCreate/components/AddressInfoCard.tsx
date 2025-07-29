import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Input } from '../../../../shared/components/ui/input';
import { CountryAutocomplete } from '../../../components/ui/country-autocomplete';
import { MapPinIcon } from 'lucide-react';
import { FormCardProps } from '../types/ProfilesCreateTypes';

interface AddressInfoCardProps extends FormCardProps {}

export const AddressInfoCard: React.FC<AddressInfoCardProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const updateAddress = (field: string, value: string) => {
    updateFormData({
      address: {
        ...formData.address,
        [field]: value
      }
    });
  };

  const hasError = (field: string) => !!errors[`address.${field}`];
  const getError = (field: string) => errors[`address.${field}`];

  return (
    <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
      <CardHeader className="flex flex-row items-center gap-3 p-6 pb-4">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <MapPinIcon className="w-5 h-5 text-white" />
        </div>
        <CardTitle className="text-white text-lg font-medium">Current Address</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {/* Address Name - Full Width */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Address Name
            </label>
            <Input
              value={formData.address.name}
              onChange={(e) => updateAddress('name', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('name') ? 'border-red-500' : ''
              }`}
              placeholder="e.g., Home Address, Work Address"
            />
            {hasError('name') && (
              <p className="text-red-400 text-xs mt-1">{getError('name')}</p>
            )}
          </div>

          {/* Address Line 1 - Full Width */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Address Line 1
            </label>
            <Input
              value={formData.address.line1}
              onChange={(e) => updateAddress('line1', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('line1') ? 'border-red-500' : ''
              }`}
              placeholder="Street address, P.O. Box, Company name"
            />
            {hasError('line1') && (
              <p className="text-red-400 text-xs mt-1">{getError('line1')}</p>
            )}
          </div>

          {/* Address Line 2 - Full Width */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Address Line 2
            </label>
            <Input
              value={formData.address.line2}
              onChange={(e) => updateAddress('line2', e.target.value)}
              className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                hasError('line2') ? 'border-red-500' : ''
              }`}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
            {hasError('line2') && (
              <p className="text-red-400 text-xs mt-1">{getError('line2')}</p>
            )}
          </div>

          {/* City, State, Postal Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                City
              </label>
              <Input
                value={formData.address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                  hasError('city') ? 'border-red-500' : ''
                }`}
                placeholder="City"
              />
              {hasError('city') && (
                <p className="text-red-400 text-xs mt-1">{getError('city')}</p>
              )}
            </div>

            {/* State/Province */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                State/Province
              </label>
              <Input
                value={formData.address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                  hasError('state') ? 'border-red-500' : ''
                }`}
                placeholder="State/Province"
              />
              {hasError('state') && (
                <p className="text-red-400 text-xs mt-1">{getError('state')}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Postal Code
              </label>
              <Input
                value={formData.address.postcode}
                onChange={(e) => updateAddress('postcode', e.target.value)}
                className={`bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 ${
                  hasError('postcode') ? 'border-red-500' : ''
                }`}
                placeholder="12345"
              />
              {hasError('postcode') && (
                <p className="text-red-400 text-xs mt-1">{getError('postcode')}</p>
              )}
            </div>
          </div>

          {/* Country - Enhanced Autocomplete */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Country
            </label>
            <CountryAutocomplete
              value={formData.address.country}
              onValueChange={(value) => updateAddress('country', value)}
              onCountrySelect={(country) => {
                // Optional: store additional country data for validation
                if (country) {
                  console.log('Selected country:', country);
                }
              }}
              error={hasError('country')}
              placeholder="Search for country..."
              className="w-full" // Override the fixed width for full width
            />
            {hasError('country') && (
              <p className="text-red-400 text-xs mt-1">{getError('country')}</p>
            )}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-gray-400 text-xs mt-4">
          Address information is optional but helps with location-based services and delivery.
        </p>
      </CardContent>
    </Card>
  );
};