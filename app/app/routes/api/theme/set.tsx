import { ActionFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/utils/index.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const theme = formData.get("theme");
  if (!theme) {
    return Response.json(null, { status: 400 });
  }
  const session = await getSession(request.headers.get("Cookie"));
  session.set("preferredTheme", theme);

  return Response.json(null, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
