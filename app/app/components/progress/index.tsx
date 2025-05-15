import React from "react";
import { Color } from "../types";

interface ProgressProps extends React.HTMLAttributes<HTMLProgressElement> {
  color?: Color;
  value?: number;
  max?: number;
}
const progressColorMapping: Record<Color, string> = {
  neutral: "progress-neutral",
  primary: "progress-primary",
  secondary: "progress-secondary",
  accent: "progress-accent",
  info: "progress-info",
  success: "progress-success",
  warning: "progress-warning",
  error: "progress-error",
};
export default function Progress({
  color = "primary",
  value,
  max,
  className = "",
  ...props
}: ProgressProps) {
  // Combine the base class, the mapped progress color class, and any additional classes.
  const finalClassName = ["progress", progressColorMapping[color], className]
    .filter(Boolean)
    .join(" ");

  return (
    <progress className={finalClassName} value={value} max={max} {...props} />
  );
}
