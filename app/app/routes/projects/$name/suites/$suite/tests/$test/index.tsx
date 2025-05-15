import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { SuiteOutletContext } from "../..";

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<TypedResponse<{ testName: string }>> => {
  const testName = params.test;

  if (!testName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  return Response.json({ testName });
};

export interface TestOutletContext extends SuiteOutletContext {
  testName: string;
}

export default function TestOutlet() {
  const { testName } = useLoaderData<typeof loader>();
  const { suite, project, dependencies } =
    useOutletContext<SuiteOutletContext>();
  return <Outlet context={{ testName, project, suite, dependencies }} />;
}
