import { format, isBefore, isSameDay, startOfDay } from "date-fns";
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
  lowerYearLimit = 100,
  upperYearLimit = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selected?.from || new Date());

  const handleSelect = (_range: DateRange | undefined, selectedDay: Date) => {
    const normalizedClick = startOfDay(selectedDay);

    // 1. If no date is selected, or a full range was already finished:
    // Start a new selection with just the 'from' date.
    if (!selected?.from || (selected?.from && selected?.to)) {
      onSelect({ from: normalizedClick, to: undefined });
      return;
    }

    // 2. If the user clicks the SAME day as the 'from' date:
    // Do nothing. We don't want a 1-day range (e.g., Feb 12 - Feb 12).
    if (isSameDay(selected.from, normalizedClick)) {
      return;
    }

    // 3. Complete the range with a distinct second date
    let newRange: DateRange;
    if (isBefore(normalizedClick, selected.from)) {
      // Backwards selection: swap them
      newRange = { from: normalizedClick, to: startOfDay(selected.from) };
    } else {
      // Forward selection
      newRange = { from: startOfDay(selected.from), to: normalizedClick };
    }

    onSelect(newRange);
    setIsOpen(false); // Only close now that we have a valid, 2-date range
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  const getDisplayText = () => {
    // If we don't have both dates, or if they are the same day, show placeholder
    if (
      !selected?.from ||
      !selected?.to ||
      isSameDay(selected.from, selected.to)
    ) {
      return placeholder;
    }

    // Only show the range text when we have two distinct dates
    return `${format(selected.from, "MMM dd")} - ${format(selected.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className={`${classes.container} ${className}`}>
      {label && (
        <label className={`label ${classes.label}`}>
          {label}
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
