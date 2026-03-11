import { CONDITIONAL_OPERATOR } from "../../../../../types/questions";

export function evaluateConditionalDisplay(
  operator: CONDITIONAL_OPERATOR,
  dependentValue: unknown,
  targetValue: string,
): boolean {
  switch (operator) {
    case CONDITIONAL_OPERATOR.EQUALS:
      if (Array.isArray(dependentValue))
        return dependentValue
          .map((v) => v.toLowerCase())
          .includes(targetValue.toLowerCase());
      return (
        dependentValue?.toString().toLowerCase() === targetValue.toLowerCase()
      );

    case CONDITIONAL_OPERATOR.NOT_EQUALS:
      if (Array.isArray(dependentValue))
        return !dependentValue
          .map((v) => v.toLowerCase())
          .includes(targetValue.toLowerCase());
      return (
        dependentValue?.toString().toLowerCase() !== targetValue.toLowerCase()
      );

    case CONDITIONAL_OPERATOR.GREATER_THAN:
      return Number(dependentValue) > Number(targetValue);

    case CONDITIONAL_OPERATOR.LESS_THAN:
      return Number(dependentValue) < Number(targetValue);

    case CONDITIONAL_OPERATOR.INCLUDES:
      if (Array.isArray(dependentValue))
        return dependentValue.includes(targetValue.toLowerCase());
      return false;

    case CONDITIONAL_OPERATOR.EXCLUDES:
      if (Array.isArray(dependentValue))
        return !dependentValue.includes(targetValue.toLowerCase());
      return true;

    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}
