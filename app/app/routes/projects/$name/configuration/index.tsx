import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { FaSave } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { Button, Card, Heading, TextField } from "~/components";
import { parseErrorToMessage } from "~/utils";
import { Project, TestHelper } from "~/utils/index.server";

export const action: ActionFunction = async ({ params, request }) => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const formData = await request.formData();
  const appURL = formData.get("appURL");

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();

    const { metadata } = playwrightConfig;
    await project.updatePlaywrightConfig({ metadata: { ...metadata, appURL } });
    return Response.json({ success: true });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

interface LoaderResponse {
  appURL?: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const appURL = testHelper.appURL;
    return Response.json({
      appURL,
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export default function Configuration() {
  const { appURL } = useLoaderData<LoaderResponse>();
  const formRef = useRef<HTMLFormElement>(null);

  const onSave = () => {
    const form = formRef.current;
    if (!form) return;

    if (!form.reportValidity()) {
      return;
    }

    form.submit();
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-row items-center justify-between">
        <Heading size="h1">Project configuration</Heading>
        <div className="flex flex-row gap-2">
          <Button color="primary" onClick={onSave}>
            <FaSave /> Save
          </Button>
        </div>
      </div>
      <Card className="w-full h-full">
        <Form method="POST" ref={formRef}>
          <div className="grid gap-2 max-w-lg">
            <label htmlFor="appURl" className="text-sm font-bold">
              App URL
            </label>
            <TextField
              id="appURL"
              className="w-full"
              name="appURL"
              icon={FaLink}
              iconPlacement="end"
              defaultValue={appURL ? appURL : undefined}
            />
          </div>
        </Form>
      </Card>
    </div>
  );
}
