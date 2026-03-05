export type Questionnaire = QuestionSection[];

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface Question {
  id: string;
  section: string;
  label: string;
  input_type: string;
  placeholder?: string;
  validation?: Validation;
  crucial: boolean;
  options?: Option[];
  sub_label?: string;
  default_value: string | number | null;
  conditional_display?: ConditionalDisplay;
  icon?: string;
}

export interface Validation {
  max_length?: number;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface Option {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface ConditionalDisplay {
  depends_on: string;
  show_when: string;
}

export type QuestionWithSectionMeta = Question & {
  section_title: string;
  section_description: string;
  section_icon: string;
};