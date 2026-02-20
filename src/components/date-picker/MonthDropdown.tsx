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

export const MonthDropdown = ({
  month,
  setMonth,
}: {
  month: Date;
  setMonth: Dispatch<SetStateAction<Date>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLButtonElement>(null);

  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );

  const handleMonthChange = useCallback(
    (monthIndex: number) => {
      const newDate = new Date(month);
      newDate.setMonth(monthIndex);
      setMonth(newDate);
    },
    [month, setMonth],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen && selectedMonthRef.current) {
      selectedMonthRef.current.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
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
        {months[month.getMonth()]}
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className={classes.monthDropdownMenu}>
          {months.map((m, idx) => (
            <button
              key={idx}
              ref={idx === month.getMonth() ? selectedMonthRef : null}
              type="button"
              className={`${classes.monthDropdownOption} ${idx === month.getMonth() ? classes.active : ""}`}
              onClick={() => {
                handleMonthChange(idx);
                setIsOpen(false);
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
