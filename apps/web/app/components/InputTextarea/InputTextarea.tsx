"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./InputTextarea.module.css";

export interface InputTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text for the textarea */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Additional className for the textarea element */
  className?: string;
}

const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>((props, ref) => {
  const { label, error, className, id, ...rest } = props;
  const textareaId = id ?? (rest.name as string);
  const textareaClassName = [
    styles.textarea,
    error ? styles.error : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        className={textareaClassName}
        {...rest}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
});

InputTextarea.displayName = "InputTextarea";
export default InputTextarea;
