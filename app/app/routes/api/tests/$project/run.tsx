import { ActionFunctionArgs } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export interface TestsRunBody {
  project: string;
  suite?: string;
}

export const action = async ({ params }: ActionFunctionArgs) => {
  const projectName = params.project;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const process = await testHelper.runTestProject();
    return Response.json({ process });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
