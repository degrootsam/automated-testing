import type {
  PlaywrightTestConfig,
  Project as PWProject,
} from "@playwright/test";
import fs from "fs";
import path from "path";
import { SyntaxKind, Node as TSNode, Project as TSProject } from "ts-morph";
import { parseErrorToMessage, parseName } from "..";
import { Director, ProcessManager } from "../index.server";
import Project from "../projects/index.server";
import {
  PlaywrightDashboardReport,
  PlaywrightDashboardSummaryReport,
} from "./reporter";
import { DependencyNode, Suite, Test } from "./types";
import { buildDependencyGraph, getLayoutedElements } from "../react-flow";

export default class TestHelper {
  private project: Project;
  public config: PlaywrightTestConfig;

  reservedNames: string[] = ["list", "create", "edit", "delete", "view"];

  constructor(project: Project, config: PlaywrightTestConfig) {
    this.project = project;
    this.config = config;
    this.ensureDashboardReporter();
  }

  saveConfig() {
    Director.writeFile(this.staticConfigPath, JSON.stringify(this.config), {
      encoding: "utf-8",
    });
  }

  private ensureDashboardReporter() {
    Director.makeDir(path.dirname(this.customReporterPath), {
      recursive: true,
    });

    const originalReporterPath = path.join(
      process.cwd(),
      "app/utils/test-helper/reporter/index.ts",
    );
    Director.copyFile(originalReporterPath, this.customReporterPath);
  }

  /**
   * @returns Path to the directory containing tests (can be configured in the playwright.config.ts)
   */
  get testPath() {
    return path.resolve(this.project.path, this.config.testDir || "./src");
  }

  /**
   * @returns The path in which the test reporters are stored
   */
  get reportsPath() {
    return path.resolve(this.project.path, this.reportsDirname);
  }

  get customReporterPath() {
    return path.resolve(this.reportsPath, "reporters", "dashboard-reporter.ts");
  }

  /**
   * @returns The directory name in which to store the reporters
   */
  get reportsDirname() {
    return "reports";
  }

  /**
   * @returns Path to the playwright.static.json file in the current project
   */
  get staticConfigPath() {
    return path.resolve(this.project.path, "playwright.static.json");
  }

  /**
   * @returns Path to the playwright.config.ts in the current project
   */
  get playwrightConfigPath() {
    return path.resolve(this.project.path, "playwright.config.ts");
  }

  /**
   * @returns Relative path from the project's folder to the tests directory
   *
   * @example src/tests/admin
   */
  get relativeTestPath() {
    return path.relative(this.project.path, this.testPath);
  }

  /**
   * @returns the appUrl from the playwright config
   */
  get appURL(): string {
    return this.config.metadata?.appURL;
  }

  /**
   * Returns the absolute path to the test directory for the given suite
   */
  getTestPathForSuite(suiteName: string): string {
    return path.resolve(this.testPath, suiteName, "tests");
  }

  getSetupPath(suite: string, test: string) {
    return path.join(this.getSetupDir(suite), test);
  }

  getSetupDir(suite: string) {
    return path.join(this.relativeTestPath, suite, "setup");
  }

  getProjectDir(projectName: string) {
    return path.join(this.testPath, projectName);
  }

  getTestPath(suite: string, test: string) {
    return path.join(this.testPath, suite, "tests", test);
  }

  /**
   * @returns List of tests suites (directories) in the configured 'testDir'.
   */
  listSuites(): Suite[] {
    return (
      this.config.projects
        ?.filter(
          (project) =>
            project.metadata?.type === "suite" && Boolean(project.name),
        )
        .map((suite) => ({
          name: suite.name!,
          config: suite,
          results: this.getTestResults(suite.name!, "suite", true),
        })) || []
    );
  }

  /**
   * Creates a new test suite (directory) at the configured 'testDir'
   *
   * Also saves the suite as a new project into the config
   * @returns returns the path
   */
  async createSuite(name: string): Promise<string> {
    const parsedName = parseName(name);
    if (this.reservedNames.includes(parsedName)) {
      throw new Error(`${parsedName} is a reserved key word.`);
    }

    const newSuitePath = path.resolve(this.testPath, parsedName);
    const existingProject = this.config.projects?.find(
      (project) => project.name === parsedName,
    );

    if (existingProject) {
      throw new Error(`Test suite "${name}" already exists.`);
    }

    const newProject = {
      name: parsedName,
      dependencies: [],
      testDir: path.join("./", this.relativeTestPath, parsedName, "tests"),
      metadata: {
        type: "suite",
      },
    };

    await this.addProject(newProject);

    Director.makeDir(newSuitePath, { recursive: true });

    return newSuitePath;
  }

  async deleteSuite(suite: string) {
    const projectsToRemove = [];
    const suiteAsProject = this.config.projects?.find(
      (project) => project.name === suite,
    );

    if (suiteAsProject) {
      projectsToRemove.push(suiteAsProject);
    }

    const setupAsProject = this.getSetup(suite);

    if (setupAsProject) {
      projectsToRemove.push(setupAsProject);
    }

    if (projectsToRemove.length > 0) {
      await this.removeProjectFromConfig(projectsToRemove);
    }

    const suitePath = path.resolve(this.testPath, suite);

    console.log({ suitePath });
    Director.deletePath(suitePath);
  }

  matchTestName(testName: string): RegExpMatchArray | null {
    return testName.match(/(\.spec\.ts)|(\.spec\.js)/);
  }

  /**
   *
   * @param suiteName (optional) Name of the suite to list tests from
   * @returns if suiteName is provided, lists all tests within that suite else it returns all tests according to the config.
   */
  listTests(suiteName?: string): Test[] {
    if (suiteName) {
      const testsForSuitePath = this.getTestPathForSuite(suiteName);
      const tests = Director.readDir(testsForSuitePath, {
        recursive: true,
        withFileTypes: true,
      }) as fs.Dirent[];

      return (
        tests
          ?.filter((value) => this.matchTestName(value.name))
          .map((test) => ({
            name: test.name,
            path: path.join(test.parentPath, test.name),
            suite: suiteName,
          })) || []
      );
    } else {
      const tests: Test[] = [];
      const suites =
        this.config.projects?.filter(
          (proj) => proj.metadata?.type === "suite",
        ) || [];

      for (const suite of suites) {
        if (!suite.name) {
          console.warn("WARNING: Project contains no name", suite);
          continue;
        }
        const testPath = this.getTestPathForSuite(suite.name);

        const files: fs.Dirent[] =
          Director.readDir(testPath, {
            recursive: true,
            withFileTypes: true,
          }) || [];

        for (const file of files) {
          file.isFile() &&
            this.matchTestName(file.name) &&
            tests.push({
              name: file.name,
              path: path.join(file.parentPath, file.name),
              suite: path.basename(path.dirname(file.parentPath)),
            });
        }
      }
      return tests;
    }
  }

  /**
   *
   * @param name Name of the setup
   * @param suite Name of the suite the setup belongs to
   * @param test Path to the test file
   * @param dependencies Optional dependency array
   * @param storageState Whether or not the storage state should be shaved at the and of a test
   */
  async createSetup(
    name: string,
    suite: string,
    test: string,
    dependencies?: string[],
    storageState?: boolean,
  ): Promise<PWProject> {
    const existingProject = this.config.projects?.find(
      (project) => project.name === name,
    );
    if (existingProject) {
      throw new Error(`Setup "${name}" already exists!`);
    } else {
      const testName = path.basename(test);

      const setupPath = path.join(
        this.project.path,
        this.getSetupPath(suite, testName),
      );

      Director.copyFile(test, setupPath);

      Director.deletePath(test);

      if (storageState) {
        this.injectStorageState(setupPath, "storage-state.json");
      }

      const setupDir = this.getSetupDir(suite);

      const newProject: PWProject = {
        name,
        testMatch: path.basename(test),
        testDir: setupDir,
        metadata: {
          type: "setup",
        },
        dependencies,
      };

      await this.addProject(newProject);

      return newProject;
    }
  }

  async deleteSetup(name: string) {
    const setup = this.getSetup(name);
    if (!setup.testDir || !setup.testMatch) return;
    const relativeTestPath = path.join(setup.testDir, String(setup.testMatch));

    const setupPath = path.join(this.project.path, relativeTestPath);

    const testPath = path.join(
      this.project.path,
      path.dirname(setup.testDir || ""),
      "tests",
      String(setup.testMatch),
    );
    await this.removeProjectFromConfig(setup);

    Director.copyFile(setupPath, testPath);
    Director.deletePath(setupPath);
  }

  /**
   * Deletes a test from both the path and the config
   */
  async deleteTest(suite: string, test: string) {
    const testPath = this.getTestPath(suite, test);
    const dependentProjects = this.config.projects?.filter((project) =>
      project.dependencies?.includes(test),
    );
    const isDependency = dependentProjects && dependentProjects.length > 0;

    if (isDependency) {
      const newNonDependentProjects = dependentProjects.map((project) => ({
        ...project,
        dependencies:
          project.dependencies?.filter((dependency) => dependency !== test) ||
          [],
      }));
      const newProjects =
        this.config.projects?.map((project) => {
          const projectToReplace = newNonDependentProjects.find(
            (p) => p.name === project.name,
          );
          if (projectToReplace) {
            return projectToReplace;
          }
          return project;
        }) || [];

      this.config.projects = newProjects;

      await this.project.updatePlaywrightConfig({ projects: newProjects });
    }

    Director.deletePath(testPath);
  }

  private async addProject(project: PWProject) {
    const newProjects = this.config.projects || [];
    newProjects.push(project);

    this.config.projects = newProjects;

    await this.project.updatePlaywrightConfig({ projects: newProjects });
  }

  /**
   * Removes a project (or projects) from the Playwright config
   */
  private async removeProjectFromConfig(project: PWProject | PWProject[]) {
    if (Array.isArray(project)) {
      let newProjects = this.config.projects;
      for (let i = 0; i < project.length; i++) {
        const proj = project[i];
        newProjects =
          this.config.projects?.filter((p) => p.name !== proj.name) || [];
      }
      this.config.projects = newProjects;

      await this.project.updatePlaywrightConfig({ projects: newProjects });
    } else {
      const newProjects =
        this.config.projects?.filter((p) => project.name !== p.name) || [];
      this.config.projects = newProjects;
      await this.project.updatePlaywrightConfig({ projects: newProjects });
    }
  }

  /**
   * @param name Name of the project
   */
  getSetup(name: string): PWProject {
    const pwProject = this.config.projects?.find(
      (project) => project.name === name,
    );
    if (!pwProject) {
      throw new Error(`Project "${name}" does not exists`);
    }
    return pwProject;
  }

  /**
   * Gets all dependencies related to a setup
   * @param setup name of the setup to get the dependencies from
   */
  getSetupDependencies(setup: string): PWProject[] {
    const seen = new Set<string>();
    const result: PWProject[] = [];

    const visit = (name: string) => {
      if (!name || seen.has(name)) return;
      seen.add(name);

      const cfg = this.getSetup(name);
      if (!cfg) return; // missing config? just skip

      result.push(cfg);
      for (const dep of cfg.dependencies ?? []) {
        visit(dep);
      }
    };

    visit(setup);
    return result.filter((cfg) => cfg.name !== setup);
  }

  generateDependencyTree(suite?: string): DependencyNode[] {
    let projects = this.config.projects || [];
    if (suite) {
      projects = projects.filter(
        (dep) => dep.name !== suite && dep.metadata?.type === "setup",
      );
    }
    // 1) Build a map for O(1) lookups
    const configMap = new Map<string, PWProject>(
      projects.map((p) => [p.name!, p]),
    );

    // 2) Recursively build a DependencyNode from a project name
    function buildNode(projectName: string, seen: Set<string>): DependencyNode {
      if (seen.has(projectName)) {
        throw new Error(
          `Circular dependency detected: ${projectName}. Please remove "${projectName}" from the dependencies of the "${projectName}" project`,
        );
      }
      const cfg = configMap.get(projectName);
      if (!cfg) {
        throw new Error(`Dependency not found: "${projectName}"`);
      }
      seen.add(projectName);

      const dependencies = cfg.dependencies ?? [];

      // Default to an empty array if `dependencies` is undefined
      const childNames = dependencies.filter(Boolean);
      const children: DependencyNode[] = childNames
        .filter((dep) => dep !== suite)
        .map((dep) => buildNode(dep, new Set(seen)));

      return {
        name: cfg.name!,
        metadata: { type: cfg.metadata?.type },
        dependencies: children,
      };
    }

    // 3) Collect all nested dependency names so we know which setups
    //    are already consumed by suites
    const consumed = new Set<string>();
    const results: DependencyNode[] = [];

    function mark(node: DependencyNode) {
      for (const child of node.dependencies) {
        if (!child.name) continue;
        consumed.add(child.name!);
        mark(child);
      }
    }
    // First, build a tree for each suite
    for (const suite of projects.filter((p) => p.metadata?.type === "suite")) {
      if (!suite.name) continue;
      const root = buildNode(suite.name, new Set());
      // mark every nested dependency as consumed
      mark(root);
      results.push(root);
    }

    // Finally, append any standalone setup steps not already consumed
    for (const setup of projects.filter((p) => p.metadata?.type === "setup")) {
      if (!setup.name) continue;
      if (!consumed.has(setup.name)) {
        results.push(buildNode(setup.name!, new Set()));
      }
    }

    return results;
  }

  getDependencyGraph(
    suite: string,
    direction: "LR" | "RL" | "TB" | "BT" = "TB",
  ) {
    const subConfigs = this.getSetupDependencies(suite).reverse();
    const { nodes, edges } = buildDependencyGraph(subConfigs);

    return getLayoutedElements(nodes, edges, direction);
  }

  async addOrRemoveDependencyFromSuite(suite: string, dependency: string) {
    const pwProject = this.getSetup(suite);
    let dependencies = pwProject.dependencies || [];

    if (dependencies.includes(dependency)) {
      dependencies = dependencies.filter((dep) => dep !== dependency);
    } else {
      dependencies.push(dependency);
    }

    const updatedProject = { ...pwProject, dependencies };

    console.log({ updatedProject, pwProject, dependencies });

    const projects = this.config.projects?.map((project) => {
      if (project.name === pwProject.name) {
        return updatedProject;
      }
      return project;
    });

    await this.project.updatePlaywrightConfig({ projects });
  }

  /**
   * Useful utility function to check if a Dirent matches the test pattern.
   *
   * E.g.:
   * - Is a file
   * - Matches <name>.spec.ts
   */
  matchDirentToTest(dirent: fs.Dirent) {
    return dirent.isFile() && this.matchTestName(dirent.name);
  }

  getTestsForSetup(setup: PWProject): string[] | undefined {
    if (setup.testDir) {
      const directory = path.join(this.project.path, setup.testDir);
      return (
        Director.readDir(directory, {
          withFileTypes: true,
          recursive: true,
        })
          ?.filter(this.matchDirentToTest, this)
          ?.map((dirent: fs.Dirent) => dirent.name) || []
      );
    }

    if (setup.testMatch) {
      const directory = this.testPath;
      return (
        Director.readDir(directory, {
          recursive: true,
          withFileTypes: true,
        })
          ?.filter(this.matchDirentToTest, this)
          .map((dirent: fs.Dirent) => dirent.name) || []
      );
    }
  }

  /**
   * Retursn all project's in the PlaywrightConfig that have the metadata type "setup"
   */
  listSetups(): PWProject[] {
    return (
      this.config.projects?.filter(
        (project) => project.metadata?.type === "setup",
      ) || []
    );
  }

  /**
   *
   * Simply splits the given name on each period (.) and
   * returns the first item of the produced array
   *
   * @param fileName the filename of the test
   *
   * @example getTestName("my-test.spec.ts") // "my-test"
   */
  getTestName(fileName: string) {
    return fileName.split(".")[0];
  }

  getResultPath(
    name: string,
    type: "suite" | "test" | "project",
    summary: boolean = false,
  ) {
    if (name.includes(".")) {
      throw new Error(
        "Please parse the name of the test file first with getTestName()",
      );
    }
    const resultName = summary
      ? `${type}-${name}.summary.json`
      : `${type}-${name}.json`;

    return path.join(this.reportsPath, resultName);
  }

  /**
   *
   * Simply runs a test with PlaywrightDashboardReporter as the reporter
   *
   * @param suiteName Name of the suite that contains the test
   * @param testName Name of the test file
   */
  async runTest(suiteName: string, fileName: string) {
    const testPath = path.resolve(this.testPath, suiteName, "tests", fileName);
    const testName = this.getTestName(fileName);

    const procName = ProcessManager.getProcessName(
      this.project.name,
      suiteName,
      testName,
    );
    const testResultPath = this.getResultPath(testName, "test");

    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: [
        "run",
        "test",
        "--",
        testPath,
        "--project",
        suiteName,
        "--reporter",
        this.customReporterPath,
      ],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: testResultPath,
      },
      cwd: this.project.path,
      autorestart: false,
    });

    return await pm.start(true);
  }

  // Overload for summary = true
  getTestResults(
    name: string,
    type: "test" | "suite" | "project",
    summary: true,
  ): PlaywrightDashboardSummaryReport | undefined;

  // Overload for summary = false
  getTestResults(
    name: string,
    type: "test" | "suite" | "project",
    summary: false,
  ): PlaywrightDashboardReport | undefined;

  // Implementation signature
  getTestResults(
    name: string,
    type: "test" | "suite" | "project",
    summary: boolean,
  ): PlaywrightDashboardReport | PlaywrightDashboardSummaryReport | undefined {
    const testResultPath = this.getResultPath(name, type, summary);
    const content = Director.readFile(testResultPath);
    if (!content) {
      return;
    }
    try {
      const results = JSON.parse(content);
      if (summary) {
        return results as PlaywrightDashboardSummaryReport;
      }

      return results as PlaywrightDashboardReport;
    } catch (err) {
      const message = parseErrorToMessage(err);
      throw new Error(
        `Unable to parse results for ${testResultPath}: ${message}`,
      );
    }
  }

  /**
   *
   * Simply runs a test suite with PlaywrightDashboardReporter as the reporter
   *
   * @param suiteName Name of the suite that contains the test
   */
  async runTestSuite(suiteName: string) {
    const procName = ProcessManager.getProcessName(
      this.project.name,
      suiteName,
    );
    const testResultPath = this.getResultPath(suiteName, "suite", false);

    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: [
        "run",
        "test",
        "--",
        "--project",
        suiteName,
        "--reporter",
        this.customReporterPath,
      ],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: testResultPath,
      },
      cwd: this.project.path,
      autorestart: false,
    });

    return await pm.start(true);
  }

  async runTestProject() {
    const procName = ProcessManager.getProcessName(this.project.name);
    const resultPath = this.getResultPath(this.project.name, "project");

    console.log({ resultPath, name: this.project.name });

    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: ["run", "test", "--", "--reporter", this.customReporterPath],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: resultPath,
      },
      cwd: this.project.path,
      autorestart: false,
    });

    return await pm.start(true);
  }

  /**
   *
   * Update a test file after it has been recorded inject:
   *
   *   await page.context().storageState({ path: "path-to-storage-state.json" }); // Store the auth state in storage-state.json
   *
   * @param filePath - The path to the test file.
   * @param storageStatePath - The path to where to store the storage state file
   *
   * @example
   * // … after saving the generated test file …
   * await injectStorageState(outputTestFilePath, authJsonPath);
   */
  async injectStorageState(
    filePath: string,
    storageStatePath: string,
  ): Promise<void> {
    const project = new TSProject();
    const source = project.addSourceFileAtPath(filePath);

    // find first test(...) call
    const testCalls = source
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((c) => {
        const expr = c.getExpression();
        return TSNode.isIdentifier(expr) && expr.getText() === "test";
      });
    if (testCalls.length === 0) return;

    const testCall = testCalls[0];
    const [, callback] = testCall.getArguments();
    if (
      TSNode.isArrowFunction(callback) ||
      TSNode.isFunctionExpression(callback)
    ) {
      const body = callback.getBody();
      if (TSNode.isBlock(body)) {
        // determine the injection text
        const injectText = `await page.context().storageState({ path: "${storageStatePath}" });`;

        // check if already exists
        const exists = body
          .getStatements()
          .some((stmt) => stmt.getText().includes(injectText));

        if (!exists) {
          body.addStatements(
            `await page.context().storageState({ path: "${storageStatePath}" });`,
          );
        }
      }
    }

    await source.save();
  }

  async renameTestTitle(filePath: string, newTitle: string): Promise<void> {
    const project = new TSProject();
    const source = project.addSourceFileAtPath(filePath);

    // find the first test(...) call
    const testCalls = source
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => {
        const expr = call.getExpression();
        return TSNode.isIdentifier(expr) && expr.getText() === "test";
      });
    if (testCalls.length === 0) return;

    const testCall = testCalls[0];
    const args = testCall.getArguments();
    if (args.length === 0) return;

    const firstArg = args[0];
    if (TSNode.isStringLiteral(firstArg)) {
      firstArg.setLiteralValue(newTitle);
    } else {
      // replace non-string first arg with a new title literal
      testCall.insertArgument(0, `"${newTitle}"`);
      testCall.removeArgument(1);
    }

    await source.save();
  }
}
