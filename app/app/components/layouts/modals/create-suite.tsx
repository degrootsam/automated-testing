import { Project } from "@playwright/test";
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { Alert, Modal, TextField } from "~/components";
import { ModalProps } from "~/components/modal";
import { isServerErrorWithMessage } from "~/utils";

interface CreateTestSuiteModalProps {
  project: Project;
  showModal: ModalProps["showModal"];
  onHideModal: ModalProps["onHideModal"];
  onSuccess: () => void;
}

export default function CreateTestSuiteModal({
  showModal,
  onHideModal,
  project,
  onSuccess,
}: CreateTestSuiteModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const handleClickCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    fetcher.submit(formRef.current, { method: "POST" });
  };

  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (!isServerErrorWithMessage(fetcher.data)) {
        onHideModal && onHideModal();
        onSuccess();
        fetcher.data = undefined;
      }
    }
  }, [onHideModal, onSuccess, fetcher]);

  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);
  return (
    <Modal
      showModal={showModal}
      onHideModal={onHideModal}
      title="Create Test Suite"
      buttons={[
        {
          children: (
            <>
              <FaPlus />
              Create
            </>
          ),
          color: "primary",
          onClick: handleClickCreate,
          loading: fetcher.state !== "idle",
        },
      ]}
    >
      <fetcher.Form action="../suites/create" method="POST" ref={formRef}>
        <p className="text-sm mb-4">
          Most Betty Blocks applications are secured with{" "}
          <b>Role Based Access Control</b>. Therefore, the test suites you
          create should be based on the roles in your application.
        </p>
        {isServerErrorWithMessage(fetcher.data) && (
          <Alert message={fetcher.data.error.message} color="error" />
        )}
        <input type="hidden" name="project" value={project.name} />
        <TextField
          name="name"
          disabled={fetcher.state !== "idle"}
          className="w-full"
          placeholder="E.g: Admin"
          required
        />
      </fetcher.Form>
    </Modal>
  );
}
