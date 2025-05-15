import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import tailwindStyleSheetURL from "./tailwind.css?url";
import { Alert, Card } from "./components";
import Page from "./components/page";
import { MdError } from "react-icons/md";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: tailwindStyleSheetURL,
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Default error boundary for unexpected errors
export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewp;ort"
            content="width=device-width, initial-scale=1"
          />
          <Meta />
          <Links />
        </head>
        <body>
          <Page
            title={`${error.status}: ${error.statusText}`}
            className="text-error"
          >
            <Card className="max-w-xl w-full">
              <p className="text-sm font-semibold  mb-4">
                The back-end produced the following error:
              </p>
              <Alert
                color="error"
                message={error.data || error.statusText}
                className="mb-4"
                icon={MdError}
              />
              <div className="flex flex-row justify-end gap-1"></div>
            </Card>
          </Page>
          <Scripts />
        </body>
      </html>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? (error.message as string)
      : "Unkown error";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Page title="Uh ohhh...." className="bg-base-300">
          <div className="max-w-xl w-full bg-base-100 p-8 rounded-lg shadow-md">
            <p className="text-sm font-semibold  mb-4">
              Something went wrong and we we&apos;re unable to recover.
              Here&apos;s what we know:
            </p>
            <Alert color="error" message={errorMessage} icon={MdError} />
          </div>
        </Page>
        <Scripts />
      </body>
    </html>
  );
}
