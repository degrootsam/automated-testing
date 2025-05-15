import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { ProjectOutletContext } from "../..";
import { Project } from "~/utils/index.server";
import { parseErrorToMessage } from "~/utils";

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<
  TypedResponse<{ suite: string; dependencies?: string[] }>
> => {
  const suite = params.suite;
  const projectName = params.name;

  if (!suite || !projectName) {
    throw new Response(null, {
      status: 400,
      statusText: "Internal Server Error",
    });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const currentSuite = playwrightConfig.projects?.find(
      (project) => project.name === suite,
    );
    const dependencies = currentSuite?.dependencies || [];

    return Response.json({ suite, dependencies });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export interface SuiteOutletContext extends ProjectOutletContext {
  suite: string;
  dependencies: string[];
}

export default function ViewSuite() {
  const { suite, dependencies } = useLoaderData<typeof loader>();
  const { project } = useOutletContext<ProjectOutletContext>();
  return <Outlet context={{ suite: suite, project, dependencies }} />;
}
