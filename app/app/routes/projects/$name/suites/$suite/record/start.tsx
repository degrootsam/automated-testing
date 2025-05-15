import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useRef, useState } from "react";
import { MdFiberManualRecord } from "react-icons/md";
import { Alert, Button, Card, Heading, TextField, Tooltip } from "~/components";
import { parseErrorToMessage, parseName, simplifyURL } from "~/utils";
import {
  commitSession,
  Director,
  getSession,
  Project,
  ProcessManager,
  TestHelper,
} from "~/utils/index.server";
import path from "path";
import { ProcessInfo } from "~/utils/process-manager/index.server";
import { SuiteOutletContext } from "..";

interface LoaderResponse {
  hasDependencies: boolean;
  appURL: string;
  process: ProcessInfo;
}

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderResponse>> => {
  const projectName = params.name;
  const suite = params.suite;

  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }

  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  const appURL = simplifyURL(testHelper.appURL);
  const suiteDependencies = testHelper.getSetupDependencies(suite);
  const pm = new ProcessManager();
  const process = await pm.status("bb-testing-codegen");

  return Response.json({
    process,
    appURL,
    hasDependencies: suiteDependencies?.length > 0 || false,
  });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const suite = params.suite;
  const projectName = params.name;
  const formData = await request.formData();
  const testName = formData.get("name")?.toString();
  const url = formData.get("url")?.toString();

  if (!suite || !projectName) {
    throw new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();

    const testHelper = new TestHelper(project, playwrightConfig);

    const suiteConfig = testHelper.getSetup(suite);

    const hasDependencies =
      suiteConfig.dependencies && suiteConfig.dependencies.length > 0;

    if (hasDependencies) {
      const depFlags = suiteConfig.dependencies!.map(
        (dep) => `--project=${dep}`
      );
      const baseArgs = ["test", "--"];

      const args = [...baseArgs, ...depFlags];

      const storageStatePM = new ProcessManager({
        name: `bb-testing:${projectName}>${suite}>setup`,
        script: "npm",
        args,
        cwd: project.path,
        autorestart: false,
      });

      await storageStatePM.start(true);
    }

    const relativeTestPath = testHelper.relativeTestPath;

    let fileName = "";
    let outputPath = "";

    if (!testName) {
      return Response.json({
        error: { message: "Name is required" },
      });
    }

    fileName = `${parseName(testName!)}.spec.ts`;
    outputPath = path.join(relativeTestPath, suite, "tests", fileName);

    Director.makeDir(path.resolve(project.path, path.dirname(outputPath)), {
      recursive: true,
    });

    session.set("recordedTest", fileName);

    const startURL = `${testHelper.appURL}${url}`;

    const baseArgs = ["run", "codegen", "--", startURL, "-o", outputPath];

    if (hasDependencies) {
      baseArgs.push("--load-storage");
      baseArgs.push("storage-state.json");
    }

    const recordingPM = new ProcessManager({
      name: `bb-testing:${projectName}>${suite}>${fileName}`,
      script: "npm",
      args: baseArgs,
      cwd: project.path,
      autorestart: false,
    });

    const recProcessStatus = await recordingPM.start();

    if (
      recProcessStatus.status !== "launching" &&
      recProcessStatus.status !== "online"
    ) {
      throw new Error("We were unable to start the recording process!");
    }

    return redirect(`../record/status`, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export default function RecordStart() {
  const { project, suite } = useOutletContext<SuiteOutletContext>();
  const startRecording = useFetcher({ key: "start-recording" });
  const startRecordingRef = useRef<HTMLFormElement>(null);

  const { appURL, process, hasDependencies } = useLoaderData<LoaderResponse>();

  const [errorMessage] = useState<string>("");

  const handleStartRecording = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const form = startRecordingRef.current;
    if (!form) {
      return;
    }
    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);

    formData.append("project", project.name);
    formData.append("suite", suite);

    startRecording.submit(formData, {
      method: "POST",
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <Heading size="h1">Recording a Test</Heading>
      </div>

      <Card className="w-full max-w-xl">
        <startRecording.Form ref={startRecordingRef}>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-bold mb-2" htmlFor="name">
                Test Name
              </label>
              <TextField
                placeholder="Please enter a strong and clear name for the test"
                required
                name="name"
                id="name"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-bold mb-2" htmlFor="url">
                URL
              </label>
              <TextField
                name="url"
                id="url"
                label={appURL}
                className="w-full"
              />
            </div>
            {hasDependencies && (
              <Alert
                message="This suite contains dependencies! It might take a little longer to start the recording process."
                color="info"
              />
            )}
            {errorMessage && <Alert message={errorMessage} color="error" />}
            <div className="flex justify-end flex-row gap-2">
              <Link to="../../view">
                <Button type="button">Cancel</Button>
              </Link>
              <Tooltip message="The recording starts automatically once the browser opens">
                <Button
                  color="primary"
                  type="button"
                  loading={startRecording.state !== "idle"}
                  onClick={handleStartRecording}
                >
                  <MdFiberManualRecord /> Start Recording
                </Button>
              </Tooltip>
            </div>
          </div>
        </startRecording.Form>
      </Card>
    </div>
  );
}
