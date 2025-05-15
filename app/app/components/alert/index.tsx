import { IconType } from "react-icons";
import { Color } from "../types";
import { HTMLAttributes } from "react";
import Button, { ButtonProps } from "../button";
import { v4 as uuid } from "uuid";

const colorMapping: Record<Color, string> = {
  primary: "alert-primary",
  secondary: "alert-secondary",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
  info: "alert-info",
  accent: "alert-accent",
  neutral: "alert-neutral",
};

type OutlineStyle = "outline" | "dash";

const outlineMapping: Record<OutlineStyle, string> = {
  dash: "alert-dash",
  outline: "alert-outline",
};

type Layout = "horizontal" | "vertical";

const layoutMapping: Record<Layout, string> = {
  horizontal: "alert-horizontal",
  vertical: "alert-vertical",
};

export interface AlertProps {
  message: string;
  color: Color;
  icon?: IconType;
  outline?: OutlineStyle;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  soft?: boolean;
  layout?: Layout;
  buttons?: ButtonProps[];
}

export default function Alert({
  message,
  color,
  outline,
  icon: Icon,
  className,
  soft = true,
  layout = "horizontal",
  buttons = [],
}: AlertProps) {
  const colorClass = colorMapping[color];
  const outlineClass = outline ? outlineMapping[outline] : "";
  const softClass = soft ? "alert-soft" : "";
  const layoutClass = layoutMapping[layout];
  const finalClass = `alert ${colorClass} ${outlineClass} ${softClass} ${layoutClass} ${className}`;
  return (
    <div role="alert" className={finalClass}>
      {Icon && <Icon className="stroke-info h-6 w-6 shrink-0" />}
      <span>{message}</span>
      <div>
        {buttons.map((b) => (
          <Button key={uuid()} className="btn-sm" {...b} />
        ))}
      </div>
    </div>
  );
}
