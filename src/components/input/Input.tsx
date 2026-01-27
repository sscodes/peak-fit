import clsx from "clsx";
import React from "react";
import classes from "./Input.module.css";

type InputProps = {
  label: string;
  id: string;
  labelClasses?: string;
  inputClasses?: string;
  inputGroupClasses?: string;
  isError: string | false | undefined;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  id,
  labelClasses,
  inputClasses,
  inputGroupClasses,
  isError,
  error = "",
  ...rest
}: InputProps) => {
  return (
    <div className={inputGroupClasses}>
      <label
        htmlFor={id}
        className={clsx(classes.title, "label", labelClasses)}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={clsx(classes.input, "input-text", inputClasses)}
        {...rest}
      />
      {isError ? (
        <div className={classes.errors}>{error}</div>
      ) : (
        <div className={classes.errorsFiller}>error filler</div>
      )}
    </div>
  );
};

export default Input;
