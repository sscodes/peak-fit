import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import classes from "./DatePicker.module.css";

const YearDropDown = ({
  month,
  setMonth,
  lowerYearLimit,
  upperYearLimit,
}: {
  month: Date;
  setMonth: Dispatch<SetStateAction<Date>>;
  lowerYearLimit: number;
  upperYearLimit: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleYearChange = useCallback(
    (year: number) => {
      const newDate = new Date(month);
      newDate.setFullYear(year);
      setMonth(newDate);
    },
    [setMonth, month],
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: lowerYearLimit - upperYearLimit }, (_, i) =>
      lowerYearLimit < 0
        ? currentYear - lowerYearLimit + i
        : currentYear - lowerYearLimit + i + 1,
    );
  }, [lowerYearLimit, upperYearLimit]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={classes.monthDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={classes.monthDropdownTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        {month.getFullYear()}
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className={classes.monthDropdownMenu}>
          {years.map((year, idx) => (
            <button
              key={idx}
              type="button"
              className={`${classes.monthDropdownOption} ${year === month.getFullYear() ? classes.active : ""}`}
              onClick={() => {
                handleYearChange(year);
                setIsOpen(false);
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearDropDown;
