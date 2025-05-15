import { ActionFunction } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.name;
  const suite = params.suite;
  const formData = await request.formData();
  const test = formData.get("test")?.toString();

  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.deleteTest(suite, test);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return Response.json({ success: true });
};
