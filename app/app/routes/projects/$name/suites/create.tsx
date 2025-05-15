import { ActionFunctionArgs } from "@remix-run/node";
import { Project, TestHelper } from "~/utils/index.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const projectName = params?.name?.toString();

  if (!name) {
    return Response.json({
      error: { message: "Name is required" },
    });
  }
  if (!projectName) {
    return Response.json({
      error: {
        message: "Project is required",
      },
    });
  }

  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  const newTestSuite = await testHelper.createSuite(name);

  return Response.json(newTestSuite);
};
