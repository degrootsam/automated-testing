import { HTMLAttributes } from "react";
import { Color, Size } from "../types";
import classNames from "classnames";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  color?: Color;
  size?: Size;
}

const colorMapping: Record<Color, string> = {
  primary: "radio-primary",
  secondary: "radio-secondary",
  success: "radio-success",
  warning: "radio-warning",
  error: "radio-error",
  accent: "radio-accent",
  info: "radio-info",
  neutral: "radio-neutral",
};

const sizeMapping: Record<Size, string> = {
  xs: "radio-xs",
  sm: "radio-sm",
  md: "radio-md",
  lg: "radio-lg",
  xl: "radio-xl",
};

export default function Radio({ color, size, ...rest }: RadioProps) {
  const sizeClass = size ? sizeMapping[size] : "";
  const colorClass = color ? colorMapping[color] : "";

  return (
    <input
      {...rest}
      type="radio"
      className={classNames(sizeClass, colorClass, "radio")}
    />
  );
}
