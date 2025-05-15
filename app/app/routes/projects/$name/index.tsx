import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Page from "~/components/page";
import { getSession, Project } from "~/utils/index.server";
import { IProject } from "~/utils/projects/types";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme");
  const projectName = params.name;
  if (!projectName) {
    return Response.json(null, { status: 400 });
  }
  const projectHelper = new Project(projectName);
  return { project: projectHelper.details, preferredTheme };
};

export interface ProjectOutletContext {
  project: IProject;
}

export default function ViewProject() {
  const { project, preferredTheme } = useLoaderData<typeof loader>();

  return (
    <Page
      title={project && project.name}
      withDrawer
      preferredTheme={preferredTheme}
      drawerItems={[
        // {
        //   label: "Dashboard",
        //   href: "",
        //   baseURL: `/projects/${project.name}/dashboard`,
        // },
        {
          label: "Test suites",
          href: "/view",
          baseURL: `/projects/${project.name}/suites`,
        },
        {
          label: "Configuration",
          href: "",
          baseURL: `/projects/${project.name}/configuration`,
        },
      ]}
    >
      <Outlet context={{ project }} />
    </Page>
  );
}
