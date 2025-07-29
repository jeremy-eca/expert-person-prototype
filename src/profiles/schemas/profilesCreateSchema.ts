import { z } from 'zod';

// Language skill schema - matches LanguageAutocomplete format
export const languageSkillSchema = z.object({
  code: z.string().min(1, 'Language code is required'),
  display_label: z.string().min(1, 'Language display label is required'),
  proficiency: z.enum(['Basic', 'Conversational', 'Professional', 'Native']),
});

// Selected nationality schema
export const selectedNationalitySchema = z.object({
  id: z.string().min(1, 'Nationality ID is required'),
  display_label: z.string().min(1, 'Display label is required'),
});

// Personal information schema
export const personalInfoSchema = z.object({
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
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

// Contact details schema
export const contactDetailsSchema = z.object({
  work_email: z.string()
    .email('Please enter a valid work email')
    .optional()
    .or(z.literal('')),
  personal_email: z.string()
    .email('Please enter a valid personal email')
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

// Address information schema
export const addressInfoSchema = z.object({
  name: z.string()
    .max(100, 'Address name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  line1: z.string()
    .max(200, 'Address line 1 must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  line2: z.string()
    .max(200, 'Address line 2 must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .max(100, 'City must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  state: z.string()
    .max(100, 'State must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  postcode: z.string()
    .max(20, 'Postcode must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  country: z.string()
    .max(100, 'Country must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

// Additional information schema
export const additionalInfoSchema = z.object({
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  employee_id: z.string()
    .max(50, 'Employee ID must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  languages: z.array(languageSkillSchema)
    .default([])
    .refine((languages) => {
      const languageNames = languages.map(l => l.display_label.toLowerCase());
      return new Set(languageNames).size === languageNames.length;
    }, 'Duplicate languages are not allowed'),
  nationalities: z.array(selectedNationalitySchema)
    .default([])
    .refine((nationalities) => {
      const ids = nationalities.map(n => n.id);
      return new Set(ids).size === ids.length;
    }, 'Duplicate nationalities are not allowed'),
});

// Complete profiles create form schema
export const profilesCreateFormSchema = z.object({
  personal: personalInfoSchema,
  contact: contactDetailsSchema,
  address: addressInfoSchema,
  additional: additionalInfoSchema,
});

// Type inference from schema
export type ProfilesCreateFormData = z.infer<typeof profilesCreateFormSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ContactDetailsData = z.infer<typeof contactDetailsSchema>;
export type AddressInfoData = z.infer<typeof addressInfoSchema>;
export type AdditionalInfoData = z.infer<typeof additionalInfoSchema>;
export type LanguageSkillData = z.infer<typeof languageSkillSchema>;
export type SelectedNationalityData = z.infer<typeof selectedNationalitySchema>;

// Default values for form initialization
export const defaultProfilesCreateFormData: ProfilesCreateFormData = {
  personal: {
    title_id: '',
    first_name: '',
    last_name: '',
    preferred_name: '',
    date_of_birth: '',
    gender_id: '',
    pronouns_id: '',
    email: '',
  },
  contact: {
    work_email: '',
    personal_email: '',
    work_phone: '',
    mobile_phone: '',
  },
  address: {
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  },
  additional: {
    bio: '',
    employee_id: '',
    languages: [],
    nationalities: [],
  },
};