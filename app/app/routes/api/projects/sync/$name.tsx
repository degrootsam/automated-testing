import { ActionFunctionArgs } from "@remix-run/node";
import { Git, Project } from "~/utils/index.server";
import { IProject } from "~/utils/projects/types";

export const action = ({ params }: ActionFunctionArgs) => {
  const name = params.name;

  const projects = Project.listProjects();
  const project = projects.find((project) => project.name === name);

  if (!project) {
    return Response.json({
      error: {
        message: `Unable to find project ${project}`,
      },
    });
  }

  const git = new Git();
  const { updated, message } = git.syncRepository(project.path);
  const newGitOptions: IProject["git"] = {
    ...project.git,
    remoteHasChanges: !updated,
    error: message,
  };
  const newProjects = projects.map((project) => {
    if (project.name === name) {
      return {
        ...project,
        git: newGitOptions,
      };
    } else {
      return project;
    }
  });
  return Response.json({ projects: newProjects });
};
