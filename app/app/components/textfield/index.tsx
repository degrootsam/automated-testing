import { IconType } from "react-icons";
import { Color, Size } from "../types";

export type InputColor = "ghost" | Color;

const colorMapping: Record<InputColor, string> = {
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  info: "input-info",
  neutral: "input-neutral",
  success: "input-success",
  warning: "input-warning",
  error: "input-error",
  ghost: "input-ghost",
};

const sizeMapping: Record<Size, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  color?: InputColor;
  size?: Size;
  icon?: IconType;
  iconPlacement?: "start" | "end";
  label?: string;
  labelPlacement?: "start" | "end";
}
export default function TextField({
  color = "primary",
  size = "md",
  placeholder = "Type something",
  icon: Icon,
  iconPlacement = "start",
  name,
  className,
  label,
  labelPlacement = "start",
  children,
  ...inputProps
}: TextFieldProps) {
  const colorClass = colorMapping[color];
  const sizeClass = sizeMapping[size];
  const finalClassName = `input ${colorClass} ${sizeClass} ${className}`;

  if (Icon || label) {
    return (
      <label className={finalClassName} htmlFor={name}>
        {Icon && iconPlacement === "start" && (
          <Icon size={24} className=" opacity-50" />
        )}
        {label && labelPlacement === "start" && (
          <span className="label">{label}</span>
        )}
        {children}
        <input
          {...inputProps}
          name={name}
          className="grow"
          placeholder={placeholder}
        />
        {Icon && iconPlacement === "end" && (
          <Icon size={24} className=" opacity-50" />
        )}
        {label && labelPlacement === "end" && (
          <span className="label">{label}</span>
        )}
      </label>
    );
  }
  return (
    <input
      {...inputProps}
      name={name}
      className={finalClassName}
      placeholder={placeholder}
    />
  );
}
