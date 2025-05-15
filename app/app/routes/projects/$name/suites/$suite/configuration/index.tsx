import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/react/dist/routeModules";
import {
  Badge,
  Button,
  Card,
  DeleteDependencyModal,
  Heading,
  HelpDependencyModal,
  TextField,
  Toggle,
  Tooltip,
} from "~/components";
import { isServerErrorWithMessage, parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";
import reactFlowStyleSheet from "@xyflow/react/dist/style.css?url";
import { useEffect, useState } from "react";
import { Project as PWProject } from "@playwright/test";
import {
  Node as XYNode,
  Edge as XYEdge,
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import { FaQuestionCircle, FaPlus, FaTrash } from "react-icons/fa";
import { DependencyNode } from "~/utils/test-helper/types";
import { SuiteOutletContext } from "..";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: reactFlowStyleSheet }];
};

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.name;
  const suite = params.suite;

  const formData = await request.formData();
  const dependency = formData.get("dependency")?.toString();

  if (!dependency || !suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  if (dependency === suite) {
    throw new Response("Circular dependencies are not allowed", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.addOrRemoveDependencyFromSuite(suite, dependency);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return Response.json({ success: true });
};

interface LoaderResponse {
  suite: {
    name: string;
    availableDependencies: PWProject[];
    currentDependencies: string[];
    dependencyTree: DependencyNode[];
    dependencyGraph: {
      edges: XYEdge[];
      nodes: XYNode[];
    };
  };
}

export const loader: LoaderFunction = async ({ params }) => {
  const projectName = params.name;
  const suite = params.suite;
  if (!projectName || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const currentDependencies = testHelper
      .getSetupDependencies(suite)
      .flatMap((subSetups) => subSetups.name);
    const dependencyGraph = testHelper.getDependencyGraph(suite);
    const fullDependencyTree = testHelper.generateDependencyTree(suite);

    return Response.json({
      suite: {
        name: suite,
        currentDependencies,
        dependencyTree: fullDependencyTree,
        availableDependencies: playwrightConfig.projects?.filter(
          (project) => project.metadata?.type === "setup",
        ),
        dependencyGraph,
      },
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export default function ConfigureDependencies() {
  const { project } = useOutletContext<SuiteOutletContext>();
  const {
    suite: {
      name,
      dependencyGraph,
      dependencyTree,
      currentDependencies,
      availableDependencies,
    },
  } = useLoaderData<LoaderResponse>();

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const showModal = () => {
    setShowHelpModal(true);
  };

  const hideHelpModal = () => {
    setShowHelpModal(false);
  };

  const updateDepFetcher = useFetcher({ key: "update-deps" });
  const currentFetcher = useFetcher();

  const onChangeDependencyToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { dataset } = event.currentTarget;
    const dependency = dataset.dependency;
    if (!dependency) return;

    updateDepFetcher.submit({ dependency }, { method: "POST" });
  };

  useEffect(() => {
    if (currentFetcher.data) {
      if (isServerErrorWithMessage(currentFetcher.data)) return;

      currentFetcher.load("./");
    }
  }, [currentFetcher.data]);

  const mapDependencies = (deps: DependencyNode[]): React.ReactNode[] =>
    deps.map((dep, i) => (
      <div key={`${dep.name}-${i}`} className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-4 items-center p-4">
            <Toggle
              checked={currentDependencies.includes(dep.name)}
              data-dependency={dep.name}
              onChange={onChangeDependencyToggle}
            />
            <p className="font-bold text-sm">{dep.name}</p>
            <Badge
              color={dep.metadata.type === "suite" ? "primary" : "secondary"}
              size="sm"
            >
              {dep.metadata.type}
            </Badge>
          </div>
          <Button
            square
            data-name={dep.name}
            type="button"
            className="active:bg-error"
            onClick={showDeleteDepModal}
          >
            <FaTrash />
          </Button>
        </div>
        <div className="ml-4 bg-base-300 shadow-inner flex flex-row items-center">
          {mapDependencies(dep.dependencies)}
        </div>
      </div>
    ));

  const [deleteDepModalShown, setDeleteDepModalShow] = useState<boolean>(false);
  const [depToDelete, setDepToDelete] = useState<string>("");

  const showDeleteDepModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { dataset } = event.currentTarget;
    const name = dataset.name;

    if (!name) return;

    setDepToDelete(name);
    setDeleteDepModalShow(true);
  };

  const hideDeleteDepModal = () => {
    setDeleteDepModalShow(false);
  };

  return (
    <div className="grid gap-4">
      <HelpDependencyModal
        showModal={showHelpModal}
        onHideModal={hideHelpModal}
      />
      <DeleteDependencyModal
        showModal={deleteDepModalShown}
        onHideModal={hideDeleteDepModal}
        onSuccess={hideDeleteDepModal}
        project={project}
        dependency={depToDelete}
      />
      <div className="flex flex-row items-center justify-between">
        <Heading size="h1">Suite Configuration</Heading>
        <div className="flex flex-row gap-2">
          <Link to="../view">
            <Button>Go back</Button>
          </Link>
          <Button onClick={showModal}>
            <FaQuestionCircle />
            Help
          </Button>
        </div>
      </div>
      <Card>
        <div className="grid gap-4">
          <div>
            <p className="text-sm">
              <b>Name</b>
            </p>
            <TextField
              className="w-full"
              placeholder="name"
              name="suite"
              value={name}
              disabled
            />
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm">
                <b>Dependencies</b>
              </p>
              <Tooltip message="Dependencies are tests that are executed (in parallel) before each test or recording.">
                <FaQuestionCircle className="opacity-30" />
              </Tooltip>
            </div>

            <div className="grid grid-cols-12 gap-4 min-h-64">
              <div className="col-span-8 h-full">
                <div className="w-full h-full shadow-lg rounded-lg p-4">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-xs text-neutral opacity-60">
                      {availableDependencies.length || 0} available{" "}
                      {availableDependencies.length > 0
                        ? "dependencies"
                        : "dependency"}{" "}
                      found
                    </p>
                    <Link to="create-setup">
                      <Button color="primary">
                        <FaPlus /> Create
                      </Button>
                    </Link>
                  </div>
                  {mapDependencies(dependencyTree)}
                </div>
              </div>
              <div className="col-span-4 bg-base-200 rounded-lg">
                <ReactFlow
                  fitView
                  nodes={dependencyGraph.nodes}
                  edges={dependencyGraph.edges}
                >
                  <Background
                    color="#ccc"
                    size={2}
                    variant={BackgroundVariant.Dots}
                  />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
