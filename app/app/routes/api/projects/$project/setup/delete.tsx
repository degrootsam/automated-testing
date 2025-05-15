import { ActionFunction } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.project;
  const formData = await request.formData();
  const setup = formData.get("setup")?.toString();

  if (!projectName || !setup) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.deleteSetup(setup);
    return Response.json({ success: true });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
