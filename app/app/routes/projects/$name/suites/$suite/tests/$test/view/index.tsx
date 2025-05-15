import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react";
import { FaPencilAlt } from "react-icons/fa";
import { Button, Card, Heading, RunTestButton } from "~/components";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";
import ResultSection from "./result-section";
import TestStepsSection from "./test-steps-section";
import { PlaywrightDashboardReport } from "~/utils/test-helper/reporter";
import { useEffect } from "react";
import { usePolling } from "~/hooks";
import { TestOutletContext } from "..";
import { ProcessInfo } from "~/utils/process-manager/index.server";

export interface TestView {
  test?: PlaywrightDashboardReport;
  name: string;
}

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<TypedResponse<TestView>> => {
  const projectName = params.name;
  const suite = params.suite;
  const testName = params.test;

  if (!suite || !projectName || !testName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const parsedTestName = testHelper.getTestName(testName);
    const testResults = testHelper.getTestResults(
      parsedTestName,
      "test",
      false,
    );

    const result: TestView = {
      test: testResults,
      name: parsedTestName,
    };
    return Response.json(result);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
export default function ViewTest() {
  const { project, suite, testName } = useOutletContext<TestOutletContext>();
  const { test, name } = useLoaderData<TestView>();
  const revalidator = useRevalidator();

  const runTestFetcher = useFetcher<{ process: ProcessInfo }>({
    key: "run-test",
  });

  const { data: runTestStatus, error: runTestStatusError } = usePolling<{
    process: ProcessInfo;
  }>(
    (runTestFetcher.data &&
      runTestFetcher.data.process.status === "stopped" &&
      runTestFetcher.state === "idle") ||
      false,
    `/api/tests/${project.name}/${suite}/${testName}/status`,
    300,
  );

  useEffect(() => {
    if (runTestStatusError) {
      alert(runTestStatusError);
      return;
    }

    if (
      runTestStatus?.process &&
      runTestStatus?.process.status === "stopped" &&
      runTestFetcher.state === "idle"
    ) {
      revalidator.revalidate();
    }
  }, [revalidator, runTestFetcher, runTestStatus?.process, runTestStatusError]);

  if (!test?.results) {
    return (
      <div className="flex items-center justify-center flex-col h-full">
        <Heading size="h1" className="mb-4">
          No Results!
        </Heading>
        <Card className="w-full max-w-xl">
          <p className="text-sm font-medium mb-4">
            We are unable to find results related to test{" "}
            <b>&ldquo;{testName}&rdquo;</b>.
          </p>
          <div className="flex justify-end gap-2">
            <Link to="../../view">
              <Button>Go back</Button>
            </Link>
            <RunTestButton type="test" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-row justify-between items-center">
        <Heading size="h1">{name}</Heading>
        <div className="flex flex-row gap-1">
          <Button color="secondary">
            <FaPencilAlt /> Edit
          </Button>
          <RunTestButton type="test" />
        </div>
      </div>
      <Card>
        <ResultSection test={test} />
      </Card>
      <Heading size="h3">Details</Heading>
      <Card>
        <TestStepsSection testResults={test} />
      </Card>
    </div>
  );
}
