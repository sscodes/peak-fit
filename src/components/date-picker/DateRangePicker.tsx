import { format } from "date-fns";
import React, { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { HiOutlineCalendarDateRange, HiOutlineXMark } from "react-icons/hi2";
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

  const handleSelect = (_range: DateRange | undefined, selectedDay: Date) => {
    // 1. If we already have a complete range, OR no dates selected yet:
    // Start a completely new range with the clicked day as 'from'.
    if (!selected?.from || (selected?.from && selected?.to)) {
      onSelect({ from: selectedDay, to: undefined });
      return;
    }

    // 2. If we only have a 'from' date, let's complete the range!
    if (selected?.from && !selected?.to) {
      // SMART BEHAVIOR: Check if the clicked day is BEFORE the 'from' date.
      if (selectedDay < selected.from) {
        // Swap them! Make the earlier date 'from' and the original date 'to'
        onSelect({ from: selectedDay, to: selected.from });
        setIsOpen(false); // Range is complete, close the popover
      } else {
        // Normal forward selection
        onSelect({ from: selected.from, to: selectedDay });

        // Only close the popover if they didn't click the exact same day twice
        // (Clicking the same day twice creates a 1-day range)
        if (selected.from.getTime() !== selectedDay.getTime()) {
          setIsOpen(false);
        }
      }
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
            <HiOutlineCalendarDateRange className={classes.calendarIcon} />
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
              <HiOutlineXMark className={classes.clearIcon} />
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
                <div className={classes.dropdownSection}>
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
