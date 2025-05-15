import { useEffect, useRef } from "react";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { animate } from "animejs";
import { FaCheck, FaLink, FaXmark } from "react-icons/fa6";
import { TiFlowChildren } from "react-icons/ti";

import { Badge, Collapse, Heading, MockCode, Status } from "~/components";
import { TestOutletContext } from "..";
import {
  CleanITestStep,
  PlaywrightDashboardReport,
  PlaywrightDashboardResults,
} from "~/utils/test-helper/reporter";

/**
 * Renders a single test step, optionally with nested children and code snippet.
 */
function TestStepItem({ step }: { step: CleanITestStep }) {
  const hasChildren =
    Boolean(step.steps && step.steps.length > 0) || Boolean(step.snippet);

  const titleContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {step.status === "passed" ? (
          <FaCheck className="text-success" />
        ) : (
          <FaXmark className="text-error" />
        )}
        <span className="font-bold">{step.title}</span>
      </div>
      <span className="text-neutral opacity-30 font-medium">
        {step.duration} ms
      </span>
    </div>
  );

  return (
    <Collapse
      variant={hasChildren ? "arrow" : undefined}
      open={hasChildren ? undefined : false}
      readonly={!hasChildren}
      bgClassName="bg-base-100"
      title={titleContent}
    >
      {/* Nested children */}
      {step.steps && step.steps.length > 0 && (
        <div className="mt-2 grid gap-2">
          {step.steps.map((child) => (
            <TestStepItem
              key={`${child.title}-${child.startTime}-${child.duration}`}
              step={child}
            />
          ))}
        </div>
      )}
      {/* Code snippet */}
      {step.snippet && (
        <div className="mt-2">
          <MockCode code={step.snippet} />
        </div>
      )}
    </Collapse>
  );
}

/**
 * Displays dependency information if this result was a dependency.
 */
function TestDetails({ isDependency }: { isDependency: boolean }) {
  if (!isDependency) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <FaLink size={20} />
        <Heading size="h5">Dependency</Heading>
      </div>
      <p className="text-sm">
        This test ran because it is marked as a dependency.
      </p>
    </div>
  );
}

/**
 * Collapsible section showing all steps for a test.
 */
function TestSteps({ steps }: { steps: CleanITestStep[] }) {
  return (
    <Collapse
      title={
        <div className="flex items-center gap-2">
          <TiFlowChildren size={20} />
          <span className="font-bold">Steps</span>
        </div>
      }
      bgClassName="bg-base-100"
    >
      <div className="pt-2 grid gap-2">
        {steps.map((step) => (
          <TestStepItem
            key={`${step.title}-${step.startTime}-${step.duration}`}
            step={step}
          />
        ))}
      </div>
    </Collapse>
  );
}

/**
 * Renders a single test result, including status, animation, and details.
 */
function TestResult({ result }: { result: PlaywrightDashboardResults }) {
  const runTestFetcher = useFetcher({ key: "run-test" });
  const isTestRunning = runTestFetcher.state !== "idle";
  const { dependencies } = useOutletContext<TestOutletContext>();
  const isDependency = dependencies.some((dep) => result.file.includes(dep));

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && !isTestRunning) {
      animate(ref.current, {
        translateY: ["-50px", "0px"],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutExpo",
      });
    }
  }, [isTestRunning]);

  return (
    <Collapse
      ref={ref}
      variant="arrow"
      bgClassName="bg-base-100"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Status
              color={result.status === "passed" ? "success" : "error"}
              animate={result.status !== "passed" ? "ping" : undefined}
            />
            <Heading size="h4">{result.title}</Heading>
            {isDependency && <Badge color="warning">Dependency</Badge>}
          </div>
          <span className="text-neutral opacity-30 font-medium">
            {result.duration} ms
          </span>
        </div>
      }
    >
      <div className="mt-4">
        <TestDetails isDependency={isDependency} />
        <TestSteps steps={result.steps} />
      </div>
    </Collapse>
  );
}

/**
 * Section showing all test results for a suite.
 */
export default function TestStepsSection({
  testResults,
}: {
  testResults: PlaywrightDashboardReport;
}) {
  return (
    <div className="grid gap-4">
      {testResults.results?.map((res) => (
        <TestResult key={`${res.title}-${res.startTime}`} result={res} />
      ))}
    </div>
  );
}
