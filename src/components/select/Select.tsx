import { clsx } from "clsx";
import SelectRS, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
} from "react-select";
import makeAnimated from "react-select/animated";
import "./Select.css";
import classes from "./Select.module.css";

const animatedComponents = makeAnimated();

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
  name: string;
  isMulti?: boolean;
  label: string;
  subLabel?: string;
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
  subLabel,
  labelClasses,
  isError,
  error = "",
}: SelectProps) => {
  return (
    <div className={classes.inputGroup}>
      <label
        htmlFor={name}
        className={clsx(classes.label, "label", labelClasses)}
      >
        {label}
      </label>
      {subLabel && (
        <label
          htmlFor={name}
          className={clsx(classes.subLabel, "subtitle-small")}
        >
          {subLabel}
        </label>
      )}
      <SelectRS
        id={name}
        className={`single-select ${customClass}`}
        classNamePrefix="select"
        value={value}
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
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
      {isError ? (
        <div className={classes.errors}>{error}</div>
      ) : (
        <div className={classes.errorsFiller} aria-hidden="true">
          &nbsp;
        </div>
      )}
    </div>
  );
};

export default Select;
