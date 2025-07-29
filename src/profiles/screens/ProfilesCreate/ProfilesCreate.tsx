import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '../../../shared/components/ui/button';
import { ArrowLeftIcon, SaveIcon, UserPlusIcon } from 'lucide-react';
import { ProfilesCreateProps } from './types/ProfilesCreateTypes';
import { useProfilesCreateFormRHF } from './hooks/useProfilesCreateFormRHF';
import { PersonalInfoCardRHF } from './components/PersonalInfoCardRHF';
import { ContactDetailsCardRHF } from './components/ContactDetailsCardRHF';
import { AddressInfoCardRHF } from './components/AddressInfoCardRHF';
import { AdditionalInfoCardRHF } from './components/AdditionalInfoCardRHF';

export const ProfilesCreate: React.FC<ProfilesCreateProps> = ({
  onPersonCreated,
  onCancel
}) => {
  const {
    form,
    isSubmitting,
    errors,
    hasRequiredFields,
    handleSubmit,
    reset
  } = useProfilesCreateFormRHF();

  const onSubmit = async (personId: string | null) => {
    if (personId && onPersonCreated) {
      onPersonCreated(personId);
    }
  };

  const handleFormSubmit = async () => {
    await handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-[#1A1F28] flex flex-col">
      {/* Header */}
      <div className="bg-[#252E38] border-b border-[#40505C] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-white hover:bg-[#2A3440] p-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">Create New Person Profile</h1>
                  <p className="text-gray-400 text-sm">
                    Fill in the information below to create a new person profile
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-white hover:bg-[#2A3440] border border-[#40505C]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                disabled={!hasRequiredFields || isSubmitting}
                className="text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Create Person
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Summary */}
          {errorCount > 0 && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">
                {errorCount === 1 
                  ? 'Please fix the validation error below.' 
                  : `Please fix ${errorCount} validation errors below.`
                }
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-400">Required fields:</span>
            <span className={`${hasRequiredFields ? 'text-green-400' : 'text-yellow-400'}`}>
              {hasRequiredFields ? 'Complete' : 'First Name and Last Name required'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Personal Information Card */}
            <PersonalInfoCardRHF />

            {/* Contact Details Card */}
            <ContactDetailsCardRHF />

            {/* Address Information Card */}
            <AddressInfoCardRHF />

            {/* Additional Information Card */}
            <AdditionalInfoCardRHF />

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 bg-[#1A1F28] pt-6 pb-4">
              <div className="flex items-center justify-between p-4 bg-[#252E38] rounded-xl border border-[#40505C]">
                <div className="text-white">
                  <p className="font-medium">Ready to create this person profile?</p>
                  <p className="text-gray-400 text-sm">
                    {hasRequiredFields 
                      ? 'All required information has been provided.' 
                      : 'Please complete the required fields first.'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="text-white hover:bg-[#2A3440] border border-[#40505C]"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFormSubmit}
                    disabled={!hasRequiredFields || isSubmitting}
                    className="text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Create Person
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </FormProvider>
  );
};