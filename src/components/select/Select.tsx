import SelectRS, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
} from "react-select";
import makeAnimated from "react-select/animated";
import "./Select.css";
import { clsx } from "clsx";
import classes from "./Select.module.css";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: { value: string; label: string }[];
  customClass?: string;
  placeholder?: string;
  value?: MultiValue<Option> | SingleValue<Option>;
  noOptionsMessage?: () => string;
  onChange: (
    newValue: MultiValue<Option> | SingleValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void;
  name?: string;
  isMulti?: boolean;
  label: string;
  labelClasses?: string;
  isError?: string | false | undefined;
  error?: string;
}

const Select = ({
  isDisabled = false,
  isLoading = false,
  isClearable = false,
  isSearchable = false,
  options,
  customClass = "",
  placeholder = "Select an option",
  value = null,
  noOptionsMessage = () => "No such option available",
  onChange,
  name,
  isMulti = false,
  label,
  labelClasses,
  isError,
  error = "",
}: SelectProps) => {
  const animatedComponents = makeAnimated();
  return (
    <div className={classes.inputGroup}>
      <label
        htmlFor={name}
        className={clsx(classes.label, "label", labelClasses)}
      >
        {label}
      </label>
      <SelectRS
        id={name}
        className={`single-select ${customClass}`}
        classNamePrefix="select"
        defaultValue={value}
        options={options}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name={name}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        onChange={onChange}
        isMulti={isMulti}
        components={animatedComponents}
      />
      {isError ? (
        <div className={classes.errors}>{error}</div>
      ) : (
        <div className={classes.errorsFiller}>error filler</div>
      )}
    </div>
  );
};

export default Select;
