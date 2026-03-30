import { array, date, mixed, number, object, string, type ObjectSchema, type Schema } from "yup";
import {
  INPUT_TYPE,
  type QuestionWithSectionMeta,
} from "../../../../../types/questions";
import { evaluateConditionalDisplay } from "./helper";

export function buildValidationSchema(
  questions: QuestionWithSectionMeta[],
): ObjectSchema<Record<string, unknown>> {
  const shape: Record<string, Schema> = {};

  for (const question of questions) {
    const { id, input_type, validation, conditional_display } = question;
    const fieldLabel = id
      .replace(/_/g, " ")
      .replace(/^./, (c) => c.toUpperCase()); // Convert snake_case to Sentence case for error messages

    if (
      !validation &&
      input_type !== INPUT_TYPE.MULTI_SELECT &&
      !conditional_display
    ) {
      shape[id] = mixed().nullable().optional();
      continue;
    }

    switch (input_type) {
      case INPUT_TYPE.NUMBER: {
        let schema = number()
          .typeError(`${fieldLabel} must be a number`)
          .nullable();

        if (validation?.min !== undefined)
          schema = schema.min(
            validation.min,
            `${fieldLabel} must be at least ${validation.min}`,
          );
        if (validation?.max !== undefined)
          schema = schema.max(
            validation.max,
            `${fieldLabel} must be at most ${validation.max}`,
          );
        if (validation?.required)
          schema = schema.required(`${fieldLabel} is required`);

        shape[id] = schema;
        break;
      }

      case INPUT_TYPE.TEXT: {
        let schema = string().nullable();

        if (validation?.max_length !== undefined)
          schema = schema.max(
            validation.max_length,
            `${fieldLabel} must be ${validation.max_length} characters or fewer`,
          );
        if (validation?.required)
          schema = schema.required(`${fieldLabel} is required`);

        shape[id] = schema;
        break;
      }

      case INPUT_TYPE.SELECT: {
        let schema = string().nullable();

        if (validation?.required)
          schema = schema.required(`Please select an option for ${fieldLabel}`);

        shape[id] = schema;
        break;
      }

      case INPUT_TYPE.MULTI_SELECT: {
        let schema = array().of(string().required()).nullable();

        if (validation?.required)
          schema = schema
            .min(1, `Please select at least one option for ${fieldLabel}`)
            .required(`${fieldLabel} is required`);

        shape[id] = schema;
        break;
      }

      case INPUT_TYPE.DATE: {
        let schema = date()
          .typeError(`${fieldLabel} must be a valid date`)
          .nullable();

        if (validation?.required)
          schema = schema.required(`${fieldLabel} is required`);

        shape[id] = schema;
        break;
      }

      default: {
        shape[id] = mixed().nullable().optional();
      }
    }

    if (conditional_display) {
      const { depends_on, operator, value: condValue } = conditional_display;

      shape[id] = (shape[id] as Schema).when(depends_on, {
        is: (depVal: unknown) =>
          evaluateConditionalDisplay(operator, depVal, condValue),
        then: (schema: Schema) =>
          schema.required(`${fieldLabel} is required`),
        otherwise: () => mixed().nullable().optional(),
      });
    }
  }

  return object().shape(shape) as ObjectSchema<Record<string, unknown>>;
}
