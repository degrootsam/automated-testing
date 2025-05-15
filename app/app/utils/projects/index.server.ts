import fs from "fs";
import path from "path";
import { config, Git } from "../index.server";
import Director from "../director/index.server";
import { execSync } from "child_process";
import { parseName } from "..";
import { PlaywrightTestConfig } from "@playwright/test";
import { Project as TSProject, SyntaxKind, Node } from "ts-morph";
import { IProject } from "./types";

export default class Project {
  details: IProject;
  reservedNames: string[] = ["list", "create"];

  constructor(projectName: string) {
    this.details = this.getDetails(projectName);
  }

  get path() {
    return this.details.path;
  }

  get name() {
    return path.basename(this.path);
  }

  /**
   * Normalizes a given string to adhere to the BB Services standard
   * customername-projectname
   */
  static parseProjectName(name: string) {
    const parsed = parseName(name);
    return parsed.includes("test") ? parsed : `${parsed}-test`;
  }

  get playwrightConfigPath() {
    return path.resolve(this.details.path, "playwright.config.ts");
  }

  /**
   * Creates a new project in the /projects folder
   */

  static async createProject(
    name: string
  ): Promise<IProject | { error: { message: string } }> {
    const parsedName = this.parseProjectName(name);
    fs.mkdirSync(config.projectsPath, { recursive: true });
    const projectPath = path.resolve(config.projectsPath, parsedName);
    const projectExists = fs.existsSync(projectPath);

    if (projectExists) {
      return {
        error: {
          message: `Test project: ${parsedName} already exists locally! Please try a different name or remove the existing project`,
        },
      };
    }

    const git = new Git();
    const result = await git.createRepoFromTemplate({
      newRepoName: parsedName,
      templateOwner: "Betty-Blocks-Services",
      description:
        "This project was created using the bb-testing dashboard tool",
      templateRepo: "bb-testing-playwright-template",
    });

    if (!result) {
      return {
        error: {
          message:
            "Something went wrong while trying to create the project! Please try again later",
        },
      };
    }

    if ("error" in result) {
      return result;
    }

    const { html_url, clone_url } = result!;

    const { success, attempts, message } = await git.cloneRepository(
      clone_url,
      projectPath
    );

    console.log({ success, attempts, message });

    const vscodePath = `vscode://file/${projectPath}`;

    if (!success) {
      return {
        error: {
          message: message as string,
        },
      };
    }

    git.setOrAddRemote(projectPath, "origin", clone_url);

    execSync("npm install", { cwd: projectPath, stdio: "inherit" });

    return {
      name: parsedName,
      git: {
        initialized: true,
        branch: "origin",
        remoteUrl: "main",
        remoteHasChanges: success,
        localHasChanges: false,
        error: message,
      },
      path: projectPath,
      urls: {
        git: html_url,
        vscode: vscodePath,
      },
    };
  }

  private getDetails(projectName: string): IProject {
    // Get the absolute path to the project.
    const projectPath = path.resolve(config.projectsPath, projectName);

    if (Director.readDir(projectPath) === null) {
      throw new Error(`Project ${projectName} cannot be found!`);
    }

    // Check if the project directory is git-initialized (i.e. contains a ".git" folder)
    const gitFolderPath = path.join(projectPath, ".git");
    const isGitInitialized = fs.existsSync(gitFolderPath);

    // Initialize default git properties.
    let remoteUrl: string | undefined;
    let branch: string | undefined;
    let error: string | undefined;

    // If the project is already a git repository, attempt to read additional details.
    if (isGitInitialized) {
      const gitConfigPath = path.join(gitFolderPath, "config");
      const configContent = Director.readFile(gitConfigPath);
      if (!configContent) {
        error =
          "Unable to read git's config! Please re-initialize the projects git repository";
      }

      // Try to find the remote "origin" URL in the git config.
      const remoteMatch =
        configContent &&
        configContent.match(/\[remote "origin"\]\s+url\s*=\s*(.+)/);
      if (remoteMatch) {
        remoteUrl = remoteMatch[1].trim();
      }
      // For simplicity we assume the branch is "main" (this could be parsed from HEAD if needed).
      branch = "main";
    }

    // Generate URL strings.
    // For VSCode, the URI schema "vscode://file/<path>" can be used to open a folder directly.
    const vscodeUrl = `vscode://file/${projectPath}`;
    // The git URL can be derived from the remote if available.
    const gitUrl = remoteUrl || "";

    return {
      name: projectName,
      path: projectPath,
      git: {
        initialized: isGitInitialized,
        remoteUrl,
        branch,
        remoteHasChanges: false,
        localHasChanges: false,
        error: error,
      },
      urls: {
        vscode: vscodeUrl,
        git: gitUrl,
      },
    };
  }

  /**
   * Scans the projects directory and converts each project folder into a Project object.
   */
  static listProjects(): IProject[] {
    // Read the directory containing the projects.
    const projectDirs =
      Director.readDir(config.projectsPath, { withFileTypes: true })
        ?.filter((value: fs.Dirent) => value.isDirectory())
        .map((dir) => dir.name) || [];
    const projects: IProject[] = [];

    for (const projectName of projectDirs) {
      const projectDetails = new Project(projectName as string).details;
      if (projectDetails) {
        projects.push(projectDetails);
      }
    }
    return projects;
  }

  /**
   * Returns the defined config in playwright.config.ts for the current project
   */
  async getPlaywrightConfig(): Promise<PlaywrightTestConfig> {
    const project = new TSProject();
    const source = project.addSourceFileAtPath(this.playwrightConfigPath);

    // 1) grab `export default defineConfig(...)`
    const exportAssign = source.getExportAssignmentOrThrow(
      (assignment) => assignment.isExportEquals() === false
    );
    const callExpr = exportAssign.getExpressionIfKindOrThrow(
      SyntaxKind.CallExpression
    );
    const objLit = callExpr
      .getArguments()[0]
      .asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    // Recursive parser for AST nodes into JS values
    function parseNode(node: Node): unknown {
      if (Node.isStringLiteral(node)) {
        return node.getLiteralText();
      }
      if (Node.isNumericLiteral(node)) {
        return parseFloat(node.getText());
      }
      const kind = node.getKind();
      if (kind === SyntaxKind.TrueKeyword) return true;
      if (kind === SyntaxKind.FalseKeyword) return false;

      if (Node.isObjectLiteralExpression(node)) {
        const obj: Record<string, unknown> = {};
        for (const prop of node.getProperties()) {
          if (Node.isPropertyAssignment(prop)) {
            const key = prop.getName();
            const valNode = prop.getInitializerOrThrow();
            obj[key] = parseNode(valNode);
          }
        }
        return obj;
      }
      if (Node.isArrayLiteralExpression(node)) {
        return node.getElements().map((elem) => parseNode(elem));
      }
      // fallback: raw code for expressions (includes process.env)
      return node.getText();
    }

    const result: Record<string, unknown> = {};
    for (const prop of objLit.getProperties()) {
      if (!Node.isPropertyAssignment(prop)) continue;
      const name = prop.getName();
      const init = prop.getInitializerOrThrow();
      result[name] = parseNode(init);
    }
    return result;
  }

  /**
   * Updates the playwright config for the current project.
   */
  async updatePlaywrightConfig(
    updates: Partial<PlaywrightTestConfig>
  ): Promise<void> {
    const project = new TSProject();
    const source = project.addSourceFileAtPath(this.playwrightConfigPath);

    const defaultExport = source.getExportAssignmentOrThrow(
      (assignment) => assignment.isExportEquals() === false
    );
    const callExpr = defaultExport.getExpressionIfKindOrThrow(
      SyntaxKind.CallExpression
    );
    const objLit = callExpr
      .getArguments()[0]
      .asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    function toCode(val: unknown): string {
      if (val === undefined) return "undefined";
      if (typeof val === "string") return JSON.stringify(val);
      if (typeof val === "number" || typeof val === "boolean")
        return String(val);
      if (Array.isArray(val)) {
        const items = val.map((item) => toCode(item)).join(", ");
        return `[${items}]`;
      }
      if (val && typeof val === "object") {
        const entries = Object.entries(val as Record<string, unknown>)
          .map(([k, v]) => {
            const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k)
              ? k
              : JSON.stringify(k);
            return `${key}: ${toCode(v)}`;
          })
          .join(", ");
        return `{ ${entries} }`;
      }
      // Fallback
      return JSON.stringify(val);
    }

    for (const [key, value] of Object.entries(updates)) {
      const valText = toCode(value);

      const prop = objLit.getProperty(key);
      if (prop && Node.isPropertyAssignment(prop)) {
        prop.setInitializer(valText);
      } else {
        objLit.addPropertyAssignment({ name: key, initializer: valText });
      }
    }

    await source.save();
  }
}
