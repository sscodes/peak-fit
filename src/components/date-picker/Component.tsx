import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "./DatePicker";
import { DateRangePicker } from "./DateRangePicker";
import classes from "./Example.module.css";

export function DatePickerExamples() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <div className={classes.container}>
      <section className={classes.section}>
        <DatePicker
          selected={selectedDate}
          onSelect={setSelectedDate}
          placeholder="Pick a date"
          label="Select Date"
        />
        {selectedDate && (
          <p className={`caption ${classes.selectedInfo}`}>
            Selected: {selectedDate.toLocaleDateString()}
          </p>
        )}
      </section>
      <section className={classes.section}>
        <DateRangePicker
          selected={dateRange}
          onSelect={setDateRange}
          placeholder="Select date range"
          label="Progress Period"
          className={classes.formControl}
        />
        {dateRange?.from && dateRange?.to && (
          <p className={`caption ${classes.selectedInfo}`}>
            Range: {dateRange.from.toLocaleDateString()} -{" "}
            {dateRange.to.toLocaleDateString()}
          </p>
        )}
      </section>
    </div>
  );
}

export default DatePickerExamples;
