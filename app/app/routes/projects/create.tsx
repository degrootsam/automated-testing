import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { FaPlus } from "react-icons/fa6";
import { Alert, Button, Card, Progress, TextField } from "~/components";
import Page from "~/components/page";
import { commitSession, getSession, Project } from "~/utils/index.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const name = formData.get("name");

  if (!name) {
    return Response.json({
      error: {
        message: "Please provide a name",
      },
    });
  }

  const result = await Project.createProject(name.toString());

  if ("error" in result) {
    return Response.json(result);
  }

  session.flash("message", `Project ${result.name} created successfully`);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme") || "";

  return Response.json({ preferredTheme });
};

export default function Create() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";

  return (
    <Page
      title="Create a new project"
      preferredTheme={loaderData.preferredTheme}
    >
      <Card className="max-w-xl w-full">
        <Form method="post">
          {actionData && actionData.error && (
            <Alert
              message={actionData.error?.message}
              color="error"
              className="mb-4"
            />
          )}
          <div className="flex flex-col gap-4">
            {isSubmitting ? (
              <div>
                <p>Please wait while we create your new test project...</p>
                <Progress />
              </div>
            ) : (
              <>
                <p className="text-sm">
                  Naming your project should be done according to the following
                  convention: <b>customername-projectname-test</b>
                </p>
                <TextField
                  name="name"
                  className="w-full"
                  placeholder="Enter a project name..."
                />
              </>
            )}
            <div className="flex flex-row justify-end gap-4">
              <Link to="/" aria-disabled={isSubmitting || isLoading}>
                <Button disabled={isSubmitting || isLoading}>Cancel</Button>
              </Link>
              <Button
                type="submit"
                color="primary"
                loading={isSubmitting || isLoading}
              >
                <FaPlus />
                Create
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </Page>
  );
}
