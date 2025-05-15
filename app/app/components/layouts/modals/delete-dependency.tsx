import { useFetcher } from "@remix-run/react";
import { useRef, useCallback, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Alert } from "~/components";
import Modal, { ModalProps } from "~/components/modal";
import { isServerErrorWithMessage } from "~/utils";
import { IProject } from "~/utils/projects/types";

interface DeleteDependencyModalProps {
  dependency: string;
  project: IProject;
  showModal: ModalProps["showModal"];
  onHideModal: ModalProps["onHideModal"];
  onSuccess: () => void;
}

export default function DeleteDependencyModal({
  dependency,
  project,
  showModal,
  onSuccess,
  onHideModal,
}: DeleteDependencyModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher({ key: "delete-test" });

  const handleClickConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    fetcher.submit(formRef.current, {
      method: "POST",
      action: `/api/projects/${project.name}/setup/delete`,
    });
  };

  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (isServerErrorWithMessage(fetcher.data)) return;

      onHideModal && onHideModal();
      onSuccess();
      fetcher.data = undefined;
    }
  }, [onHideModal, onSuccess, fetcher]);

  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);

  return (
    <Modal
      showModal={showModal}
      onHideModal={onHideModal}
      title="Are you sure?"
      buttons={[
        {
          children: (
            <>
              <FaTrash />
              Confirm
            </>
          ),
          color: "error",
          onClick: handleClickConfirm,
          loading: fetcher.state !== "idle",
        },
      ]}
    >
      <p className="text-sm">
        Are you sure you want to delete dependency <b>{dependency}</b>?
      </p>
      {isServerErrorWithMessage(fetcher.data) && (
        <Alert
          message={fetcher.data.error.message}
          className="mt-2"
          color="error"
        />
      )}
      <fetcher.Form ref={formRef}>
        <input type="hidden" name="setup" value={dependency} />
      </fetcher.Form>
    </Modal>
  );
}
