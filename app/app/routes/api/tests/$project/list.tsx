import { LoaderFunction } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const projectName = params.project;
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const q = searchParams.get("q");
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    let tests = testHelper.listTests();

    if (q) {
      tests = tests.filter((test) => test.name.match(q) || test.suite.match(q));
    }

    return Response.json({ tests: tests.slice(0, 49) });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
