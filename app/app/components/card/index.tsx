import classNames from "classnames";
import { HTMLAttributes } from "react";

export interface CardProps {
  children?: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(className, "p-8 rounded-lg bg-base-100 shadow-md")}
    >
      {children}
    </div>
  );
}
