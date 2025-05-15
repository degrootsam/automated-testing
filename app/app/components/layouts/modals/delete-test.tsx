import { useFetcher } from "@remix-run/react";
import { useRef, useCallback, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Alert } from "~/components";
import Modal, { ModalProps } from "~/components/modal";
import { isServerErrorWithMessage } from "~/utils";
import { IProject } from "~/utils/projects/types";

interface DeleteTestSuiteModalProps {
  test: string;
  suite: string;
  project: IProject;
  showModal: ModalProps["showModal"];
  onHideModal: ModalProps["onHideModal"];
  onSuccess: () => void;
}

export default function DeleteTestModal({
  test,
  suite,
  project,
  showModal,
  onSuccess,
  onHideModal,
}: DeleteTestSuiteModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher({ key: "delete-test" });

  const handleClickConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    console.log(`/projects/${project.name}/suites/${suite}/tests/delete`);

    fetcher.submit(formRef.current, {
      method: "POST",
      action: `/projects/${project.name}/suites/${suite}/tests/delete`,
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
        Are you sure you want to delete test <b>{test}</b>?
      </p>
      {isServerErrorWithMessage(fetcher.data) && (
        <Alert
          message={fetcher.data.error.message}
          className="mt-2"
          color="error"
        />
      )}
      <fetcher.Form ref={formRef}>
        <input type="hidden" name="test" value={test} />
      </fetcher.Form>
    </Modal>
  );
}
