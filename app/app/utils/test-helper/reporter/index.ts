/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import {
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  TestStep,
  Reporter,
  FullResult,
} from "@playwright/test/reporter";
import fs from "fs/promises";

type ReporterOptions = { outputPath?: string };

export interface PlaywrightDashboardResults {
  /** Test title */
  title: string;
  /** File path of the test */
  file: string;
  /** If an error occurred, this contains the message */
  error?: TestError;
  /** Cleaned, nested steps for this test */
  steps: CleanITestStep[];
  /** The Suite this test belongs to */
  parent?: Suite;
  /** Final test status (e.g. passed/failed) */
  status?: string;
  /** ISO string when the test began */
  startTime: string;
  stats?: { expected?: number; unexpected: number };
  /** The tests own duration in milliseconds (is measured from the moment Playwright calls your test function until it returns) */
  duration?: number;
  totalDuration?: number;
  /** Map of project dependencies (projectName → boolean) */
  dependencies?: Record<string, boolean>;
}

export interface ITestStep extends Omit<TestStep, "titlePath" | "parent"> {
  /** Extracted code snippet for this step */
  snippet?: string;
  /** Status of the step: "passed" | "failed" */
  status?: "failed" | "passed";
  parent?: ITestStep;
}

export interface CleanITestStep extends Omit<ITestStep, "parent" | "steps"> {
  /** Nested child steps, cleaned of circular refs */
  steps?: CleanITestStep[];
}

export interface PlaywrightDashboardReport extends FullResult {
  /** Array of per-test results including steps */
  results: Array<PlaywrightDashboardResults>;
}

export interface PlaywrightDashboardSummaryReport {
  name: string;
  status: "failed" | "passed" | "interrupted" | "timedout";
  total: number;
  passed: number;
  failed: { name: string }[];
  timestamp: number;
}
/**
 * A Playwright reporter that captures test steps, normalizes them,
 * and writes a JSON report suitable for a custom dashboard.
 */
export default class PlaywrightDashboardReporter implements Reporter {
  private details: PlaywrightDashboardResults[] = [];
  private outputPath: string;

  /**
   * Initialize the reporter with CLI/environment options.
   * @param _config The full Playwright config (unused here)
   * @param options Reporter options (e.g. override outputPath)
   */
  constructor(_config: FullConfig, options: ReporterOptions) {
    this.outputPath =
      process.env.CUSTOM_REPORTER_OUTPUT_PATH ||
      options?.outputPath ||
      "report.json";
  }

  /**
   * Called once before any tests run.
   * @param _config The full Playwright config
   * @param _suite The root suite of tests
   */
  onBegin(_config: FullConfig, _suite: Suite) {
    // No special setup needed
  }

  /**
   * Called when an individual test starts.
   * Initializes a new result entry with title, file, and startTime.
   * @param test The test case metadata
   * @param _result Placeholder result (initially empty)
   */
  onTestBegin(test: TestCase, _result: TestResult) {
    const startTime = new Date().toISOString();

    const parent = JSON.parse(
      JSON.stringify(
        {
          parent: test.parent,
        },
        this.getCircularReplacer(),
        2,
      ),
    );

    this.details.push({
      title: test.title,
      file: test.location.file,
      steps: [],
      startTime,
      ...parent,
    });
  }

  /**
   * Helper to create a JSON.stringify replacer that drops circular refs.
   */
  private getCircularReplacer() {
    const seen = new WeakSet<any>();
    return (_key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return; // omit circular
        }
        seen.add(value);
      }
      return value;
    };
  }

  /**
   * Called after each test step.
   * - Extracts a code snippet by reading the source file
   * - Serializes the step (dropping circular refs)
   * - Appends it to the current test's steps array
   * @param test The test case metadata
   * @param _result The test result so far
   * @param step The test step data
   */
  async onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    const rec = this.details.find(
      (r) => r.title === test.title && r.file === test.location.file,
    );
    if (!rec) return;

    let snippet: string | undefined;
    if (step.location) {
      try {
        const content = await fs.readFile(step.location.file, "utf-8");
        const lines = content.split(/\r?\n/);
        let depth = 0;
        const startLine = step.location.line - 1;
        const collected: string[] = [];
        for (let i = startLine; i < lines.length; i++) {
          const lineText = lines[i];
          collected.push(lineText);
          for (const ch of lineText) {
            if (ch === "(") depth++;
            if (ch === ")") depth--;
          }
          if (depth <= 0 && lineText.trim().endsWith(";")) break;
        }
        snippet = collected.join("\n").trim();
      } catch {
        snippet = undefined;
      }
    }

    const stepJson = JSON.parse(
      JSON.stringify(step, this.getCircularReplacer()),
    );

    rec.steps.push({
      ...stepJson,
      snippet,
      status: step.error ? "failed" : "passed",
    });
  }

  /**
   * Called when an individual test finishes.
   * Stores final status and duration on its result entry.
   * @param test The test case metadata
   * @param result The final test result
   */
  onTestEnd(test: TestCase, result: TestResult) {
    const rec = this.details.find(
      (r) => r.title === test.title && r.file === test.location.file,
    );
    if (rec) {
      rec.status = result.status;
      rec.duration = result.duration;
      rec.error = result.error as TestError;
    }
  }

  /**
   *
   * Normalize a flat array of raw steps into a sorted,
   * nested tree, dropping `parent` refs and nulls.
   * @param rawSteps Raw steps array (may include nulls and parent links)
   * @returns A cleaned, nested array of steps
   */
  private normalizeSteps(rawSteps: ITestStep[]): CleanITestStep[] {
    // take only the top‐level steps (no parent)
    const roots = rawSteps.filter((step) => !step.parent);
    // sort by start time
    roots.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    // recursive cleaner that also assigns status
    function clean(step: ITestStep): CleanITestStep {
      // clean children first
      const children = (step.steps ?? []).filter((c) => c !== null).map(clean);

      // determine own status: if any child failed, fail
      let status: CleanITestStep["status"] = step.status;
      if (children.some((c) => c.status === "failed")) {
        status = "failed";
      } else if (!status) {
        status = "passed";
      }

      // return cleaned step without parent
      return {
        ...step,
        steps: children,
        status,
      };
    }

    return roots.map(clean);
  }

  /**
   * Compute the total duration of a test run, including:
   *  - the “Before Hooks” fixture setup
   *  - your test’s own body (`result.duration`)
   *  - the “After Hooks” teardown
   *
   * @param res A single test’s dashboard result
   * @returns Total elapsed time in milliseconds
   */
  private getTotalDuration(res: PlaywrightDashboardResults): number {
    // Find the top‐level Before Hooks step
    const beforeMs =
      res.steps.find((s) => s.title === "Before Hooks")?.duration ?? 0;
    // Find the top‐level After Hooks step
    const afterMs =
      res.steps.find((s) => s.title === "After Hooks")?.duration ?? 0;
    // The test function’s own duration
    const bodyMs = res.duration ?? 0;

    return beforeMs + bodyMs + afterMs;
  }

  /**
   * Normalize a flat array of raw steps into a sorted,
   * nested tree, dropping `parent` refs and nulls, and
   * ensuring each step has a status (bubbling failures up).
   * @param rawSteps Raw steps array (may include nulls and parent links)
   * @returns A cleaned, nested array of steps
   */
  async onEnd(result: FullResult) {
    for (const result of this.details) {
      result.totalDuration = this.getTotalDuration(result);
      result.steps = this.normalizeSteps(result.steps as ITestStep[]);
    }

    const detailedReport = {
      results: this.details,
      status: result.status,
      duration: result.duration,
      startTime: result.startTime,
    } as PlaywrightDashboardReport;

    await fs.writeFile(
      this.outputPath,
      JSON.stringify(detailedReport, null, 2),
    );

    // Derive a base name and summary file name
    const baseName = this.outputPath.replace(/.*[\\/](.+)\.json$/, "$1");
    const summaryPath = this.outputPath.replace(/\.json$/, ".summary.json");

    const total = this.details.length;
    const passed = this.details.filter((r) => r.status === "passed").length;
    const failed = this.details
      .filter((r) => r.status !== "passed")
      .map((test) => ({ name: path.basename(test.file) }));

    const summary: PlaywrightDashboardSummaryReport = {
      name: baseName,
      status: result.status,
      total,
      passed,
      failed,
      timestamp: Date.now(),
    };
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf-8");
  }
}
