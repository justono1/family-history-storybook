"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./InputCheckbox.module.css";

export interface InputCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed next to the checkbox */
  label: string;
  /** Error message to display below the checkbox */
  error?: string;
  /** Additional className for the checkbox element */
  className?: string;
}

const InputCheckbox = forwardRef<HTMLInputElement, InputCheckboxProps>((props, ref) => {
  const { label, error, className, id, ...rest } = props;
  const inputId = id ?? (rest.name as string);
  const checkboxClassName = [
    styles.checkbox,
    error ? styles.error : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          className={checkboxClassName}
          {...rest}
        />
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
});

InputCheckbox.displayName = "InputCheckbox";
export default InputCheckbox;
