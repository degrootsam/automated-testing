import React, { HTMLAttributes } from "react";
import { Color } from "../types";

export type StatusSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AnimationType = "ping" | "bounce";

export interface StatusProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Determines the size of the status indicator.
   */
  size?: StatusSize;
  /**
   * Sets the color variant of the status indicator.
   */
  color?: Color;
  /**
   * Optionally adds an animation (e.g. ping or bounce) to the status.
   */
  animate?: AnimationType;
  /**
   * For ping animation only: when true, render two overlapping elements (one animating, one static).
   */
  overlay?: boolean;
  /**
   * Accessible label for the status indicator.
   */
  ariaLabel?: string;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

// Base class that is always applied.
const baseClass = "status";

// Mapping objects for sizes (these values are static strings known at build time).
const statusSizeMapping: Record<StatusSize, string> = {
  xs: "status-xs",
  sm: "status-sm",
  md: "status-md",
  lg: "status-lg",
  xl: "status-xl",
};

// Mapping objects for colors.
const statusColorMapping: Record<Color, string> = {
  primary: "status-primary",
  secondary: "status-secondary",
  accent: "status-accent",
  neutral: "status-neutral",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  error: "status-error",
};

// Mapping for animations.
const animationMapping: Record<AnimationType, string> = {
  ping: "animate-ping",
  bounce: "animate-bounce",
};

export default function Status({
  size,
  color,
  animate,
  overlay = false,
  ariaLabel,
  className = "",
  ...props
}: StatusProps) {
  // Build a list of classes starting with the base.
  const classes: string[] = [baseClass];

  // Conditionally add the size class.
  if (size && statusSizeMapping[size]) {
    classes.push(statusSizeMapping[size]);
  }

  // Conditionally add the color class.
  if (color && statusColorMapping[color]) {
    classes.push(statusColorMapping[color]);
  }

  // If animation is provided and overlay is not used, add that class.
  if (animate && !overlay && animationMapping[animate]) {
    classes.push(animationMapping[animate]);
  }

  // Append any additional custom classes.
  if (className) {
    classes.push(className);
  }

  const finalClassName = classes.join(" ");

  // If overlay is required (for ping animation), render two overlapping status elements.
  if (overlay && animate === "ping") {
    return (
      <div
        className="inline-grid" // Using a fixed inline-grid class
        aria-label={ariaLabel}
        {...props}
        style={{ gridTemplateAreas: `"overlap"`, position: "relative" }}
      >
        <div
          className={[
            baseClass,
            color ? statusColorMapping[color] : "",
            animationMapping["ping"],
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ gridArea: "overlap" }}
        ></div>
        <div
          className={[baseClass, color ? statusColorMapping[color] : ""]
            .filter(Boolean)
            .join(" ")}
          style={{ gridArea: "overlap" }}
        ></div>
      </div>
    );
  }

  // Otherwise, render a single element.
  return (
    <span aria-label={ariaLabel} className={finalClassName} {...props}></span>
  );
}
