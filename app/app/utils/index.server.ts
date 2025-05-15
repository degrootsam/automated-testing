import Config from "./config/index.server";
import Director from "./director/index.server";
import Git from "./git/index.server";
import ProcessManager from "./process-manager/index.server";
import Project from "./projects/index.server";
import {
  commitSession,
  destroySession,
  getSession,
  sessionStorage,
} from "./session/index.server";
import TestHelper from "./test-helper/index.server";

const config = new Config();

function makeServerError(message: string) {
  return { error: { message } };
}

export {
  commitSession,
  config,
  destroySession,
  Director,
  getSession,
  Git,
  makeServerError,
  ProcessManager,
  Project,
  sessionStorage,
  TestHelper,
};
