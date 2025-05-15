import classNames from "classnames";

export interface TooltipProps {
  children?: React.ReactNode;
  message: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}
export default function Tooltip({
  children,
  message,
  className,
}: TooltipProps) {
  return (
    <div className={classNames("tooltip", className)} data-tip={message}>
      {children}
    </div>
  );
}
