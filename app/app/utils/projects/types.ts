export interface IProject {
  /** Name of the project */
  name: string;
  /** Absolute path to the project */
  path: string;
  /** Git information */
  git: {
    /** Is the project initialized with git? */
    initialized: boolean;
    /** The remoteUrl to the project */
    remoteUrl?: string;
    /** The branch of the remote */
    branch?: string;
    /** True if remote has changes */
    remoteHasChanges: boolean;
    /** True if local changes are made */
    localHasChanges: boolean;
    /** Do i need to explain? */
    error?: string;
  };
  urls: {
    vscode: string; // Open in vscode
    git: string; // Open the github project
  };
}
