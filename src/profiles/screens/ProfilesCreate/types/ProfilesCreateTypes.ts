// ProfilesCreate form types

import { LanguageSkill } from "../../../types/frontend.types";

export interface ProfilesCreateFormState {
  personal: {
    title_id?: string;
    first_name: string;
    last_name: string;
    preferred_name?: string;
    date_of_birth?: string;
    gender_id?: string;
    pronouns_id?: string;
    email?: string;
  };
  contact: {
    work_email?: string;
    personal_email?: string;
    work_phone?: string;
    mobile_phone?: string;
  };
  address: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  additional: {
    bio?: string;
    employee_id?: string;
    languages: LanguageSkill[];
    nationalities: SelectedNationality[];
  };
}

export interface SelectedNationality {
  id: string;
  display_label: string;
}

export interface ProfilesCreateProps {
  onPersonCreated?: (personId: string) => void;
  onCancel?: () => void;
}

export interface FormCardProps {
  formData: ProfilesCreateFormState;
  updateFormData: (updates: Partial<ProfilesCreateFormState>) => void;
  errors: Record<string, string>;
}

export interface ValidationErrors {
  [key: string]: string;
}