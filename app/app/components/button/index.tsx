import React from "react";
import { Color, Size } from "../types";

export type ButtonVariant = "default" | "outline" | "ghost" | "link" | "active";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  variant?: ButtonVariant;
  color?: Color;
  loading?: boolean;
  square?: boolean;
  children?: React.ReactNode;
  className?: string;
  ghost?: boolean;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

const baseClass = "btn";

// Mapping for sizes – DaisyUI supports btn-xs, btn-sm, btn-md, btn-lg
const sizeMapping: Record<Size, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

// Mapping for variants
// The "default" variant means no extra variant class.
// The other variants – outline, ghost, link, active – are applied as is.
const variantMapping: Record<ButtonVariant, string> = {
  default: "",
  outline: "btn-outline",
  ghost: "btn-ghost",
  link: "btn-link",
  active: "btn-active",
};

const colorMapping: Record<Color, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  neutral: "btn-neutral",
};

const Button: React.FC<ButtonProps> = ({
  size,
  variant = "default",
  color,
  loading = false,
  square = false,
  className = "",
  children,
  ghost,
  ...props
}) => {
  // Build static classes from lookups
  const sizeClass = size ? sizeMapping[size] : "";
  const variantClass = variantMapping[variant];

  // If a color is provided add that from the mapping; if no color is provided, DaisyUI uses the default.
  const colorClass = color ? colorMapping[color] : "";

  const ghostClass = ghost ? "btn-ghost" : "";

  const shapeClass = square ? "btn-square" : "";

  const loadingClass = loading ? "loading" : "";

  // Combine all classes into a final className string.
  // All possible classes (from our mappings) appear as static strings.
  const finalClassName = [
    baseClass,
    sizeClass,
    variantClass,
    colorClass,
    shapeClass,
    ghostClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={finalClassName} {...props} disabled={loading}>
      {loading && <span className={loadingClass}></span>}
      {children}
    </button>
  );
};

export default Button;
