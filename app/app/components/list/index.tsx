import { Link } from "@remix-run/react";
import { IconType } from "react-icons";
import { v4 as uuid } from "uuid";
import Button, { ButtonProps } from "../button";
import Status, { StatusProps } from "../status";
import Tooltip from "../tooltip";
import { HTMLAttributes } from "react";
import classNames from "classnames";

export default function List({
  title,
  items,
  button,
  noResultsText,
  className,
}: {
  title?: React.ReactNode;
  items: ListItemProps[];
  button?: React.ReactNode;
  noResultsText?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <ul
      className={classNames(
        "list bg-base-100 rounded-box shadow-md w-full",
        className,
      )}
    >
      {title ? (
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {button ? (
            <div className="flex flex-row items-center justify-between">
              {title}
              {button}
            </div>
          ) : (
            title
          )}
        </li>
      ) : (
        <></>
      )}
      {items.length > 0 ? (
        items.map((item) => <ListItem {...item} key={uuid()} />)
      ) : (
        <div className="p-8 bg-base-200">
          <p className="text-center font-medium text-neutral opacity-50">
            {noResultsText}
          </p>
        </div>
      )}
    </ul>
  );
}

export interface ListItemButtonProps extends Omit<ButtonProps, "children"> {
  icon: IconType;
  href?: string;
  tooltip?: string;
  target?: string;
}

export interface ListItemProps {
  title: React.ReactNode;
  subtitle?: string;
  icon?: IconType;
  buttons?: ListItemButtonProps[];
  status?: StatusProps;
  statusPosition?: "start" | "end";
}
export function ListItem({
  title,
  subtitle,
  icon: Icon,
  buttons,
  status,
  statusPosition = "end",
}: ListItemProps) {
  function StatusComponent(props: StatusProps) {
    return (
      <div className="h-full flex items-center">
        <Tooltip message={props.ariaLabel || ""}>
          <Status {...props} />
        </Tooltip>
      </div>
    );
  }
  return (
    <li className="list-row">
      <div className="flex flex-row items-center gap-4">
        {statusPosition === "start" && status && (
          <StatusComponent {...status} />
        )}
        {Icon && (
          <div>
            <Icon className="size-10 rounded-box text-neutral-content" />
          </div>
        )}
      </div>
      <div className={!subtitle ? "flex flex-col justify-center" : ""}>
        <div>{title}</div>
        {subtitle && (
          <div className="text-xs uppercase font-semibold opacity-60">
            {subtitle}
          </div>
        )}
      </div>
      {buttons &&
        buttons.length &&
        buttons.map((button) => <ListItemButton key={uuid()} {...button} />)}
      <div className="flex items-center justify-center">
        {statusPosition === "end" && status && <StatusComponent {...status} />}
      </div>
    </li>
  );
}

export const ListItemButton = ({
  onClick,
  href,
  icon: BtnIcon,
  tooltip,
  target,
  ...props
}: ListItemButtonProps) => {
  const ButtonComponent = () => {
    if (href) {
      return (
        <Link
          to={href}
          target={target}
          referrerPolicy={target === "_blank" ? "no-referrer" : ""}
        >
          <Button onClick={onClick} className="btn-square btn-ghost" {...props}>
            <BtnIcon className="size-[1.2em]  opacity-60" />
          </Button>
        </Link>
      );
    }

    return (
      <Button onClick={onClick} square className="btn-ghost" {...props}>
        <BtnIcon className="size-[1.2em] opacity-60" />
      </Button>
    );
  };

  if (tooltip) {
    return (
      <Tooltip message={tooltip}>
        <ButtonComponent />
      </Tooltip>
    );
  }
  return <ButtonComponent />;
};
