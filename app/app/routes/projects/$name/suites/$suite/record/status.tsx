/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { MdStop } from "react-icons/md";
import { Alert, Button, Card, Heading, Progress, Tooltip } from "~/components";
import { usePolling } from "~/hooks";
import { parseErrorToMessage } from "~/utils";
import { getSession, Project, ProcessManager } from "~/utils/index.server";
import { ProcessInfo } from "~/utils/process-manager/index.server";
import { IProject } from "~/utils/projects/types";

interface LoaderResponse {
  project: IProject;
  procName: string;
  process: ProcessInfo;
  suite: string;
}

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<TypedResponse<LoaderResponse>> {
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

  const { details: project } = new Project(projectName);

  const pm = new ProcessManager();
  const procName = `bb-testing:${projectName}>${suite}>${recordedTest}`;

  const process = await pm.status(procName);

  if (process.status === "errored") {
    console.error(
      `An error occurred in the recording process!`,
      process.stderr
    );
    throw new Response(process.stderr, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return Response.json({
    project,
    procName,
    process,
    suite,
  });
}

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const projectName = params.name;
  const suite = params.suite;
  const fileName = session.get("recordedTest");

  if (!projectName || !suite || !fileName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const pm = new ProcessManager();
  try {
    await pm.stop(`bb-testing:${projectName}>${suite}>${fileName}`);
    return redirect(`../record/finish`);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(
      `Something went wrong while trying to stop the recording: ${message}`,
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

export default function RecordStatus() {
  const stopRecording = useFetcher();

  const loaderData = useLoaderData<typeof loader>();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [shouldPollForStatus, setShouldPollForStatus] = useState<boolean>(true);

  const { data: recordingStatus, error: recordingStatusError } =
    usePolling<ProcessInfo>(
      shouldPollForStatus,
      `/api/recording/status?process=${loaderData.procName}`,
      2000
    );

  useEffect(() => {
    if (recordingStatusError) {
      setShouldPollForStatus(false);
      setErrorMessage(
        `An error occurred while fetching the status: ${recordingStatusError}`
      );
    }
  }, [recordingStatusError]);

  useEffect(() => {
    if (recordingStatus?.status === "stopped") {
      setShouldPollForStatus(false);
      stopRecording.submit(null, { method: "POST" });
    }
  }, [recordingStatus?.status]);

  console.log(recordingStatus);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <Heading size="h1">Ssst 🤫</Heading>
        <Heading size="h2" className="text-primary">
          RECORDING IN PROGRESS
        </Heading>
      </div>
      <Card className="max-w-xl">
        <div className="mb-4">
          <p className="text-sm font-medium">
            Use the Playwright browser to record your moves! Once you&apos;re
            done, close the recorder or use the button below to stop recording.
          </p>
        </div>
        {!errorMessage && (
          <Tooltip message="Recording in progress..." className="w-full mb-4">
            <Progress className="w-full" />
          </Tooltip>
        )}
        {errorMessage && <Alert message={errorMessage} color="error" />}
        <div className="flex justify-end flex-row gap-2">
          {!errorMessage && (
            <stopRecording.Form method="POST">
              <Button
                color="error"
                type="submit"
                loading={stopRecording.state !== "idle"}
              >
                <MdStop />
                Stop Recording
              </Button>
            </stopRecording.Form>
          )}
        </div>
      </Card>
    </div>
  );
}
