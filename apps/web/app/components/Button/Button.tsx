"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Variant of the button: primary (default) or secondary */
  variant?: "primary" | "secondary";
  /** Additional className for styling overrides */
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, variant = "primary", className, ...rest } = props;
  const classNames = [
    styles.button,
    variant === "secondary" ? styles.secondary : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classNames} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;