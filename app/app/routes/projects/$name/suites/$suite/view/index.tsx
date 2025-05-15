import { LoaderFunction } from "@remix-run/node";
import { Button, Heading, RunTestButton } from "~/components";
import ListTests from "./list-tests";
import { Project, TestHelper } from "~/utils/index.server";
import { Project as PWProject } from "@playwright/test";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { SuiteOutletContext } from "..";
import { Test } from "~/utils/test-helper/types";
import { FaGear } from "react-icons/fa6";

interface TestResult extends Test {
  failed: boolean;
}
export interface LoaderResponse {
  tests: TestResult[];
  loginFlow: PWProject;
}

export const loader: LoaderFunction = async ({ params }) => {
  const suite = params.suite;
  const projectName = params.name;

  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);

  const tests = testHelper.listTests(suite);
  const summary = testHelper.getTestResults(suite, "suite", true);

  const mappedTests = tests.map((test) => ({
    ...test,
    failed: Boolean(summary?.failed.find((t) => t.name === test.name)),
  }));

  return Response.json({ tests: mappedTests, summary });
};

export default function ViewTestSuite() {
  const { project, suite } = useOutletContext<SuiteOutletContext>();
  const { tests } = useLoaderData<LoaderResponse>();

  return (
    <div className="grid gap-4">
      <div className="flex flex-row justify-between items-center">
        <Heading size="h1">Test Suite for {suite}</Heading>
        <div className="flex flex-row gap-2">
          {/* <Link to="../report/index.tsx"> */}
          {/*   <Button color="secondary" disabled> */}
          {/*     <TbDeviceAnalytics /> */}
          {/*     Report */}
          {/*   </Button> */}
          {/* </Link> */}
          <Link to={`../../suites/view`}>
            <Button>Go back</Button>
          </Link>
          <Link to={`/projects/${project.name}/suites/${suite}/configuration`}>
            <Button>
              <FaGear />
              Configure
            </Button>
          </Link>
          <RunTestButton type="suite" />
        </div>
      </div>

      <ListTests tests={tests} suite={suite} />
    </div>
  );
}
