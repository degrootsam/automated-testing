import { ActionFunctionArgs } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";
import { ProcessInfo } from "~/utils/process-manager/index.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const projectName = params.project;
  const suite = params.suite;
  const test = params.test;

  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();

    const testHelper = new TestHelper(project, playwrightConfig);

    const startTestStatus = await testHelper.runTest(suite, test);

    return Response.json({ process: startTestStatus });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export interface SingleTestRunResult {
  process: ProcessInfo;
  test: string;
}
