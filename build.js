import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { cp, mkdir } from "fs/promises";

import path from "path";

const __dirname = import.meta.dirname;
const appDir = path.join(__dirname, "app");
const distDir = path.resolve("dist");

const ensureDistDir = async () => {
  if (!existsSync(distDir)) {
    console.log("./dist folder does not exist yet, creating now...");
    await mkdir(distDir, { recursive: true });
  }
};

const buildApp = () => {
  try {
    spawnSync("npm", ["run", "build:remix"], {
      stdio: "inherit",
      cwd: appDir,
    });
    console.log("Successfully build remix project!");
  } catch (err) {
    console.error("Unable to spawn 'npm run build:remix'", err);
  }
};

const copyBuild = async () => {
  const successLog = (sourcePath, targetPath) => {
    console.log(
      `${path.basename(sourcePath)} copied from ${path.relative(process.cwd(), sourcePath)} to ${path.relative(process.cwd(), targetPath)}`,
    );
  };
  try {
    const buildDirSource = path.join(appDir, "build");
    const buildDirTarget = path.join(distDir, "build");

    console.log("Copying ./app/build dir");
    await cp(buildDirSource, buildDirTarget, { recursive: true }); // Copy build dir
    successLog(buildDirSource, buildDirTarget);

    const publicDirSource = path.join(appDir, "public");
    const publicDirTarget = path.join(distDir, "public");

    console.log("Copying ./app/public");
    await cp(publicDirSource, publicDirTarget, { recursive: true });
    successLog(publicDirSource, publicDirTarget);

    const packageJSONSource = path.join(appDir, "package.json");
    const packageJSONTarget = path.join(distDir, "package.json");

    console.log("Copying ./app/package.json");
    await cp(packageJSONSource, packageJSONTarget); // Copy package.json
    successLog(packageJSONSource, packageJSONTarget);

    const packageLockSource = path.join(appDir, "package-lock.json");
    const packageLockTarget = path.join(distDir, "package-lock.json");

    console.log("Copying ./app/package-lock.json");
    await cp(packageLockSource, packageLockTarget); // Copy package-lock.json
    successLog(packageLockSource, packageLockTarget);

    const serverJSSource = path.join(appDir, "server.js");
    const serverJSTarget = path.join(distDir, "server.js");
    await cp(serverJSSource, serverJSTarget);
  } catch (err) {
    console.error("Unable to copy build files!", err);
  }
};

const installDependencies = () => {
  try {
    console.log("Installing dependencies...");

    spawnSync("npm", ["install"], { cwd: distDir });

    console.log("Dependencies installed!");
  } catch (err) {
    console.error("Unable to install app dependencies!", err);
  }
};

const buildProcess = async () => {
  await ensureDistDir();
  buildApp();
  copyBuild();
  installDependencies();
};

buildProcess();
