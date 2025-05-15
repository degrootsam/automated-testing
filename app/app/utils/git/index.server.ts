import { Octokit } from "@octokit/rest";
import { execSync } from "node:child_process";
import { config, Director } from "../index.server";
import { GitHttpError } from "./types";

/**
 * A Git helper class that:
 *  - Signs in the user by reading/storing credentials using Keychain.
 *  - Initializes an Octokit instance for GitHub API interactions.
 *  - Creates new repositories using a template repository.
 *  - Clones repositories locally.
 *  - Checks for updates on a repository or its submodules.
 */
export default class Git {
  private octokit: Octokit | null = null;
  /**
   * Signs in the user.
   *
   * If the token exists in the config, it uses that; otherwise, if you provide a token,
   * it will store it and initialize Octokit.
   *
   * @throws if no token is provided.
   */

  async signIn(token?: string): Promise<unknown> {
    const key = token || config.git.pat;
    if (!key)
      throw new Error("Unable to connect with GitHub! No PAT available...");

    this.octokit = new Octokit({ auth: key });

    return await this.octokit.auth();
  }

  listConflicts(repoPath: string) {
    // 1. Local modifications (strip the leading status code)
    const modified = execSync("git status --porcelain", { cwd: repoPath })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3)); // e.g. "M src/foo.txt" → "src/foo.txt"

    // 2. Local untracked (respects .gitignore)
    const untracked = execSync("git ls-files --others --exclude-standard", {
      cwd: repoPath,
    })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    // 3. Remote changes (against upstream/main)
    execSync("git fetch origin", { cwd: repoPath });
    const remoteChanges = execSync("git diff --name-only HEAD upstream/main", {
      cwd: repoPath,
    })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    // 4. Build a set of all local‐changed files
    const localSet = new Set([...modified, ...untracked]);

    const conflicts = remoteChanges.filter((f) => localSet.has(f));

    return conflicts;
  }

  async listRepositories() {
    if (!this.octokit) {
      await this.signIn();
    }

    const response = await this.octokit?.request("GET /orgs/{org}/repos", {
      org: "Betty-Blocks-Services",
    });

    return response?.data.map((repo) => ({
      name: repo.full_name,
      url: repo.url,
    }));
  }

  /**
   * Creates a new repository from a template repository using the GitHub API.
   *
   * @param options Configuration for the repository creation.
   * @returns The GitHub response data from the created repository.
   */
  async createRepoFromTemplate(options: {
    templateOwner: string;
    templateRepo: string;
    newRepoName: string;
    description?: string;
    private?: boolean;
    includeAllBranches?: boolean;
  }) {
    if (!this.octokit) {
      await this.signIn();
    }

    const {
      templateOwner,
      templateRepo,
      newRepoName,
      description = "",
      private: isPrivate = true,
      includeAllBranches = false,
    } = options;

    try {
      const response = await this.octokit?.rest.repos.createUsingTemplate({
        template_owner: templateOwner,
        template_repo: templateRepo,
        name: newRepoName,
        owner: "Betty-Blocks-Services",
        description,
        include_all_branches: includeAllBranches,
        private: isPrivate,
      });

      console.log(
        `Created repository ${newRepoName} using template ${templateRepo}.`,
      );

      return response?.data;
    } catch (err) {
      const error = err as GitHttpError;
      return { error: { message: error.response.data.message } };
    }
  }

  /**
   * Tries to clone a repository using retries. This function:
   *  - Removes any existing target directory.
   *  - Clones the repository.
   *  - Runs a "git pull" (to ensure everything is up-to-date).
   *  - Checks if the repository is not empty (i.e. HEAD exists).
   *
   * @param repoUrl The repository URL to clone.
   * @param targetPath The local path where the repo should be cloned.
   * @param maxAttempts Maximum attempts (default 5).
   * @param delayMs Delay in milliseconds between attempts (default 100ms).
   * @returns An object with success (boolean), attempts (number), and an optional message.
   */
  async cloneRepository(
    repoUrl: string,
    targetPath: string,
    maxAttempts: number = 5,
    delayMs: number = 100,
  ): Promise<{ success: boolean; attempts: number; message?: string }> {
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        console.log(
          `Attempt ${attempt}: Cloning ${repoUrl} into ${targetPath}...`,
        );

        // Remove targetPath if it exists from previous attempts.
        Director.deletePath(targetPath);

        // Execute the clone command with the specified working directory.
        execSync(`git clone ${repoUrl} ${targetPath}`, {
          stdio: "inherit",
          cwd: config.projectsPath,
        });

        // Optionally pull to ensure all updates are here.
        execSync("git pull", {
          stdio: "inherit",
          cwd: targetPath,
        });

        // Check that repository is not empty by attempting to retrieve HEAD.
        try {
          const localHash = execSync("git rev-parse HEAD", {
            cwd: targetPath,
            encoding: "utf-8",
          }).trim();

          if (localHash) {
            console.log("Repository cloned and populated successfully.");
            return { success: true, attempts: attempt };
          }
        } catch (e) {
          console.warn("Repository appears to be empty; will retry...");
        }
      } catch (error) {
        console.error("Error cloning repository on attempt", attempt, error);
      }
      // Wait before the next attempt.
      await Director.delay(delayMs);
    }

    return {
      success: false,
      attempts: attempt,
      message: `Repository did not populate after ${maxAttempts} attempts.`,
    };
  }

  /**
   * Sets or adds a remote with the given URL.
   * If the remote already exists, its URL will be updated.
   * Otherwise, a new remote is added.
   *
   * @param repoPath The local repository path.
   * @param remote The name of the remote (e.g. "upstream" or "origin").
   * @param url The URL for the remote.
   * @returns True if the operation succeeds, false otherwise.
   */
  public setOrAddRemote(
    repoPath: string,
    remote: string,
    url: string,
  ): boolean {
    try {
      // Check if the remote exists:
      let remoteExists = false;
      try {
        // This command will succeed if the remote exists.
        execSync(`git remote get-url ${remote}`, {
          cwd: repoPath,
          stdio: "ignore",
        });
        remoteExists = true;
      } catch (err) {
        // If the command fails, we assume the remote doesn't exist.
        remoteExists = false;
      }

      if (remoteExists) {
        // Update the URL for the existing remote.
        execSync(`git remote set-url ${remote} ${url}`, {
          cwd: repoPath,
          stdio: "inherit",
        });
        console.log(`Remote '${remote}' updated to URL: ${url}`);
      } else {
        // Add a new remote with the provided URL.
        execSync(`git remote add ${remote} ${url}`, {
          cwd: repoPath,
          stdio: "inherit",
        });
        console.log(`Remote '${remote}' added with URL: ${url}`);
      }
      return true;
    } catch (error) {
      console.error("Error setting remote URL:", error);
      return false;
    }
  }

  /**
   * Checks whether the given branch exists on the specified remote.
   *
   * @param repoPath The local repository path.
   * @param remote The remote name (e.g. "origin" or "upstream").
   * @param branch The branch name (e.g. "main" or "master").
   * @returns True if the branch exists on the remote, false otherwise.
   */
  private remoteBranchExists(
    repoPath: string,
    remote?: string,
    branch?: string,
  ): boolean {
    try {
      const output = execSync(`git ls-remote --heads ${remote} ${branch}`, {
        cwd: repoPath,
        encoding: "utf-8",
      });
      return output.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks whether updates are available in the repository at the given path.
   *
   * @param repoPath The local repository path.
   * @param remote Optional: The name of the remote (e.g. "origin" or "upstream"). Default: origin.
   * @param branch Optional: The branch name (e.g. "main")—used with the remote. Default: main.
   * @returns True if there are updates (i.e. if local and remote commits differ), false otherwise.
   */
  checkForUpdates(
    repoPath: string,
    remote: string = "origin",
    branch: string = "main",
  ): boolean {
    try {
      execSync(`git fetch ${remote} ${branch}`, {
        cwd: repoPath,
        stdio: "ignore",
      });

      // Determine the reference to compare against.
      let compareTarget: string;
      if (remote && branch) {
        compareTarget = `${remote}/${branch}`;
      } else if (remote) {
        compareTarget = `${remote}/HEAD`;
      } else {
        compareTarget = "@{u}";
      }

      // Use execSync with cwd so that the commands run in repoPath.
      const localHash = execSync("git rev-parse @ --", {
        cwd: repoPath,
        encoding: "utf-8",
      }).trim();
      const remoteHash = execSync(`git rev-parse ${compareTarget} --`, {
        cwd: repoPath,
        encoding: "utf-8",
      }).trim();

      if (localHash !== remoteHash) {
        console.log("Updates are available for repository:", repoPath);
        return true;
      } else {
        console.log("Repository is up-to-date:", repoPath);
        return false;
      }
    } catch (error) {
      console.error(
        "Error checking for updates in repository:",
        repoPath,
        error,
      );
      return false;
    }
  }
  /**
   * Synchronizes the repository at repoPath. This method pulls the latest changes
   * and, if there are any local modifications (tracked or untracked), adds them,
   * commits with the message "sync", and pushes the changes.
   *
   * @param repoPath The local repository path.
   * @returns True if synchronization succeeds; false otherwise.
   */
  public syncRepository(repoPath: string): {
    updated: boolean;
    message?: string;
  } {
    try {
      console.log(`Syncing repository at ${repoPath}`);

      // Pull latest changes from the remote.
      execSync("git pull", { cwd: repoPath, stdio: "inherit" });

      // Check for local modifications (both tracked and untracked) using a concise status.
      const statusOutput = execSync("git status --porcelain", {
        cwd: repoPath,
        encoding: "utf-8",
      }).trim();

      if (statusOutput === "") {
        console.log("Repository is clean. Nothing to sync.");
        return {
          updated: true,
        };
      }

      console.log("\n---- Adding changes and committing ----\n");

      // Show status for debugging
      execSync("git status", { cwd: repoPath, stdio: "inherit" });

      // Stage all changes.
      execSync("git add .", { cwd: repoPath, stdio: "inherit" });

      // Commit with the message 'sync'.
      execSync("git commit -m 'sync'", { cwd: repoPath, stdio: "inherit" });

      // Push the commits.
      execSync("git push", { cwd: repoPath, stdio: "inherit" });

      console.log("Repository synchronized successfully.");
      return { updated: true };
    } catch (error) {
      const message: string =
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : (error as string);
      console.error("Error during repository sync:", error);
      return { updated: false, message };
    }
  }

  /**
   * Updates the local repository by fetching updates and rebasing the local branch.
   *
   * The method behaves as follows:
   * - If both a remote and branch are provided, it verifies whether the branch exists.
   *    - If the branch exists, it fetches that branch and rebases onto it.
   *    - If not, it logs a warning and falls back to fetching the entire remote and rebasing onto remote/HEAD.
   * - If only a remote is provided, it fetches that remote and rebases onto remote/HEAD.
   * - If neither is provided, it fetches all remotes and rebases onto the tracked upstream (@{u}).
   *
   * Local changes are not merged—only rebasing is performed so that user changes are not preserved.
   *
   * @param repoPath The local repository path.
   * @param remote Optional remote name (e.g. "origin" or "upstream"). Default: origin
   * @param branch Optional branch name (e.g. "main") to rebase onto. Default: main
   * @returns True if the update (with rebase) succeeds; false otherwise.
   */
  public updateRepository(
    repoPath: string,
    remote: string = "origin",
    branch: string = "main",
  ): { updated: boolean; message?: string } {
    try {
      console.log(
        `Updating repository at ${repoPath} from ${remote}/${branch}`,
      );
      let fetchCmd = "";
      let rebaseTarget = "";

      if (this.remoteBranchExists(repoPath, remote, branch)) {
        fetchCmd = `git fetch ${remote} ${branch}`;
        rebaseTarget = `${remote}/${branch}`;
      } else {
        console.warn(
          `Remote branch ${remote}/${branch} does not exist. Falling back to ${remote}/HEAD.`,
        );
        fetchCmd = `git fetch ${remote}`;
        rebaseTarget = `${remote}/HEAD`;
      }

      // Fetch updates from the remote.
      console.log(`Executing fetch: "${fetchCmd}" in ${repoPath}`);
      execSync(fetchCmd, { cwd: repoPath, stdio: "inherit" });

      console.log(`Removing local changes`);
      execSync("git checkout .", { cwd: repoPath, stdio: "inherit" });

      // Rebase the current branch onto the remote target.
      const rebaseCmd = `git rebase ${rebaseTarget}`;
      console.log(`Executing rebase: "${rebaseCmd}" in ${repoPath}`);
      execSync(rebaseCmd, { cwd: repoPath, stdio: "inherit" });

      console.log("Repository updated successfully with rebase.");
      return {
        updated: true,
      };
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : (error as string);
      console.error(`Error updating repository at ${repoPath}:`, message);
      return {
        updated: false,
        message: message,
      };
    }
  }

  isGitHttpError(obj: unknown): obj is GitHttpError {
    if (
      typeof obj !== "object" ||
      obj === null ||
      !("name" in obj) ||
      (obj as { name?: unknown }).name !== "HttpError"
    ) {
      return false;
    }

    const maybeError = obj as Partial<GitHttpError>;

    return (
      typeof maybeError.status === "number" &&
      typeof maybeError.request === "object" &&
      maybeError.request !== null &&
      typeof maybeError.request.method === "string" &&
      typeof maybeError.request.url === "string" &&
      typeof maybeError.request.headers === "object" &&
      maybeError.request.headers !== null &&
      typeof maybeError.response === "object" &&
      maybeError.response !== null &&
      typeof maybeError.response.status === "number" &&
      typeof maybeError.response.url === "string" &&
      typeof maybeError.response.headers === "object" &&
      maybeError.response.headers !== null &&
      typeof maybeError.response.data === "object" &&
      maybeError.response.data !== null &&
      "message" in maybeError.response.data &&
      typeof maybeError.response.data.message === "string"
    );
  }
}
