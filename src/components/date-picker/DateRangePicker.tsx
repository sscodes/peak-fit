import { format } from "date-fns";
import { Calendar, X } from "lucide-react";
import React, { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import classes from "./DatePicker.module.css";
import "./Datepicker.css";
import { MonthDropdown } from "./MonthDropdown";
import YearDropDown from "./YearDropDown";

interface DateRangePickerProps {
  selected?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  lowerYearLimit?: number;
  upperYearLimit?: number;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selected,
  onSelect,
  placeholder = "Select date range",
  disabled = false,
  minDate,
  maxDate,
  className = "",
  label,
  error,
  required = false,
  lowerYearLimit = 100,
  upperYearLimit = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selected?.from || new Date());

  const handleSelect = (range: DateRange | undefined) => {
    onSelect(range);
    // Only close if we have both dates AND they're different (a real range)
    if (
      range?.from &&
      range?.to &&
      range.from.getTime() !== range.to.getTime()
    ) {
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  const getDisplayText = () => {
    if (!selected?.from) return placeholder;
    if (!selected.to) return format(selected.from, "MMM dd, yyyy");
    return `${format(selected.from, "MMM dd")} - ${format(selected.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className={`${classes.container} ${className}`}>
      {label && (
        <label className={`label ${classes.label}`}>
          {label}
          {required && <span className={classes.required}>*</span>}
        </label>
      )}

      <div className={classes.inputWrapper}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          aria-disabled={disabled}
          className={`${classes.trigger} ${disabled ? classes.disabled : ""} ${error ? classes.hasError : ""}`}
        >
          <div className={classes.triggerContent}>
            <Calendar className={classes.calendarIcon} />
            <span
              className={`input-text ${!selected?.from ? classes.placeholder : ""}`}
            >
              {getDisplayText()}
            </span>
          </div>

          {selected?.from && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={classes.clearButton}
              aria-label="Clear date range"
            >
              <X className={classes.clearIcon} />
            </button>
          )}
        </div>

        {error && <p className={`${classes.error} caption`}>{error}</p>}

        {isOpen && !disabled && (
          <>
            <div
              className={classes.backdrop}
              onClick={() => setIsOpen(false)}
            />

            <div className={classes.popover}>
              <div className={classes.calendarWrapper}>
                {/* Custom Caption */}
                <div className={classes.customCaption}>
                  <MonthDropdown month={month} setMonth={setMonth} />
                  <YearDropDown
                    month={month}
                    setMonth={setMonth}
                    lowerYearLimit={lowerYearLimit}
                    upperYearLimit={upperYearLimit}
                  />
                </div>

                <DayPicker
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={[
                    ...(minDate ? [{ before: minDate }] : []),
                    ...(maxDate ? [{ after: maxDate }] : []),
                  ]}
                  showOutsideDays={false}
                  className="peakfit-datepicker-range"
                  numberOfMonths={2}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
