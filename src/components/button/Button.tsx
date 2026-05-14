import clsx from "clsx";
import type { MouseEventHandler, ReactNode } from "react";
import { BUTTON_SIZE, BUTTON_TYPE, BUTTON_VARIANT } from "@/helpers/types";
import classes from "./Button.module.css";

interface ButtonProps {
  variant?: BUTTON_VARIANT;
  children: ReactNode;
  type?: BUTTON_TYPE;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: BUTTON_SIZE;
}

const Button = ({
  variant = BUTTON_VARIANT.PRIMARY,
  children,
  type = BUTTON_TYPE.SUBMIT,
  disabled = false,
  onClick,
  size = BUTTON_SIZE.REGULAR,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        classes[variant],
        classes.button,
        disabled ? classes.disabled : "",
        classes[`button-${size}`],
      )}
    >
      {children}
    </button>
  );
};

export default Button;
