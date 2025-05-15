import { PlaywrightDashboardSummaryReport } from "./reporter";
import { Project as PWProject } from "@playwright/test";

export interface Suite {
  name: string;
  /** The project as defined in the playwright.config.ts */
  config: PWProject;
  /** Available after running a test */
  results?: PlaywrightDashboardSummaryReport;
}

export interface DependencyNode {
  name: string;
  metadata: {
    type: string;
  };
  dependencies: DependencyNode[];
}

export interface Test {
  name: string;
  suite: string;
  path: string;
}
