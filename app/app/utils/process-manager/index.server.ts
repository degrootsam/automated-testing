// File: app/utils/ProcessManager.ts
import pm2, { StartOptions, ProcessDescription } from "pm2";
import { Director } from "../index.server";
import { humanizeMSTime } from "..";

export type ProcessStatus =
  | "stopped"
  | "stopping"
  | "launching"
  | "one-launch-status"
  | "online"
  | "errored";

export interface ProcessInfo {
  status?: ProcessStatus;
  pid?: number;
  uptime?: string;
  stdout?: string;
  stderr?: string;
}

export default class ProcessManager {
  private config: StartOptions | undefined;

  constructor(config?: StartOptions) {
    this.config = config;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      pm2.connect((err) => (err ? reject(err) : resolve()));
    });
  }

  private disconnect(): void {
    pm2.disconnect();
  }

  private async describe(name: string): Promise<ProcessDescription | null> {
    return new Promise((resolve, reject) => {
      pm2.describe(name, (err, descs) => {
        if (err) return reject(err);
        resolve(descs && descs[0] ? descs[0] : null);
      });
    });
  }

  private async readLogFile(path?: string): Promise<string | undefined> {
    if (!path) return undefined;

    return Director.readFile(path);
  }

  public async start(wait?: false): Promise<ProcessInfo>;
  public async start(wait?: true): Promise<ProcessDescription>;
  public async start(
    wait: boolean = false,
  ): Promise<ProcessInfo | ProcessDescription> {
    if (!this.config || !this.config.name) {
      throw new Error("Cannot start a new process without a config");
    }
    await this.connect();
    // clean up old logs & processes
    await new Promise<void>((res) =>
      pm2.flush(this.config!.name!, () => res()),
    );
    await new Promise<void>((res, rej) =>
      pm2.delete(this.config!.name!, (err) =>
        err && err.message !== "process or namespace not found"
          ? rej(err)
          : res(),
      ),
    );

    // start new process
    await new Promise<void>((res, rej) =>
      pm2.start(this.config!, (err) => (err ? rej(err) : res())),
    );

    if (wait) {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          const info = await this.describe(this.config!.name! || ""); // wraps pm2.describe(...)
          if (info?.pm2_env?.status === "stopped") {
            clearInterval(interval);
            resolve(info);
          }
        }, 500);
      });
    } else {
      // fetch status and logs
      const info = await this.status(this.config!.name!);
      this.disconnect();
      return info;
    }
  }

  public async stop(name: string): Promise<ProcessInfo> {
    await this.connect();
    await new Promise<void>((res, rej) =>
      pm2.stop(name, (err) => (err ? rej(err) : res())),
    );
    const info = await this.status(name);
    this.disconnect();
    return info;
  }

  public async status(name: string): Promise<ProcessInfo> {
    await this.connect();
    const desc = await this.describe(name);
    this.disconnect();

    if (!desc) {
      return { status: "stopped" };
    }

    const env = desc.pm2_env;
    const info: ProcessInfo = {
      status: env?.status as ProcessStatus,
      pid: desc.pid,
      uptime: humanizeMSTime(env?.pm_uptime || 0),
      stdout: await this.readLogFile(env?.pm_out_log_path),
      stderr: await this.readLogFile(env?.pm_err_log_path),
    };

    return info;
  }

  static getTestprojectProcessName(projectName: string) {
    return `bb-testing:${projectName}`;
  }

  static getProcessName(
    projectName: string,
    suiteName?: string,
    testName?: string,
  ): string {
    if (suiteName) {
      if (testName) {
        return `bb-testing:${projectName}>${suiteName}>${testName}`;
      }
      return `bb-testing:${projectName}>${suiteName}`;
    }
    return `bb-testing:${projectName}`;
  }
}
