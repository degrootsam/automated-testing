import { Project } from "~/utils/index.server";

export const loader = async () => {
  const projects = Project.listProjects();
  return Response.json({ projects });
};
