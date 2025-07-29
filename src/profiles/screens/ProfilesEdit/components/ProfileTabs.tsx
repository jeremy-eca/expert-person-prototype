import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '../../../../shared/components/ui/button';
import { SaveIcon, UserIcon, FileTextIcon } from 'lucide-react';
import { PersonalInfoTab } from './PersonalInfoTab';
import { BioInfoTab } from './BioInfoTab';
import { useProfilesEditForm } from '../hooks/useProfilesEditForm';
import { PersonProfile } from '../../../types/frontend.types';
import { PersonProfileCreateRequest } from '../../../types/api.types';

type TabType = 'personal' | 'bio';

interface ProfileTabsProps {
  profile?: PersonProfile;
  onProfileUpdate?: (profile: PersonProfile) => void;
  onProfileCreate?: (profileData: PersonProfileCreateRequest) => Promise<string>;
  onPersonCreated?: (personId: string) => void;
  isNewPerson?: boolean;
  className?: string;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  onProfileUpdate,
  onProfileCreate,
  onPersonCreated,
  isNewPerson = false,
  className
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  const {
    form,
    isSubmitting,
    errors,
    hasRequiredFields,
    handleSubmit,
    isDirty,
    isValid
  } = useProfilesEditForm({
    profile,
    onProfileUpdate,
    onProfileCreate,
    onPersonCreated,
    isNewPerson
  });

  const tabs = [
    {
      id: 'personal' as TabType,
      label: 'Personal',
      icon: UserIcon,
      description: 'Basic personal information',
    },
    {
      id: 'bio' as TabType,
      label: 'Bio',
      icon: FileTextIcon,
      description: 'Biography and additional details',
    },
  ];

  const handleSave = () => {
    handleSubmit((success) => {
      if (success) {
        console.log('Profile saved successfully');
      }
    });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <FormProvider {...form}>
      <div className={`space-y-6 ${className || ''}`}>
        {/* Tab Navigation */}
        <div className="bg-[#252E38] border border-[#40505C] rounded-xl p-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 flex-1
                    ${isActive 
                      ? 'bg-[#1D252D] text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2A3440]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Status Bar */}
        <div className="flex items-center justify-between p-4 bg-[#252E38] border border-[#40505C] rounded-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hasRequiredFields ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-sm text-gray-300">
                {hasRequiredFields ? 'Required fields complete' : 'Required: First Name, Last Name'}
              </span>
            </div>
            
            {isDirty && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-blue-300">Unsaved changes</span>
              </div>
            )}

            {errorCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm text-red-300">
                  {errorCount} validation error{errorCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasRequiredFields || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4 mr-2" />
                {isNewPerson ? 'Create Person' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>

        {/* Error Summary */}
        {errorCount > 0 && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
            <p className="text-red-400 text-sm">
              {errorCount === 1 
                ? 'Please fix the validation error in the form.' 
                : `Please fix ${errorCount} validation errors in the form.`
              }
            </p>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'personal' && <PersonalInfoTab />}
          {activeTab === 'bio' && <BioInfoTab />}
        </div>

        {/* Bottom Action Bar (Duplicate for convenience) */}
        <div className="sticky bottom-0 bg-[#1D252D] pt-4">
          <div className="flex items-center justify-between p-4 bg-[#252E38] rounded-xl border border-[#40505C]">
            <div className="text-white">
              <p className="font-medium">
                {isNewPerson ? 'Ready to create this person profile?' : 'Ready to save your changes?'}
              </p>
              <p className="text-gray-400 text-sm">
                {hasRequiredFields 
                  ? 'All required information has been provided.' 
                  : 'Please complete the required fields first.'
                }
              </p>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={!hasRequiredFields || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed px-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isNewPerson ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4 mr-2" />
                  {isNewPerson ? 'Create Person' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};