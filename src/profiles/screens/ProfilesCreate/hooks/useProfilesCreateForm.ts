import { useState } from 'react';
import toast from 'react-hot-toast';
import { ProfilesCreateFormState, ValidationErrors } from '../types/ProfilesCreateTypes';
import { PersonProfileCreateRequest, LanguageObject } from '../../../types/api.types';
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
  'Catalan': 'ca',
  'Basque': 'eu',
  'Galician': 'gl',
  'Welsh': 'cy',
  'Irish': 'ga',
  'Scots Gaelic': 'gd',
  'Icelandic': 'is',
  'Maltese': 'mt'
};

// Proficiency level mapping
const PROFICIENCY_MAP: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'fluent' | 'native'> = {
  'Basic': 'beginner',
  'Conversational': 'intermediate', 
  'Professional': 'advanced',
  'Native': 'native'
};

// Convert LanguageSkill[] to LanguageObject[] for API
function mapLanguagesToApiFormat(languages: LanguageSkill[]): LanguageObject[] {
  return languages.map((lang, index) => {
    // Get ISO code, fallback to lowercase language name if not found
    const code = LANGUAGE_CODE_MAP[lang.language] || lang.language.toLowerCase().slice(0, 2);
    
    // Map proficiency level, fallback to 'intermediate' if not found
    const proficiency = PROFICIENCY_MAP[lang.proficiency] || 'intermediate';
    
    return {
      code,
      proficiency,
      is_active: true,
      is_primary: lang.isPrimary === true
    };
  });
}

const initialFormState: ProfilesCreateFormState = {
  personal: {
    first_name: '',
    last_name: '',
    preferred_name: '',
    date_of_birth: '',
    email: '',
    title_id: 'no-title',
    gender_id: 'no-gender',
    pronouns_id: 'no-pronoun'
  },
  contact: {
    work_email: '',
    personal_email: '',
    work_phone: '',
    mobile_phone: ''
  },
  address: {
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  },
  additional: {
    bio: '',
    employee_id: '',
    languages: [],
    nationalities: []
  }
};

export const useProfilesCreateForm = () => {
  const [formData, setFormData] = useState<ProfilesCreateFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Use the existing usePersonData hook for person creation
  const { createProfile } = usePersonData({ 
    personId: null, 
    languageCode: 'en',
    autoRefresh: false 
  });

  const updateFormData = (updates: Partial<ProfilesCreateFormState>) => {
    setFormData(prev => ({
      ...prev,
      ...Object.keys(updates).reduce((acc, key) => {
        acc[key as keyof ProfilesCreateFormState] = {
          ...prev[key as keyof ProfilesCreateFormState],
          ...updates[key as keyof ProfilesCreateFormState]
        };
        return acc;
      }, {} as any)
    }));
    
    // Clear errors for updated fields
    const updatedErrors = { ...errors };
    Object.keys(updates).forEach(section => {
      Object.keys(updates[section as keyof ProfilesCreateFormState] || {}).forEach(field => {
        const errorKey = `${section}.${field}`;
        if (updatedErrors[errorKey]) {
          delete updatedErrors[errorKey];
        }
      });
    });
    setErrors(updatedErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.personal.first_name.trim()) {
      newErrors['personal.first_name'] = 'First name is required';
    } else if (formData.personal.first_name.trim().length < 2) {
      newErrors['personal.first_name'] = 'First name must be at least 2 characters';
    }

    if (!formData.personal.last_name.trim()) {
      newErrors['personal.last_name'] = 'Last name is required';
    } else if (formData.personal.last_name.trim().length < 2) {
      newErrors['personal.last_name'] = 'Last name must be at least 2 characters';
    }

    // Email validation (if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personal.email && !emailRegex.test(formData.personal.email)) {
      newErrors['personal.email'] = 'Please enter a valid email address';
    }
    if (formData.contact.work_email && !emailRegex.test(formData.contact.work_email)) {
      newErrors['contact.work_email'] = 'Please enter a valid work email address';
    }
    if (formData.contact.personal_email && !emailRegex.test(formData.contact.personal_email)) {
      newErrors['contact.personal_email'] = 'Please enter a valid personal email address';
    }

    // Date validation (if provided)
    if (formData.personal.date_of_birth) {
      const date = new Date(formData.personal.date_of_birth);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      
      if (isNaN(date.getTime())) {
        newErrors['personal.date_of_birth'] = 'Please enter a valid date';
      } else if (date < minDate || date > maxDate) {
        newErrors['personal.date_of_birth'] = 'Please enter a reasonable birth date';
      }
    }

    // Employee ID validation (if provided)
    if (formData.additional.employee_id && !formData.additional.employee_id.trim()) {
      newErrors['additional.employee_id'] = 'Employee ID cannot be empty if provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildApiPayload = (): PersonProfileCreateRequest => {
    const timestamp = Date.now();
    const firstName = formData.personal.first_name.trim();
    const lastName = formData.personal.last_name.trim();

    const payload: PersonProfileCreateRequest = {
      first_name: firstName,
      last_name: lastName,
      preferred_name: formData.personal.preferred_name?.trim() || firstName,
      bio: formData.additional.bio?.trim() || undefined,
      date_of_birth: formData.personal.date_of_birth || undefined,
      email: formData.personal.email?.trim() || undefined,
      
      // Employee reference with correct JSONB structure
      employee_reference: {
        primary: {
          id: `${firstName}${lastName}${timestamp}`.replace(/\s+/g, ''),
          source: "WEB_FORM",
          type: "manual_entry"
        },
        references: [
          {
            id: `${firstName}${lastName}${timestamp}`.replace(/\s+/g, ''),
            source: "WEB_FORM",
            type: "manual_entry",
            is_primary: true
          }
        ]
      }
    };

    // Add optional title_id if selected
    if (formData.personal.title_id && formData.personal.title_id !== 'no-title') {
      payload.title_id = formData.personal.title_id;
    }

    // Add optional gender_id if selected
    if (formData.personal.gender_id && formData.personal.gender_id !== 'no-gender') {
      payload.gender_id = formData.personal.gender_id;
    }

    // Add optional pronouns_id if selected
    if (formData.personal.pronouns_id && formData.personal.pronouns_id !== 'no-pronoun') {
      payload.pronouns_id = formData.personal.pronouns_id;
    }

    // Add optional employee_id if provided
    if (formData.additional.employee_id?.trim()) {
      payload.employee_id = formData.additional.employee_id.trim();
    }

    // Add nationalities if provided (send UUIDs to API)
    if (formData.additional.nationalities.length > 0) {
      payload.nationalities = formData.additional.nationalities.map(n => n.id);
    }

    // Add languages if provided (convert to API format)
    if (formData.additional.languages.length > 0) {
      payload.languages = mapLanguagesToApiFormat(formData.additional.languages);
    }

    // Add address if any address fields are filled
    if (formData.address.line1?.trim() || formData.address.city?.trim()) {
      payload.address = {
        name: formData.address.name?.trim() || 'Current Address',
        line1: formData.address.line1?.trim() || undefined,
        line2: formData.address.line2?.trim() || undefined,
        city: formData.address.city?.trim() || undefined,
        state: formData.address.state?.trim() || undefined,
        postcode: formData.address.postcode?.trim() || undefined,
        country: formData.address.country?.trim() || undefined
      };
    }

    // Add contact details if any contact fields are filled
    if (formData.contact.work_email?.trim() || formData.contact.personal_email?.trim() || 
        formData.contact.work_phone?.trim() || formData.contact.mobile_phone?.trim()) {
      payload.contact = {
        work_email_address: formData.contact.work_email?.trim() || undefined,
        work_phone_number: formData.contact.work_phone?.trim() || undefined,
        personal_email_address: formData.contact.personal_email?.trim() || undefined,
        mobile_number: formData.contact.mobile_phone?.trim() || undefined
      };
    }

    return payload;
  };

  const submitForm = async (): Promise<string | null> => {
    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      if (errorCount === 1) {
        const errorMessage = Object.values(errors)[0];
        toast.error(errorMessage);
      } else {
        toast.error(`Please fix ${errorCount} validation errors before creating the person`);
      }
      return null;
    }

    setIsSubmitting(true);

    try {
      toast.loading('Creating person profile...', { id: 'create-person' });

      const payload = buildApiPayload();
      const personId = await createProfile(payload);

      toast.success(`Person "${formData.personal.first_name} ${formData.personal.last_name}" created successfully!`, { 
        id: 'create-person' 
      });

      return personId;
    } catch (error) {
      console.error('Failed to create person:', error);
      toast.error(`Failed to create person: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
        id: 'create-person' 
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    updateFormData,
    errors,
    isSubmitting,
    validateForm,
    submitForm,
    resetForm
  };
};