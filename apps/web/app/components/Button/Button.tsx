"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Variant of the button: primary (default) or secondary */
  variant?: "primary" | "secondary";
  /** Loading state, disables button and shows spinner */
  loading?: boolean;
  /** Additional className for styling overrides */
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    variant = "primary",
    loading = false,
    className,
    disabled,
    ...rest
  } = props;
  const isDisabled = disabled || loading;
  const classNames = [
    styles.button,
    variant === "secondary" ? styles.secondary : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classNames} disabled={isDisabled} {...rest}>
      {children}
      {loading && <FaSpinner className={styles.spinner} />}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
