import { Badge, Heading, Spin, Tooltip } from "~/components";
import { TestResults } from ".";
import { parseDate, upperCaseFirstLetter } from "~/utils";
import { useFetcher } from "@remix-run/react";
import { FaGear } from "react-icons/fa6";
import { Timer } from "~/components/animations";

export default function ResultSection({ test }: { test: TestResults }) {
  const runTestFetcher = useFetcher({ key: "run-test" });
  const isTestRunning = runTestFetcher.state !== "idle";

  const testDuration = test.duration?.toString().split(".")[0];

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Heading size="h6">Status:</Heading>
        {runTestFetcher.state === "idle" ? (
          <Badge
            size="xl"
            color={test.status === "passed" ? "success" : "error"}
          >
            {upperCaseFirstLetter(test.status)}
          </Badge>
        ) : (
          <Tooltip message="Your test is currenty running">
            <Badge color="info" size="xl">
              <Spin loop duration={3000}>
                <FaGear calcMode="animate-spin" />
              </Spin>
              Running
            </Badge>
          </Tooltip>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <p className="text-neutral opacity-30">
          {isTestRunning && "dd/MM/yy hh:mm:ss"}

          {!isTestRunning && parseDate(test.startTime, "dd/MM/yy hh:mm:ss")}
        </p>
        <Tooltip message={`Your test ran for ${testDuration} ms`}>
          <Badge size="xl" color="neutral">
            {isTestRunning && "0"}
            {!isTestRunning && <Timer countTo={Number(testDuration)} />} ms
          </Badge>
        </Tooltip>
      </div>
    </div>
  );
}
