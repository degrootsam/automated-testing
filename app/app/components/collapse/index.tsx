import classNames from "classnames";
import { Color } from "../types";
import { forwardRef } from "react";

export type CollapseVariant = "arrow" | "plus";

export interface CollapseProps {
  /** Header content */
  title: React.ReactNode;
  /** Body content */
  children?: React.ReactNode;
  /** Adds an arrow or plus icon */
  variant?: CollapseVariant;
  /** Whether to render a border */
  bordered?: boolean;
  /** Tailwind color key (e.g. 'primary', 'secondary', etc.) */
  color?: CollapseColor;
  /** Tailwind compatible class to define extra classess for the bg. */
  bgClassName?: string;
  /** Extra classes on the wrapper */
  className?: string;
  /** Manually handle when the drawer opens/closes. Set to false if it should stay closed */
  open?: boolean;
  /** Required for semantics when no supplying an onChange */
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CollapseColor = Color | "transparent";
// map variants to static collapse classes
const variantClassMapping: Record<CollapseVariant, string> = {
  arrow: "collapse-arrow",
  plus: "collapse-plus",
};

// map Color → bg-{color}
const bgClassMapping: Record<CollapseColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  neutral: "bg-neutral",
  transparent: "",
};

// map Color → border-{color}
const borderColorClassMapping: Record<CollapseColor, string> = {
  primary: "border-primary",
  secondary: "border-secondary",
  accent: "border-accent",
  info: "border-info",
  success: "border-success",
  warning: "border-warning",
  error: "border-error",
  neutral: "border-neutral",
  transparent: "",
};

// eslint-disable-next-line react/display-name
const Collapse = forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
  const {
    title,
    children,
    variant,
    bordered = true,
    color,
    bgClassName = "bg-base-300",
    className = "",
    open,
    readonly,
    onChange,
  } = props;
  const classes = classNames(
    "collapse",
    variant && variantClassMapping[variant],
    color ? bgClassMapping[color] : "bg-base-100",
    bordered && "border",
    color ? borderColorClassMapping[color] : "border-base-300",
    className,
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div tabIndex={0} className={classes} ref={ref}>
      <input
        type="checkbox"
        checked={open}
        onChange={onChange}
        readOnly={readonly}
      />
      <div className="collapse-title font-semibold">{title}</div>
      <div className={classNames("collapse-content text-sm ", bgClassName)}>
        {children}
      </div>
    </div>
  );
});

export default Collapse;
