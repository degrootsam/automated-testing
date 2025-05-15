import React from "react";
import { Color } from "../types";
import { ButtonProps } from "../button";

export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BadgeColor =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface BadgeProps {
  size?: BadgeSize;
  soft?: boolean;
  color?: Color;
  outline?: boolean;
  className?: string;
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
}

// Static mappings for sizes
const sizeClassMapping: Record<BadgeSize, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
  xl: "badge-xl",
};

// Static mappings for colors (solid)
const colorClassMapping: Record<Color, string> = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  neutral: "badge-neutral",
};

// Static mappings for outlined colors
const outlinedColorClassMapping: Record<Color, string> = {
  primary: "badge-outline badge-primary",
  secondary: "badge-outline badge-secondary",
  accent: "badge-outline badge-accent",
  info: "badge-outline badge-info",
  success: "badge-outline badge-success",
  warning: "badge-outline badge-warning",
  error: "badge-outline badge-error",
  neutral: "badge-outline badge-neutral",
};

export default function Badge({
  size,
  color,
  outline = false,
  className = "",
  children,
  soft = false,
  buttonProps,
}: BadgeProps) {
  const baseClass = "badge";

  // Use a lookup for size, if provided.
  const sizeClasses = size ? sizeClassMapping[size as BadgeSize] : "";

  const softClass = soft ? "badge-soft" : "";

  // Use static mappings for the color classes.
  let colorClasses = "";
  if (color) {
    colorClasses = outline
      ? outlinedColorClassMapping[color]
      : colorClassMapping[color];
  }

  // Combine all classes
  const finalClasses =
    `${baseClass} ${sizeClasses} ${colorClasses} ${softClass} ${className}`.trim();

  const B = () => <span className={finalClasses}>{children}</span>;

  if (buttonProps?.onClick) {
    return (
      <button {...buttonProps} type="button">
        <B />
      </button>
    );
  }

  return <B />;
}
