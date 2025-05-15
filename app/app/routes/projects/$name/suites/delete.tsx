/* eslint-disable no-case-declarations */
import { ActionFunctionArgs } from "@remix-run/node";
import { Project, TestHelper } from "~/utils/index.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const projectName = params.name;
  const formData = await request.formData();

  const suite = formData.get("suite")?.toString();

  if (!projectName || !suite) {
    return Response.json(
      { error: { message: "Bad Request" } },
      { status: 400 },
    );
  }
  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  await testHelper.deleteSuite(suite);

  return Response.json({ success: true });
};
