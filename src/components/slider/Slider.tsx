import React, { useCallback, useEffect, useRef, useState } from "react";
import { SLIDER_SIZE, SLIDER_TYPE } from "../../helpers/types";
import classes from "./Slider.module.css";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  type?: SLIDER_TYPE;
  step?: number;
  size?: SLIDER_SIZE;
  label?: string;
  disabled?: boolean;
  showMinMax?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  type = SLIDER_TYPE.CONTINUOUS,
  step = 1,
  size = SLIDER_SIZE.MEDIUM,
  label,
  disabled = false,
  showMinMax = true,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate percentage from value
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;

  // Guard: step must be positive
  const safeStep = Math.max(step, Number.EPSILON);

  // Handle value calculation and update
  const updateValue = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || disabled) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = offsetX / rect.width;

      let newValue = min + percent * (max - min);

      // Snap to step
      const actualStep = type === SLIDER_TYPE.DISCRETE ? safeStep : 1;
      newValue = Math.round(newValue / actualStep) * actualStep;
      newValue = Math.max(min, Math.min(max, newValue));

      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [disabled, max, min, onChange, safeStep, type, value],
  );

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  // Effect for drag events
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateValue(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
      setShowTooltip(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, value, min, max, step, type, disabled, updateValue]);

  // Format value for display
  const formatValue = (val: number): string => {
    return val.toFixed(0);
  };

  // Generate step markers for discrete mode
  const generateSteps = () => {
    if (safeStep <= 0) return [];
    const steps = [];
    for (let i = min; i <= max; i += safeStep) {
      steps.push({
        value: i,
        isActive: i <= value,
      });
    }
    return steps;
  };

  return (
    <div className={`${classes.container} ${className}`}>
      {label && <label className={`label ${classes.label}`}>{label}</label>}

      <div className={classes.sliderWrapper}>
        {/* Min value */}
        {showMinMax && (
          <span className={`${classes.value} ${classes.minValue}`}>
            {formatValue(min)}
          </span>
        )}

        {/* Slider track */}
        <div
          ref={sliderRef}
          className={`${classes.sliderTrack} ${classes[size]} ${disabled ? classes.disabled : ""}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Filled track */}
          <div
            className={`${classes.sliderFill} ${isDragging ? classes.dragging : ""}`}
            style={{ width: `${percentage}%` }}
          />

          {/* Discrete step markers */}
          {type === SLIDER_TYPE.DISCRETE && (
            <div className={classes.stepsContainer}>
              <div className={classes.stepsSubContainer}>
                {generateSteps().map((step, i) => (
                  <div
                    key={i}
                    className={`${classes.stepMarker} ${step.isActive ? classes.active : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Thumb */}
          <div
            className={`${classes.thumb} ${isDragging ? classes.dragging : ""}`}
            style={{
              left: `${percentage === 0 ? 1 : percentage === 100 ? 99 : percentage}%`,
            }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={label}
            aria-disabled={disabled}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                onChange(
                  Math.min(
                    max,
                    Math.round((value + safeStep) / safeStep) * safeStep,
                  ),
                );
              } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                onChange(
                  Math.max(
                    min,
                    Math.round((value - safeStep) / safeStep) * safeStep,
                  ),
                );
              } else if (e.key === "Home") {
                e.preventDefault();
                onChange(min);
              } else if (e.key === "End") {
                e.preventDefault();
                onChange(max);
              }
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => !isDragging && setShowTooltip(false)}
          >
            {/* Tooltip */}
            {(showTooltip || isDragging) && (
              <div className={classes.tooltip}>{formatValue(value)}</div>
            )}
          </div>
        </div>

        {/* Max value */}
        {showMinMax && (
          <span className={`${classes.value} ${classes.maxValue}`}>
            {formatValue(max)}
          </span>
        )}
      </div>
    </div>
  );
};
