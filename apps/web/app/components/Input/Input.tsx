"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Additional className for the input element */
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, className, id, ...rest } = props;
  const inputId = id ?? (rest.name as string);
  const inputClassName = [
    styles.input,
    error ? styles.error : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (rest.type === "hidden") {
    // For hidden input, render only the input element
    return <input ref={ref} {...rest} />;
  }

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} ref={ref} className={inputClassName} {...rest} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
