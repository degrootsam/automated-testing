import {
  Form,
  Link,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { SuiteOutletContext } from "..";
import {
  Alert,
  Autocomplete,
  Badge,
  Button,
  Card,
  Heading,
  Radio,
  TextField,
  Toggle,
  Tooltip,
} from "~/components";
import { FaQuestionCircle, FaSave } from "react-icons/fa";
import {
  isServerErrorWithMessage,
  parseErrorToMessage,
  parseName,
} from "~/utils";
import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Project, TestHelper } from "~/utils/index.server";
import { Project as PWProject } from "@playwright/test";
import { DependencyNode, Test } from "~/utils/test-helper/types";
import {
  Node as XYNode,
  Edge as XYEdge,
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import reactFlowStyleSheet from "@xyflow/react/dist/style.css?url";
import { buildDependencyGraph, getLayoutedElements } from "~/utils/react-flow";
import classNames from "classnames";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: reactFlowStyleSheet }];
};

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.name;
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const test = formData.get("test")?.toString();
  const suite = formData.get("suite")?.toString();
  const session = formData.get("session")?.toString() as "reuse" | "fresh";
  const dependencies = formData.get("dependencies")?.toString();

  if (!projectName || !name || !test || !suite || !session) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const dependencyArray = dependencies?.split(",").filter(Boolean) || [];
    const parsedName = parseName(name);
    await testHelper.createSetup(
      parsedName,
      suite,
      test,
      dependencyArray,
      session === "reuse",
    );
    return redirect("../configuration");
  } catch (err) {
    const message = parseErrorToMessage(err);
    return Response.json({ error: { message } });
  }
};

interface LoaderResponse {
  suite: {
    name: string;
    availableDependencies: PWProject[];
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

    const dependencyGraph = testHelper.getDependencyGraph(suite);
    const fullDependencyTree = testHelper.generateDependencyTree(suite);

    return Response.json({
      suite: {
        name: suite,
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

export default function CreateSetup() {
  const actionData = useActionData<typeof action>();
  const {
    suite: { availableDependencies, dependencyGraph: depGraph, dependencyTree },
  } = useLoaderData<LoaderResponse>();

  const { suite, project } = useOutletContext<SuiteOutletContext>();

  const [sessionBehaviour, setSessionBehaviour] = useState<"reuse" | "fresh">(
    "reuse",
  );
  const [dependencyGraph, setDependencyGraph] = useState<{
    nodes: XYNode[];
    edges: XYEdge[];
  }>(depGraph);

  const onChangeSessionBehaviour = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const name = event.currentTarget.name;
    setSessionBehaviour(name as "reuse" | "fresh");
  };
  const fetcher = useFetcher();

  const [availableTests, setAvailableTests] = useState<Test[]>([]);

  const testFetcher = useFetcher<{ tests: Test[] }>({ key: "list-tests" });

  const onSearchChange = (q: string) => {
    testFetcher.load(`/api/tests/${project.name}/list?q=${q}`);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (testFetcher.data) {
      if (isServerErrorWithMessage(testFetcher.data)) return;
      const tests = testFetcher.data.tests;
      setAvailableTests(tests);
    }
  }, [testFetcher.data]);

  const [enabledDeps, setEnabledDeps] = useState<Set<string>>(new Set());

  const onChangeDependencyToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.dataset.dependency!;
    setEnabledDeps((prev) => {
      const next = new Set(prev);
      if (e.currentTarget.checked) next.add(name);
      else next.delete(name);
      return next;
    });
  };

  function filterTree(
    nodes: DependencyNode[],
    enabled: Set<string>,
  ): DependencyNode[] {
    const out: DependencyNode[] = [];
    for (const node of nodes) {
      if (enabled.has(node.name)) {
        // user explicitly enabled this node → include it with ALL its children
        out.push(node);
      } else {
        // this node isn’t enabled → maybe one of its descendants is?
        // if so, collect those sub-trees
        out.push(...filterTree(node.dependencies, enabled));
      }
    }
    return out;
  }

  function flattenTree(nodes: DependencyNode[]): PWProject[] {
    const projects: PWProject[] = [];
    function dfs(n: DependencyNode) {
      projects.push({
        name: n.name,
        metadata: n.metadata,
        // only the _names_ of its child dependencies
        dependencies: n.dependencies.map((c) => c.name),
      });
      n.dependencies.forEach(dfs);
    }
    nodes.forEach(dfs);
    return projects;
  }

  useEffect(() => {
    // 1) whenever toggles change you have:
    const subtrees = filterTree(dependencyTree, enabledDeps);

    // 2) flatten & dedupe
    const projects = flattenTree(subtrees);
    const uniqueProjects = Array.from(
      new Map(projects.map((p) => [p.name, p])).values(),
    );
    const { nodes, edges } = buildDependencyGraph(uniqueProjects);
    const layoutedDepGraph = getLayoutedElements(nodes, edges);
    setDependencyGraph(layoutedDepGraph);
  }, [enabledDeps]);

  const mapDependencies = (
    deps: DependencyNode[],
    parent?: string,
  ): React.ReactNode[] =>
    deps.map((dep, i) => (
      <div key={`${dep.name}-${i}`} className="w-full">
        <div className="flex flex-row gap-4 items-center p-4">
          <Toggle
            className={
              parent && enabledDeps.has(parent) ? "cursor-not-allowed" : ""
            }
            data-dependency={dep.name}
            data-parent={parent}
            onChange={onChangeDependencyToggle}
            id={`${dep.name}-toggle`}
            checked={
              enabledDeps.has(dep.name) ||
              (parent && enabledDeps.has(parent)) ||
              false
            }
          />
          <label
            htmlFor={`${dep.name}-toggle`}
            className={classNames(
              parent && enabledDeps.has(parent) ? "cursor-not-allowed" : "",
              "font-bold text-sm",
            )}
          >
            {dep.name}
          </label>
          <Badge
            color={dep.metadata.type === "suite" ? "primary" : "secondary"}
            size="sm"
          >
            {dep.metadata.type}
          </Badge>
        </div>
        <div className="ml-4 bg-base-300 shadow-inner flex flex-row items-center">
          {mapDependencies(dep.dependencies, dep.name)}
        </div>
      </div>
    ));

  return (
    <Form method="POST">
      <div className="grid gap-4">
        <div className="flex flex-row items-center justify-between">
          <Heading size="h1">Create dependency</Heading>
          <div className="flex flex-row gap-2">
            <Link to="../configuration">
              <Button type="button">Go back</Button>
            </Link>
            <Button
              color="primary"
              type="submit"
              loading={fetcher.state !== "idle"}
            >
              <FaSave />
              Save
            </Button>
          </div>
        </div>
        <Card>
          <input
            type="hidden"
            name="dependencies"
            value={Array.from(enabledDeps.values()).join(",")}
          />
          <input type="hidden" name="suite" value={suite} />
          <input type="hidden" name="session" value={sessionBehaviour} />
          <div className="grid gap-4">
            <div>
              <p className="text-sm mb-2">
                A dependency is a test which you can re-use between suites. Each
                dependency can have its own subset of dependencies.
              </p>
              {isServerErrorWithMessage(actionData) && (
                <Alert message={actionData.error.message} color="error" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold mb-1">Name</p>
              <TextField
                className="w-full"
                placeholder="E.g. admin-login"
                required
                name="name"
              />
            </div>
            <div>
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm font-bold mb-1">Session Behaviour</p>
                <Tooltip
                  message="Reusing your session data (cookies & local storage) will make
                        recording and replaying tests much faster—no need to log in every time.
                        If you need a truly clean slate, choose “Start fresh.” If your not sure, ask your developer!"
                >
                  <FaQuestionCircle className="opacity-30" />
                </Tooltip>
              </div>
              <fieldset>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Radio
                      onChange={onChangeSessionBehaviour}
                      checked={sessionBehaviour === "reuse"}
                      name="reuse"
                      defaultChecked
                    />
                    <p className="text-sm">Reuse session data</p>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <Radio
                      onChange={onChangeSessionBehaviour}
                      checked={sessionBehaviour === "fresh"}
                      name="fresh"
                    />
                    <p className="text-sm">Start fresh</p>
                  </div>
                </div>
              </fieldset>
            </div>

            <div>
              <p className="text-sm font-bold mb-1">Select a test</p>
              <Autocomplete
                debounce={300}
                name="test"
                options={availableTests.map((test) => ({
                  label: `${test.suite} - ${test.name}`,
                  value: test.path,
                }))}
                onSearchChange={onSearchChange}
              />
            </div>
            <div>
              <p className="text-sm font-bold mb-1">
                (Optional) Configure dependencies
              </p>
              <div className="grid grid-cols-12 gap-4 min-h-64">
                <div className="col-span-8 h-full">
                  <div className="w-full h-full shadow-lg rounded-lg p-4">
                    <div className="p-2">
                      <p className="text-xs text-neutral opacity-60">
                        {availableDependencies.length || 0} available{" "}
                        {availableDependencies.length > 0
                          ? "dependencies"
                          : "dependency"}{" "}
                        found
                      </p>
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
    </Form>
  );
}
