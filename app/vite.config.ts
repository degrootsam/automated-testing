import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      // Manually declare our route tree, matching app/routes exactly
      routes(defineRoutes) {
        return defineRoutes((route) => {
          // Root page: /
          route("/", "routes/_index.tsx", { index: true });

          // ── API routes under /api ─────────────────────────────────────────────────
          route("api/projects/list", "routes/api/projects/list.tsx");
          route("api/projects/sync", "routes/api/projects/sync/index.tsx");
          route(
            "api/projects/:project/setup/create",
            "routes/api/projects/$project/setup/create.tsx",
          );
          route(
            "api/projects/sync/:name",
            "routes/api/projects/sync/$name.tsx",
          );
          route(
            "api/projects/:project/setup/delete",
            "routes/api/projects/$project/setup/delete.tsx",
          );
          route("api/recording/status", "routes/api/recording/status.tsx");
          route(
            "api/tests/:project/list",
            "routes/api/tests/$project/list.tsx",
          );
          route(
            "api/tests/:project/:suite/:test/run",
            "routes/api/tests/$project/$suite/$test/run.tsx",
          );
          route(
            "api/tests/:project/:suite/:test/status",
            "routes/api/tests/$project/$suite/$test/status.tsx",
          );
          route(
            "api/tests/:project/:suite/run",
            "routes/api/tests/$project/$suite/run.tsx",
          );
          route("api/tests/:project/run", "routes/api/tests/$project/run.tsx");
          route("api/theme/set", "routes/api/theme/set.tsx");
          route("api/update", "routes/api/update.tsx");

          // ── GitHub auth route ────────────────────────────────────────────────────
          route("github/auth", "routes/github.auth/index.tsx");

          route("projects/create", "routes/projects/create.tsx");
          // /projects/:name
          route("projects/:name", "routes/projects/$name/index.tsx", () => {
            route(
              "configuration",
              "routes/projects/$name/configuration/index.tsx",
            );
            route("dashboard", "routes/projects/$name/dashboard/index.tsx");
            route("suites/view", "routes/projects/$name/suites/view.tsx");
            // /projects/:name/suites/create
            route("suites/create", "routes/projects/$name/suites/create.tsx");
            route("suites/delete", "routes/projects/$name/suites/delete.tsx");

            // /projects/:name/suites/:suite and its children
            route(
              "suites/:suite",
              "routes/projects/$name/suites/$suite/index.tsx",
              () => {
                route(
                  "view",
                  "routes/projects/$name/suites/$suite/view/index.tsx",
                );
                route(
                  "configuration",
                  "routes/projects/$name/suites/$suite/configuration/index.tsx",
                );

                route(
                  "configuration/create-setup",
                  "routes/projects/$name/suites/$suite/configuration/create-setup.tsx",
                );
                route(
                  "tests/delete",
                  "routes/projects/$name/suites/$suite/tests/delete.tsx",
                );
                route(
                  "tests/:test",
                  "routes/projects/$name/suites/$suite/tests/$test/index.tsx",
                  () => {
                    route(
                      "view",
                      "routes/projects/$name/suites/$suite/tests/$test/view/index.tsx",
                    );
                  },
                );
                route(
                  "record/start",
                  "routes/projects/$name/suites/$suite/record/start.tsx",
                );
                route(
                  "record/status",
                  "routes/projects/$name/suites/$suite/record/status.tsx",
                );
                route(
                  "record/finish",
                  "routes/projects/$name/suites/$suite/record/finish.tsx",
                );
              },
            );
          });
        });
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ["blessed", "pty.js", "term.js", "fsevents"],
  },
  resolve: {
    alias: {
      // stub these out to an empty module in the browser
      blessed: path.resolve(__dirname, "emptyStub.js"),
      "pty.js": path.resolve(__dirname, "emptyStub.js"),
      "term.js": path.resolve(__dirname, "emptyStub.js"),
      fsevents: path.resolve(__dirname, "emptyStub.js"),
    },
  },
});
