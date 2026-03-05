import SelectRS, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
} from "react-select";
import makeAnimated from "react-select/animated";
import "./Select.css";

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
}: SelectProps) => {
  const animatedComponents = makeAnimated();
  return (
    <SelectRS
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
  );
};

export default Select;
