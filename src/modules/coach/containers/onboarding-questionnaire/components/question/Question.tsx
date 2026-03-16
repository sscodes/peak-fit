import clsx from "clsx";
import type { FormikProps } from "formik/dist/types";
import type { MultiValue, SingleValue } from "react-select";
import { DatePicker } from "../../../../../../components/date-picker/DatePicker";
import Icon from "../../../../../../components/icon/Icon";
import Input from "../../../../../../components/input/Input";
import Select from "../../../../../../components/select/Select";
import { Slider } from "../../../../../../components/slider/Slider";
import {
  INPUT_TYPE,
  type FormValues,
  type Option,
  type QuestionWithSectionMeta,
} from "../../../../../../types/questions";
import classes from "./Question.module.css";

const Question = ({
  formik,
  question,
}: {
  formik: FormikProps<FormValues>;
  question: QuestionWithSectionMeta;
}) => {
  // console.log("Rendering Question Component with question:", question); // Debug log
  const getInputComponent = () => {
    switch (question.input_type) {
      case INPUT_TYPE.TEXT:
        return (
          <Input
            label={question.label}
            id={question.id}
            type={question.input_type}
            placeholder={question.placeholder}
            isError={formik.touched[question.id] && formik.errors[question.id]}
            error={formik.errors[question.id]}
            value={formik.values[question.id] as string}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            subLabel={question.sub_label}
          />
        );
      case INPUT_TYPE.NUMBER:
        return (
          <Input
            label={question.label}
            id={question.id}
            type={question.input_type}
            placeholder={question.placeholder}
            isError={formik.touched[question.id] && formik.errors[question.id]}
            error={formik.errors[question.id]}
            value={
              (formik.values[question.id] as number | null | undefined) ?? ""
            }
            onChange={(event) =>
              formik.setFieldValue(
                question.id,
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
            onBlur={formik.handleBlur}
            subLabel={question.sub_label}
          />
        );
      case INPUT_TYPE.SELECT:
        return (
          <Select
            label={question.label}
            options={question.options || []}
            customClass={classes.selectContainer}
            isClearable
            onChange={(newValue) => {
              formik.setFieldValue(
                question.id,
                (newValue as SingleValue<Option>)?.value ?? "",
              );
            }}
            value={
              question.options?.find(
                (opt) => opt.value === formik.values[question.id],
              ) || null
            }
            name={question.id}
            isError={formik.touched[question.id] && formik.errors[question.id]}
            error={formik.errors[question.id]}
            placeholder={question.placeholder}
          />
        );
      case INPUT_TYPE.MULTI_SELECT:
        return (
          <Select
            label={question.label}
            options={question.options || []}
            customClass={classes.selectContainer}
            isMulti
            onChange={(newValue) => {
              const values = newValue
                ? (newValue as MultiValue<Option>).map(
                    (opt: Option) => opt.value,
                  )
                : [];
              formik.setFieldValue(question.id, values);
            }}
            name={question.id}
            value={question.options?.filter((opt) =>
              (formik.values[question.id] as string[])?.includes(opt.value),
            )}
            placeholder={question.placeholder}
            isError={formik.touched[question.id] && formik.errors[question.id]}
            error={formik.errors[question.id]}
          />
        );
      case INPUT_TYPE.DATE:
        return (
          <DatePicker
            selected={
              formik.values[question.id]
                ? new Date(formik.values[question.id] as string | Date)
                : undefined
            }
            onSelect={(date) => formik.setFieldValue(question.id, date)}
            placeholder={question.placeholder}
            label={question.label}
            isError={formik.touched[question.id] && formik.errors[question.id]}
            error={formik.errors[question.id]}
          />
        );
      case INPUT_TYPE.SLIDER:
        return (
          <Slider
            min={question.validation?.min ?? 0}
            max={question.validation?.max ?? 100}
            value={formik.values[question.id] as number}
            onChange={formik.handleChange}
            label={question.label}
          />
        );
    }
  };

  return (
    <div className={classes.step}>
      <div className={classes.subContainer}>
        <div className={classes.iconContainer}>
          <Icon name={question.section_icon} size={48} />
        </div>
        <div className={clsx(classes.title, "heading-1")}>
          {question.section_title}
        </div>
        <div className={clsx(classes.subTitle, "heading-5")}>
          {question.section_description}
        </div>
        <div className={classes.inputGroup}>{getInputComponent()}</div>
      </div>
    </div>
  );
};

export default Question;
