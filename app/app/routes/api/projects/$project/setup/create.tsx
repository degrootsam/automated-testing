import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.project;
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const test = formData.get("test")?.toString();
  const suite = formData.get("suite")?.toString();

  if (!projectName || !name || !test || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.createSetup(name, suite, test);
  } catch (err) {
    const message = parseErrorToMessage(err);
    return Response.json({ error: { message } });
  }

  return Response.json({ success: true });
};
