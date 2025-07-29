import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ProfilesEditFormData,
  profilesEditFormSchema,
  defaultProfilesEditFormValues
} from '../schemas/profilesEditSchema';
import { PersonProfile } from '../../../types/frontend.types';
import { PersonProfileCreateRequest } from '../../../types/api.types';

interface UseProfilesEditFormProps {
  profile?: PersonProfile;
  onProfileUpdate?: (profile: PersonProfile) => void;
  onProfileCreate?: (profileData: PersonProfileCreateRequest) => Promise<string>;
  onPersonCreated?: (personId: string) => void;
  isNewPerson?: boolean;
}

interface UseProfilesEditFormReturn {
  form: UseFormReturn<ProfilesEditFormData>;
  isSubmitting: boolean;
  errors: Record<string, any>;
  hasRequiredFields: boolean;
  handleSubmit: (callback?: (success: boolean) => void) => void;
  reset: () => void;
  isDirty: boolean;
  isValid: boolean;
}

export const useProfilesEditForm = ({
  profile,
  onProfileUpdate,
  onProfileCreate,
  onPersonCreated,
  isNewPerson = false
}: UseProfilesEditFormProps): UseProfilesEditFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<ProfilesEditFormData>({
    resolver: zodResolver(profilesEditFormSchema),
    defaultValues: defaultProfilesEditFormValues,
    mode: 'onChange', // Validate on change for real-time feedback
  });

  const { formState: { errors, isValid, isDirty }, watch, reset: resetForm } = form;

  // Watch required fields to determine if form is ready for submission
  const watchedFields = watch(['personal.first_name', 'personal.last_name']);
  const hasRequiredFields = Boolean(
    watchedFields[0]?.trim() && watchedFields[1]?.trim()
  );

  // Initialize form with profile data when profile changes
  useEffect(() => {
    if (profile) {
      // Parse the full name into first and last name
      const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const formData: ProfilesEditFormData = {
        personal: {
          title_id: profile.title_id || '',
          first_name: firstName,
          last_name: lastName,
          preferred_name: profile.preferred_name || '',
          date_of_birth: profile.dateOfBirth || '',
          gender_id: profile.gender_id || '',
          pronouns_id: profile.pronouns_id || '',
        },
        bio: {
          bio: profile.bio || '',
          nationalities: Array.isArray(profile.nationalities) 
            ? profile.nationalities.map(nat => ({ id: '', display_label: nat }))
            : [],
          employee_id: profile.employee_id || '',
        },
        contact: {
          work_email: profile.contact?.workEmail || '',
          personal_email: profile.contact?.personalEmail || '',
          work_phone: profile.contact?.workPhone || '',
          mobile_phone: profile.contact?.mobilePhone || '',
        },
      };

      form.reset(formData);
    }
  }, [profile, form]);

  // Form submission handler
  const handleSubmit = (callback?: (success: boolean) => void) => {
    form.handleSubmit(async (data) => {
      setIsSubmitting(true);
      
      try {
        console.log('🚀 [ProfilesEdit] Form submission started', { data, isNewPerson });

        if (isNewPerson && onProfileCreate) {
          // Create new person
          const profileData: PersonProfileCreateRequest = {
            title_id: data.personal.title_id || undefined,
            first_name: data.personal.first_name,
            last_name: data.personal.last_name,
            preferred_name: data.personal.preferred_name || undefined,
            date_of_birth: data.personal.date_of_birth || undefined,
            gender_id: data.personal.gender_id || undefined,
            pronouns_id: data.personal.pronouns_id || undefined,
            bio: data.bio.bio || undefined,
            employee_id: data.bio.employee_id || undefined,
            email: data.contact.work_email || data.contact.personal_email || undefined,
            // Additional fields can be added here as needed
          };

          const personId = await onProfileCreate(profileData);
          
          toast.success(`Person "${data.personal.first_name} ${data.personal.last_name}" created successfully!`);
          
          if (onPersonCreated) {
            onPersonCreated(personId);
          }
          
          callback?.(true);
        } else if (profile && onProfileUpdate) {
          // Update existing person
          const updatedProfile: PersonProfile = {
            ...profile,
            name: `${data.personal.first_name} ${data.personal.last_name}`,
            title_id: data.personal.title_id,
            preferred_name: data.personal.preferred_name,
            dateOfBirth: data.personal.date_of_birth,
            gender_id: data.personal.gender_id,
            pronouns_id: data.personal.pronouns_id,
            bio: data.bio.bio,
            employee_id: data.bio.employee_id,
            nationalities: typeof data.bio.nationalities === 'string' 
              ? data.bio.nationalities.split(',').map(nat => nat.trim()).filter(Boolean)
              : data.bio.nationalities,
            contact: {
              ...profile.contact,
              workEmail: data.contact.work_email,
              personalEmail: data.contact.personal_email,
              workPhone: data.contact.work_phone,
              mobilePhone: data.contact.mobile_phone,
            },
          };

          onProfileUpdate(updatedProfile);
          
          toast.success(`Profile updated successfully!`);
          callback?.(true);
        }

      } catch (error) {
        console.error('🚨 [ProfilesEdit] Form submission failed:', error);
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to save profile. Please try again.';
        
        toast.error(errorMessage);
        callback?.(false);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  // Reset form to default values
  const reset = () => {
    resetForm(defaultProfilesEditFormValues);
  };

  return {
    form,
    isSubmitting,
    errors,
    hasRequiredFields,
    handleSubmit,
    reset,
    isDirty,
    isValid,
  };
};