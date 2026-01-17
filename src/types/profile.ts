export interface Profile {
  id: string;
  email: string;
  full_name: string;
  questionnaire_data: Record<string, QuestionnaireData>;
  created_at: string;
  updated_at: string;
  is_onboarded: boolean;
  avatar: string | null;
  signup_source: string | null;
  last_active: string;
  login_streak: number;
}

export interface QuestionnaireData {
  question: string;
  value: string | number | null;
  created_at: string;
  modified_at: string;
  is_answered: boolean;
  section: string;
}
