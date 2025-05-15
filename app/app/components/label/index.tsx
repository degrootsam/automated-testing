import { Children } from "react";
import { TextField } from "..";

type LabelTextFieldProps = React.ComponentProps<typeof TextField>;

type AllowedLabelProps = LabelTextFieldProps;

type AllowedLabelChildren = typeof TextField;

type Children = React.ReactElement<AllowedLabelProps, AllowedLabelChildren>;

type InputType = "textfield" | "select";

const inputTypeMapping: Record<InputType, string> = {
  textfield: "input",
  select: "select",
};

export interface LabelProps {
  label: string;
  children: Children;
  position?: "start" | "end";
  inputType?: "textfield" | "select";
}

export default function Label({
  label,
  position,
  children,
  inputType = "textfield",
}: LabelProps) {
  const inputClassName = inputTypeMapping[inputType];

  return (
    <label className={inputClassName}>
      {position === "start" && <span className="label">{label}</span>}
      {children}
      {position === "end" && <span className="label">{label}</span>}
    </label>
  );
}
