export type Questionnaire = QuestionSection[];

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
  display_order: number;
}

export interface Question {
  id: string;
  section: string;
  label: string;
  input_type: INPUT_TYPE;
  placeholder?: string;
  validation?: Validation;
  crucial: boolean;
  options?: Option[];
  sub_label?: string;
  default_value: string | number | string[] | null;
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
  operator: CONDITIONAL_OPERATOR;
  value: string;
}

export type QuestionWithSectionMeta = Question & {
  section_title: string;
  section_description: string;
  section_icon: string;
};

export interface FormValues {
  [key: string]: string | number | string[] | Date | null | undefined;
}

export enum INPUT_TYPE {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  MULTI_SELECT = "multi-select",
  DATE = "date",
  SLIDER = "slider",
}

export enum CONDITIONAL_OPERATOR {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  INCLUDES = "includes", // For multi-selects
  EXCLUDES = "excludes", // For multi-selects
}