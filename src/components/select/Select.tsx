import SelectRS from "react-select";
import "./Select.css";

interface SelectProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: { value: string; label: string }[];
  customClass?: string;
  placeholder?: string;
  value?: { value: string; label: string } | null;
  noOptionsMessage?: () => string;
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
}: SelectProps) => {
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
      name="color"
      placeholder={placeholder}
      noOptionsMessage={noOptionsMessage}
    />
  );
};

export default Select;
