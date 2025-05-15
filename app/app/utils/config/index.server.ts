import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import Director from "../director/index.server"; // Assuming Director has readFile and writeFile
import { tmpdir } from "os";
import { parseErrorToMessage } from "..";

// Define your configuration interface.
export interface IConfig {
  tmpPath: string;
  projects: {
    path: string;
  };
  git: {
    pat: string;
    upstream: string;
  };
  session: string;
}

// Default configuration; note that we explicitly provide a session property (even if empty).
const DEFAULT_CONFIG: IConfig = {
  tmpPath: tmpdir() || ".tmp",
  projects: {
    path: "projects",
  },
  git: {
    pat: "",
    upstream: "https://github.com/Betty-Blocks-Services/bb-testing.git",
  },
  session: "",
};

export default class Config {
  private configPath: string = path.resolve("config.json");
  config: IConfig;

  constructor() {
    this.ensureConfigFile();
    this.config = this.loadConfig();
    this.ensureProjectsDir();
  }

  get userDataDir() {
    return process.env.USER_DATA_DIR || "";
  }

  isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === "object" && !Array.isArray(item);
  }

  ensureProjectsDir() {
    const projectsDir = path.join(this.userDataDir, this.projectsPath);
    console.info({ projectsDir });
    Director.makeDir(path.join(this.userDataDir, this.projectsPath), {
      recursive: true,
    });
  }

  /**
   * Deeply merge source objects into a target object.
   * The target and sources are constrained to objects with string keys.
   *
   * @param target The base object to merge properties into.
   * @param sources One or more source objects.
   * @returns The target object after merging.
   */
  deepMerge<T = Record<string, unknown>>(
    target: T,
    ...sources: Array<Record<string, unknown>>
  ): T {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          // Ensure that target[key] is an object (or initialize as an empty object).
          if (!target[key] || !this.isObject(target[key])) {
            Object.assign(target, { [key]: {} });
          }
          // Recursively merge the nested objects.
          this.deepMerge(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>
          );
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.deepMerge(target, ...sources);
  }

  /**
   * If the config file doesn't exist, write the DEFAULT_CONFIG to it.
   */
  private ensureConfigFile() {
    if (!fs.existsSync(this.configPath)) {
      try {
        fs.writeFileSync(
          this.configPath,
          JSON.stringify(DEFAULT_CONFIG, null, 2),
          { encoding: "utf-8" }
        );
        console.log("No config file found. Created a new one.");
      } catch (error) {
        console.error("Error writing config file:", error);
      }
    }
  }

  loadConfig(): IConfig {
    const configContent = Director.readFile(this.configPath);
    if (configContent) {
      try {
        const parsed = JSON.parse(configContent);
        // If any property is missing, fill in with defaults.
        return this.deepMerge<IConfig>(DEFAULT_CONFIG, parsed);
      } catch (err) {
        const message = parseErrorToMessage(err);
        throw new Error(`Unable to parse the config.json file: ${message}`);
      }
    } else {
      return DEFAULT_CONFIG;
    }
  }

  updateConfig(newConfig: Partial<IConfig>) {
    this.config = this.deepMerge<IConfig>({ ...this.config }, newConfig);
    console.log("Updated config:", this.config);
    this.saveConfig();
  }

  /**
   * Ensures that a session secret exists in the config.
   * If not, generates a new one, updates the config, and persists it.
   */
  ensureSessionSecret(): string {
    // Log the current config for debugging.
    if (!this.config.session || this.config.session.trim() === "") {
      const newSessionSecret = randomBytes(32).toString("hex");
      this.updateConfig({ session: newSessionSecret });
      console.log("Generated a new session secret.");
      return newSessionSecret;
    }
    return this.config.session;
  }

  saveConfig() {
    try {
      Director.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        { encoding: "utf-8" }
      );
      console.log("Config saved to", this.configPath);
    } catch (error) {
      console.error("Error saving config file:", error);
    }
  }

  get projects() {
    return this.config.projects;
  }

  get projectsPath() {
    return path.resolve(this.config.projects.path);
  }

  get git() {
    return this.config.git;
  }

  get suitePath() {
    return path.resolve(path.dirname(process.cwd()));
  }

  get tmpPath() {
    return this.config.tmpPath;
  }
}
