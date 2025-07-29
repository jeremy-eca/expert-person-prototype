import { z } from 'zod';

// Personal information schema for ProfilesEdit
export const personalInfoEditSchema = z.object({
  title_id: z.string().optional(),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  preferred_name: z.string()
    .max(50, 'Preferred name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  date_of_birth: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      return parsedDate <= today && parsedDate >= minDate;
    }, 'Date of birth must be valid and not in the future'),
  gender_id: z.string().optional(),
  pronouns_id: z.string().optional(),
});

// Bio information schema for ProfilesEdit
export const bioInfoEditSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  nationalities: z.array(z.object({
    id: z.string(),
    display_label: z.string()
  }))
    .optional()
    .default([]),
  languages: z.array(z.object({
    code: z.string(),
    display_label: z.string(),
    proficiency: z.enum(['Basic', 'Conversational', 'Professional', 'Native'])
  }))
    .optional()
    .default([]),
  employee_id: z.string()
    .max(50, 'Employee ID must be less than 50 characters')
    .optional()
    .or(z.literal('')),
});

// Contact information schema for ProfilesEdit
export const contactInfoEditSchema = z.object({
  work_email: z.string()
    .email('Please enter a valid work email address')
    .optional()
    .or(z.literal('')),
  personal_email: z.string()
    .email('Please enter a valid personal email address')
    .optional()
    .or(z.literal('')),
  work_phone: z.string()
    .min(10, 'Work phone must be at least 10 digits')
    .max(20, 'Work phone must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Work phone contains invalid characters')
    .optional()
    .or(z.literal('')),
  mobile_phone: z.string()
    .min(10, 'Mobile phone must be at least 10 digits')
    .max(20, 'Mobile phone must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Mobile phone contains invalid characters')
    .optional()
    .or(z.literal('')),
});

// Complete ProfilesEdit form schema
export const profilesEditFormSchema = z.object({
  personal: personalInfoEditSchema,
  bio: bioInfoEditSchema,
  contact: contactInfoEditSchema,
});

// Type inference for form data
export type ProfilesEditFormData = z.infer<typeof profilesEditFormSchema>;

// Default values for form initialization
export const defaultProfilesEditFormValues: ProfilesEditFormData = {
  personal: {
    title_id: '',
    first_name: '',
    last_name: '',
    preferred_name: '',
    date_of_birth: '',
    gender_id: '',
    pronouns_id: '',
  },
  bio: {
    bio: '',
    nationalities: [],
    languages: [],
    employee_id: '',
  },
  contact: {
    work_email: '',
    personal_email: '',
    work_phone: '',
    mobile_phone: '',
  },
};