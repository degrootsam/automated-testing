import { Link, useOutletContext } from "@remix-run/react";
import { FaArrowRight, FaTrash } from "react-icons/fa6";
import { RiRecordCircleLine, RiTestTubeFill } from "react-icons/ri";
import { Button, Card, DeleteTestModal, Heading } from "~/components";
import List, { ListItemProps } from "~/components/list";
import { LoaderResponse as SuiteView } from "./";
import { StatusProps } from "~/components/status";
import React, { useState } from "react";
import { SuiteOutletContext } from "..";

export default function ListTests({
  tests,
  suite,
}: {
  tests: SuiteView["tests"];
  suite: string;
}) {
  const { project } = useOutletContext<SuiteOutletContext>();
  const mapTests = (t: SuiteView["tests"]): ListItemProps[] => {
    return (
      t.map((test) => ({
        title: test.name,
        status: {
          color: test.failed ? "error" : "success",
          ariaLabel: test.failed ? "This test failed" : "This test passed",
        } as StatusProps,
        statusPosition: "start",
        buttons: [
          {
            "data-test": test.name,
            icon: FaTrash,
            color: "error",
            onClick: showModal,
          },
          {
            "data-test": test.name,
            icon: FaArrowRight,
            href: `../tests/${test.name}/view`,
          },
        ],
        icon: RiTestTubeFill,
      })) || []
    );
  };

  const [showDeleteTestModal, setShowDeleteTestModal] =
    useState<boolean>(false);

  const [selectedTest, setSelectedTest] = useState<string>("");

  const showModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { dataset } = event.currentTarget;
    const test = dataset.test;
    if (!test) return;
    setSelectedTest(test);
    setShowDeleteTestModal(true);
  };

  const hideModal = () => {
    setShowDeleteTestModal(false);
  };

  return (
    <Card>
      <DeleteTestModal
        onHideModal={hideModal}
        suite={suite}
        test={selectedTest}
        project={project}
        onSuccess={hideModal}
        showModal={showDeleteTestModal}
      />
      <div className="flex flex-row items-center justify-between mb-4">
        <Heading size="h5">Tests for {suite}</Heading>
        <Link to="../record/start">
          <Button>
            <RiRecordCircleLine /> Record Test{" "}
          </Button>
        </Link>
      </div>
      <List
        noResultsText="No tests were found yet"
        title={`${tests.length} tests found`}
        items={mapTests(tests)}
      />
    </Card>
  );
}
