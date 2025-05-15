import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import log from "electron-log"; // ← use the main package, not electron-log/main
import net from "net";
import { updateElectronApp } from "update-electron-app";

updateElectronApp();

// ——— configure electron-log to write into userData/logs/app.txt ———
const userLogDir = path.join(app.getPath("userData"), "logs");
fs.mkdirSync(userLogDir, { recursive: true });

// optionally control level & formatting
log.transports.file.level = "info";

log.info("Starting up…");

// ——— rest of your code ———

function waitForPort(
  port: number,
  host = "127.0.0.1",
  timeout = 20000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function retry() {
      const sock = net.createConnection(port, host);
      sock
        .once("connect", () => {
          sock.destroy();
          resolve();
        })
        .once("error", () => {
          sock.destroy();
          if (Date.now() - start > timeout) {
            reject(new Error(`Timed out waiting for port ${port}`));
          } else {
            setTimeout(retry, 100);
          }
        });
    })();
  });
}

async function startRemixServer() {
  const entry = path.resolve(
    app.getAppPath(),
    app.isPackaged ? "../" : "",
    "myapp",
    "server.js",
  );

  log.info(`Loading server from ${entry}`);

  if (!fs.existsSync(entry)) {
    log.error(`server.js not found at ${entry}`);
    throw new Error(`server.js not found at ${entry}`);
  }

  const userDataDir = app.getPath("userData");
  process.env.USER_DATA_DIR = userDataDir;

  // ensure it exists (this creates ~/Library/Application Support/YourAppName)
  fs.mkdirSync(userDataDir, { recursive: true });

  log.info({ userDataDir });

  require(entry);
  await waitForPort(3000);
  log.info("Remix server is up on port 3000");
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  log.info("BrowserWindow created");
  const url = "http://localhost:3000";
  log.info("Loading url", url);

  await win.loadURL(url);
}

app.whenReady().then(async () => {
  try {
    await startRemixServer();
  } catch (err: any) {
    log.error("Failed to start Remix server:", err);
    app.quit();
    return;
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      log.info("Re-activated and created new window");
    }
  });
});

app.on("window-all-closed", () => {
  log.info("All windows closed; quitting");
  if (process.platform !== "darwin") app.quit();
});
