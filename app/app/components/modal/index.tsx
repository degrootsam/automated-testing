import { HTMLAttributes, useEffect, useId } from "react";
import { v4 as uuid } from "uuid";
import Button, { ButtonProps } from "../button";
import classNames from "classnames";

export interface ModalProps {
  showModal: boolean;
  children?: React.ReactNode;
  title: string;
  onHideModal?: () => void;
  buttons?: ButtonProps[];
  className?: HTMLAttributes<HTMLDialogElement>["className"];
}
export default function Modal({
  showModal,
  children,
  title,
  onHideModal,
  buttons = [],
  className,
}: ModalProps) {
  const id = useId();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (!modal) return;

    if (showModal) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [showModal, id]);

  useEffect(() => {
    function handlePressEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && showModal && onHideModal) {
        onHideModal();
      }
    }
    document.addEventListener("keydown", handlePressEscape);

    return () => {
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, [showModal, onHideModal]);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onHideModal && onHideModal(); // Model gets closed by useEffect hook
  };

  return (
    <dialog id={id} className="modal">
      <div className={classNames("modal-box max-w-xl w-full", className)}>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          <Button onClick={handleClose}>Close</Button>
          {buttons.map((b) => (
            <Button {...b} key={uuid()} />
          ))}
        </div>
      </div>
    </dialog>
  );
}
