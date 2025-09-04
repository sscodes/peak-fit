import clsx from 'clsx';
import * as React from 'react';
import { BUTTON_TYPE, BUTTON_VARIANT } from '../../helpers/types';
import classes from './styles.module.css';

interface ButtonProps {
  variant?: BUTTON_VARIANT;
  children: React.ReactNode;
  type?: BUTTON_TYPE;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({
  variant = BUTTON_VARIANT.PRIMARY,
  children,
  type = BUTTON_TYPE.SUBMIT,
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        classes[variant],
        classes.button,
        disabled ? classes.disabled : '',
        'tm-button-text'
      )}
    >
      {children}
    </button>
  );
};

export default Button;
