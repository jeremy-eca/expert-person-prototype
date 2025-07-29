import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { 
  profilesCreateFormSchema, 
  ProfilesCreateFormData, 
  defaultProfilesCreateFormData 
} from '../../../schemas/profilesCreateSchema';
import { PersonProfileCreateRequest, LanguageObject, ContactObject } from '../../../types/api.types';
import { usePersonData } from '../../../hooks/usePersonData';
import { LanguageSkill } from '../../../types/frontend.types';

// Language name to ISO code mapping for common languages
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'English': 'en',
  'Spanish': 'es', 
  'French': 'fr',
  'German': 'de',
  'Italian': 'it',
  'Portuguese': 'pt',
  'Dutch': 'nl',
  'Russian': 'ru',
  'Chinese': 'zh',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Arabic': 'ar',
  'Hindi': 'hi',
  'Bengali': 'bn',
  'Urdu': 'ur',
  'Turkish': 'tr',
  'Polish': 'pl',
  'Swedish': 'sv',
  'Norwegian': 'no',
  'Danish': 'da',
  'Finnish': 'fi',
  'Greek': 'el',
  'Hebrew': 'he',
  'Thai': 'th',
  'Vietnamese': 'vi',
  'Indonesian': 'id',
  'Malay': 'ms',
  'Tagalog': 'tl',
  'Swahili': 'sw',
  'Czech': 'cs',
  'Hungarian': 'hu',
  'Romanian': 'ro',
  'Bulgarian': 'bg',
  'Croatian': 'hr',
  'Serbian': 'sr',
  'Slovak': 'sk',
  'Slovenian': 'sl',
  'Lithuanian': 'lt',
  'Latvian': 'lv',
  'Estonian': 'et',
  'Ukrainian': 'uk',
};

/**
 * Helper function to convert language name to ISO code
 */
function getLanguageCode(languageName: string): string {
  return LANGUAGE_CODE_MAP[languageName] || languageName.toLowerCase().substring(0, 2);
}

/**
 * Helper function to build API payload from form data
 */
function buildApiPayload(formData: ProfilesCreateFormData): PersonProfileCreateRequest {
  const payload: PersonProfileCreateRequest = {
    first_name: formData.personal.first_name,
    last_name: formData.personal.last_name,
  };

  // Add optional personal fields
  if (formData.personal.title_id && formData.personal.title_id !== 'no-title') {
    payload.title_id = formData.personal.title_id;
  }
  if (formData.personal.preferred_name) {
    payload.preferred_name = formData.personal.preferred_name;
  }
  if (formData.personal.date_of_birth) {
    payload.date_of_birth = formData.personal.date_of_birth;
  }
  if (formData.personal.gender_id && formData.personal.gender_id !== 'no-gender') {
    payload.gender_id = formData.personal.gender_id;
  }
  if (formData.personal.pronouns_id && formData.personal.pronouns_id !== 'no-pronoun') {
    payload.pronouns_id = formData.personal.pronouns_id;
  }
  if (formData.personal.email) {
    payload.email = formData.personal.email;
  }

  // Add contact information as contact object
  if (formData.contact.work_email || formData.contact.personal_email || formData.contact.work_phone || formData.contact.mobile_phone) {
    payload.contact = {};
    
    if (formData.contact.work_email) {
      payload.contact.work_email_address = formData.contact.work_email;
    }
    if (formData.contact.personal_email) {
      payload.contact.personal_email_address = formData.contact.personal_email;
    }
    if (formData.contact.work_phone) {
      payload.contact.work_phone_number = formData.contact.work_phone;
    }
    if (formData.contact.mobile_phone) {
      payload.contact.mobile_number = formData.contact.mobile_phone;
    }
  }

  // Set primary email field from work email if available
  if (!payload.email && formData.contact.work_email) {
    payload.email = formData.contact.work_email;
  }
  if (!payload.email && formData.contact.personal_email) {
    payload.email = formData.contact.personal_email;
  }

  // Add address information as a single address object
  if (formData.address.line1 || formData.address.city || formData.address.country) {
    payload.address = {
      name: formData.address.name || 'Primary Address',
      line1: formData.address.line1 || '',
      line2: formData.address.line2 || '',
      city: formData.address.city || '',
      state: formData.address.state || '',
      postcode: formData.address.postcode || '',
      country: formData.address.country || '',
    };
  }

  // Add additional information
  if (formData.additional.bio) {
    payload.bio = formData.additional.bio;
  }
  if (formData.additional.employee_id) {
    payload.employee_id = formData.additional.employee_id;
  }

  // Convert languages to API format - updated for LanguageAutocomplete format
  if (formData.additional.languages.length > 0) {
    payload.languages = formData.additional.languages.map((lang): LanguageObject => {
      // Map LanguageAutocomplete proficiency levels to API format
      const proficiencyMap: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'fluent' | 'native'> = {
        'Basic': 'beginner',
        'Conversational': 'intermediate', 
        'Professional': 'advanced',
        'Native': 'native'
      };
      
      return {
        code: lang.code,
        proficiency: proficiencyMap[lang.proficiency] || 'beginner',
        is_primary: false,
      };
    });
  }

  // Add nationalities
  if (formData.additional.nationalities.length > 0) {
    payload.nationalities = formData.additional.nationalities.map(nat => nat.id);
  }

  return payload;
}

export function useProfilesCreateFormRHF() {
  const { createProfile } = usePersonData({ 
    personId: null, 
    languageCode: 'en',
    autoRefresh: false 
  });

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(profilesCreateFormSchema),
    defaultValues: defaultProfilesCreateFormData,
    mode: 'onChange', // Validate on change for better UX
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors, isValid, isDirty },
    reset,
    watch,
    setValue,
    getValues,
    clearErrors,
    setError,
  } = form;

  /**
   * Submit form data to create a new person profile
   */
  const onSubmit = async (data: ProfilesCreateFormData): Promise<string | null> => {
    try {
      console.log('🚀 [FORM] Submitting form data:', data);

      // Build API payload
      const payload = buildApiPayload(data);
      console.log('📦 [FORM] API payload:', payload);

      // Create profile using the person data hook
      const result = await createProfile(payload);
      console.log('✅ [FORM] Profile created successfully:', result);

      // Show success message
      toast.success('Profile created successfully!', {
        duration: 4000,
        position: 'top-right',
      });

      // Return the person ID (result should be a string)
      return typeof result === 'string' ? result : (result as any)?.person_id || (result as any)?.id || null;
    } catch (error: any) {
      console.error('❌ [FORM] Failed to create profile:', error);
      
      // Handle validation errors from API
      if (error?.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field as any, {
            type: 'server',
            message: String(message),
          });
        });
      }

      // Show error message
      const errorMessage = error?.message || 'Failed to create profile. Please try again.';
      toast.error(errorMessage, {
        duration: 6000,
        position: 'top-right',
      });

      return null;
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    reset(defaultProfilesCreateFormData);
    clearErrors();
  };

  /**
   * Update specific form fields
   */
  const updateField = (field: keyof ProfilesCreateFormData, value: any) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Get field error message
   */
  const getFieldError = (field: string): string | undefined => {
    const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
    return fieldError?.message;
  };

  /**
   * Check if form has required fields filled
   */
  const hasRequiredFields = () => {
    const values = getValues();
    return !!(values.personal.first_name?.trim() && values.personal.last_name?.trim());
  };

  return {
    // React Hook Form instance
    form,
    
    // Form state
    isSubmitting,
    errors,
    isValid,
    isDirty,
    hasRequiredFields: hasRequiredFields(),
    
    // Form methods
    handleSubmit: (callback: (personId: string | null) => void) => handleSubmit(async (data) => {
      const result = await onSubmit(data);
      callback(result);
    }),
    reset: resetForm,
    watch,
    setValue,
    getValues,
    clearErrors,
    
    // Helper methods
    updateField,
    getFieldError,
    
    // Legacy compatibility methods (for easy migration)
    formData: watch(), // Current form values
    updateFormData: (updates: Partial<ProfilesCreateFormData>) => {
      Object.entries(updates).forEach(([key, value]) => {
        setValue(key as keyof ProfilesCreateFormData, value, { 
          shouldValidate: true, 
          shouldDirty: true 
        });
      });
    },
    submitForm: async () => {
      return new Promise<string | null>((resolve) => {
        handleSubmit(async (data) => {
          const result = await onSubmit(data);
          resolve(result);
        })();
      });
    },
  };
}

export type UseProfilesCreateFormRHFReturn = ReturnType<typeof useProfilesCreateFormRHF>;