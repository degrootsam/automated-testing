import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import { useState } from "react";
import { Alert, Button, Card, Heading } from "~/components";
import { parseErrorToMessage } from "~/utils";
import {
  commitSession,
  getSession,
  ProcessManager,
  Project,
  TestHelper,
} from "~/utils/index.server";
import { ProcessInfo } from "~/utils/process-manager/index.server";

interface LoaderResponse {
  process: ProcessInfo;
}

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderResponse>> => {
  const session = await getSession(request.headers.get("Cookie"));
  const recordedTest = session.get("recordedTest");
  if (!recordedTest) {
    throw new Response("You need to start a recording first!", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const projectName = params.name;
  const suite = params.suite;

  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const pm = new ProcessManager();
  const process = await pm.status("bb-testing-codegen");

  return Response.json({
    process,
  });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const projectName = params.name;
  const suite = params.suite;

  try {
    if (!projectName || !suite) {
      throw new Response(null, { status: 400, statusText: "Bad Request" });
    }

    const testFileName = session.get("recordedTest");

    if (!testFileName) {
      throw new Response("No test was found!", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const testName = testHelper.getTestName(testFileName);
    const testPath = testHelper.getTestPath(suite, testFileName);
    await testHelper.renameTestTitle(testPath, testName);

    session.set("recordedTest", "");

    return redirect("../view", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Errro",
    });
  }
};

export default function RecordStart() {
  const [errorMessage] = useState<string>();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <Heading size="h1">Recording saved 💾</Heading>
      </div>
      <Card className="max-w-xl w-full">
        {errorMessage && <Alert message={errorMessage} color="error" />}
        <p className="text-sm font-medium mb-4">
          The recording has been saved successfully! Please click
          &lsquo;Finish&rsquo; to finalize the recording
        </p>
        <div className="flex justify-end flex-row gap-2">
          <Link to="../record/start">
            <Button type="button" color="secondary">
              Restart Recording
            </Button>
          </Link>
          <Form method="POST">
            <Button type="submit" color="primary">
              Finish
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
