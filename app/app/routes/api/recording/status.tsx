import { LoaderFunction } from "@remix-run/node";
import { parseErrorToMessage } from "~/utils";
import { ProcessManager } from "~/utils/index.server";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const processName = searchParams.get("process");

    if (!processName) {
      throw new Response(null, { status: 400, statusText: "Bad Request" });
    }
    const pm = new ProcessManager();
    const process = await pm.status(processName);

    console.log(process);

    return Response.json(process);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
