import { createCookieSessionStorage } from "@remix-run/node";
import Config from "../config/index.server";

const config = new Config();
const sessionSecret = config.ensureSessionSecret();
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

interface SessionData {
  recordedFilePath: string;
  recordedTest: string;
  preferredTheme: string;
  message: string;
}

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
