import { ActionFunctionArgs } from "@remix-run/node";
import { Git, Project } from "~/utils/index.server";
import { IProject } from "~/utils/projects/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const projects = Project.listProjects();
  const git = new Git();
  const updatedProjects: IProject[] = [];

  for (const project of projects) {
    const { updated, message } = git.syncRepository(project.path);
    const currentGit = project.git;
    updatedProjects.push({
      ...project,
      git: { ...currentGit, remoteHasChanges: !updated, error: message },
    });
  }
  return Response.json({ projects: updatedProjects });
};
