import { useLoaderData, useOutletContext } from "@remix-run/react";
import {
  Button,
  Card,
  CreateTestSuiteModal,
  DeleteTestSuiteModal,
  Heading,
  List,
  RunTestButton,
} from "~/components";
import { Project, TestHelper } from "~/utils/index.server";
import { LoaderFunction, TypedResponse } from "@remix-run/node";
import { useState } from "react";
import { FaFolderOpen, FaTrash, FaUser } from "react-icons/fa";
import { ProjectOutletContext } from "..";
import { parseErrorToMessage, upperCaseFirstLetter } from "~/utils";
import { ListItemProps } from "~/components/list";
import { Suite } from "~/utils/test-helper/types";

type LoaderResponse = {
  suites: Suite[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<TypedResponse<LoaderResponse>> => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response("Invalid project");
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const suites = testHelper.listSuites();

    return Response.json({
      suites,
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export default function ProjectDashboard() {
  const { project } = useOutletContext<ProjectOutletContext>();
  const { suites } = useLoaderData<LoaderResponse>();

  const mapTestSuites = (suites: Suite[]): ListItemProps[] => {
    return suites.map(
      (suite) =>
        ({
          title: suite.name,
          icon: FaUser,
          status: {
            ariaLabel: upperCaseFirstLetter(suite.results?.status),
            color: suite.results?.status === "passed" ? "success" : "error",
          },
          statusPosition: "start",
          buttons: [
            {
              icon: FaTrash,
              onClick: handleShowDeleteTestSuite,
              color: "error",
              "data-suite": suite.name,
            },
            {
              icon: FaFolderOpen,
              href: `/projects/${project.name}/suites/${suite.name}/view`,
            },
          ],
        }) as ListItemProps,
    );
  };

  const [showCreateTestSuite, setShowCreateTestSuite] =
    useState<boolean>(false);
  const handleShowCreateTestSuite = () => {
    setShowCreateTestSuite(true);
  };
  const handleHideCreateTestSuite = () => {
    setShowCreateTestSuite(false);
  };

  const [selectedSuite, setSelectedSuite] = useState<string>("");
  const [showDeleteTestSuite, setShowDeleteTestSuite] =
    useState<boolean>(false);
  const handleShowDeleteTestSuite = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { dataset } = event.currentTarget;
    if (!dataset.suite) return;

    setSelectedSuite(dataset.suite);
    setShowDeleteTestSuite(true);
  };

  const handleHideDeleteTestSuite = () => {
    setShowDeleteTestSuite(false);
  };

  return (
    <div className="w-full h-screen">
      <CreateTestSuiteModal
        project={project}
        showModal={showCreateTestSuite}
        onHideModal={handleHideCreateTestSuite}
        onSuccess={handleHideCreateTestSuite}
      />
      <DeleteTestSuiteModal
        suite={selectedSuite}
        project={project}
        showModal={showDeleteTestSuite}
        onSuccess={handleHideDeleteTestSuite}
        onHideModal={handleHideDeleteTestSuite}
      />
      <div className="grid gap-4">
        <div className="flex flex-row justify-between items-center">
          <Heading size="h1">Test Suites</Heading>

          <div className="flex flex-row gap-2">
            {/* <Link to="#"> */}
            {/*   <Button color="secondary"> */}
            {/*     <TbDeviceAnalytics /> */}
            {/*     Report */}
            {/*   </Button> */}
            {/* </Link> */}
            <RunTestButton type="project" />
          </div>
        </div>
        <Card className="w-full">
          <Heading size="h5" className="mb-4">
            Your Test Suites
          </Heading>
          <List
            items={mapTestSuites(suites)}
            title={`${suites.length} tests suites found`}
            noResultsText="No tests suites found"
            button={
              <Button onClick={handleShowCreateTestSuite} type="button">
                Create New Suite
              </Button>
            }
          />
        </Card>
      </div>
    </div>
  );
}
