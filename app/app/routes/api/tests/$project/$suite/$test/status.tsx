import { LoaderFunctionArgs } from "@remix-run/node";
import { ProcessManager } from "~/utils/index.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const projectName = params.project;
  const suite = params.suite;
  const test = params.test;
  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const processName = ProcessManager.getTestProcessName(suite, test);
  const pm = new ProcessManager();
  const process = await pm.status(processName);

  return Response.json({ process });
};
