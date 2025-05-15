import React, { useEffect, useRef } from "react";
import { Color } from "../types";
import { IconType } from "react-icons";

export type ToggleSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Size of the toggle (e.g., "xs", "sm", "md", "lg", or "xl").
   */
  size?: ToggleSize;
  /**
   * Color variant. Acceptable values are defined by your Color type.
   */
  color?: Color;
  /**
   * When true, the toggle is set to an indeterminate state.
   */
  indeterminate?: boolean;
  /**
   * Optional text to display alongside the toggle.
   */
  label?: string;
  /**
   * If provided, wraps the toggle in a fieldset with this as the legend.
   */
  legend?: string;
  /**
   * If provided, displays this icon (from react-icons) when enabled.
   */
  iconEnabled?: IconType;
  /**
   * If provided, displays this icon (from react-icons) when disabled.
   */
  iconDisabled?: IconType;
}

// Base class for toggles.
const baseToggleClass = "toggle";

// Static mappings for sizes
const toggleSizeMapping: Record<ToggleSize, string> = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "toggle-md",
  lg: "toggle-lg",
  xl: "toggle-xl",
};

// Static mappings for colors.
// Make sure that your Color type's values match the keys defined here.
const toggleColorMapping: Record<Color, string> = {
  primary: "toggle-primary",
  secondary: "toggle-secondary",
  accent: "toggle-accent",
  neutral: "toggle-neutral",
  info: "toggle-info",
  success: "toggle-success",
  warning: "toggle-warning",
  error: "toggle-error",
};

export default function Toggle({
  size,
  color,
  indeterminate = false,
  label,
  legend,
  iconEnabled: IconEnabled,
  iconDisabled: IconDisabled,
  className = "",
  ...props
}: ToggleProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set the indeterminate state on the checkbox when the prop changes.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Build our static class list.
  const classes: string[] = [baseToggleClass];
  if (size && toggleSizeMapping[size]) {
    classes.push(toggleSizeMapping[size]);
  }
  if (color && toggleColorMapping[color]) {
    classes.push(toggleColorMapping[color]);
  }
  if (className) {
    classes.push(className);
  }
  const finalClassName =
    (!IconEnabled && !IconEnabled && classes.join(" ")) || "";

  // Create the basic input element.
  const inputElement = (
    <input
      ref={inputRef}
      type="checkbox"
      className={finalClassName}
      {...props}
    />
  );

  // If iconEnabled and iconDisabled are provided, render the toggle with icons.
  let content: React.ReactNode;
  if (IconEnabled && IconDisabled) {
    // Wrap the input and both icons in a label.
    content = (
      <label className="toggle text-base-content">
        {inputElement}
        <IconDisabled aria-label="disabled" />
        <IconEnabled aria-label="enabled" />
      </label>
    );
  } else if (label) {
    // Otherwise, if a label string is provided, wrap input in a label element.
    content = (
      <label className="flex items-center space-x-2">
        {inputElement}
        <span>{label}</span>
      </label>
    );
  } else {
    // Otherwise, just render the input.
    content = inputElement;
  }

  // If a legend is provided, wrap the content in a fieldset.
  if (legend) {
    content = (
      <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64">
        <legend className="fieldset-legend">{legend}</legend>
        {content}
      </fieldset>
    );
  }

  return content;
}
