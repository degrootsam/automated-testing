import { useFetcher, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import { FaPlay } from "react-icons/fa6";
import Button from "~/components/button";
import { TestOutletContext } from "~/routes/projects/$name/suites/$suite/tests/$test";
import { ProcessInfo } from "~/utils/process-manager/index.server";
import { IProject } from "~/utils/projects/types";

export interface RunSingleTestButtonProps {
  project: IProject;
  suite: string;
  test: string;
}

export default function RunTestButton({
  type,
}: {
  type: "test" | "suite" | "project";
}) {
  const { project, suite, testName } = useOutletContext<TestOutletContext>();
  const fetcher = useFetcher<{ process: ProcessInfo }>({
    key: "run-test",
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    let action = "";
    switch (type) {
      case "test":
        action = `/api/tests/${project.name}/${suite}/${testName}/run`;
        break;
      case "suite":
        action = `/api/tests/${project.name}/${suite}/run`;
        break;
      case "project":
        action = `/api/tests/${project.name}/run`;
        break;
      default:
        throw new Error(
          `${type} is not a valid type for <RunSingleTestButton />`,
        );
    }

    fetcher.submit(null, {
      action,
      method: "POST",
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    if (fetcher.data) {
      const process: ProcessInfo | undefined = fetcher.data.process;
      if (process && process?.stderr) {
        throw new Error(`Unable to start test: ${process?.stderr || "unkown"}`);
      }
    }
  }, [fetcher.data]);

  return (
    <Button
      type="submit"
      color="primary"
      onClick={handleClick}
      loading={fetcher.state !== "idle"}
    >
      <FaPlay />
      Run
    </Button>
  );
}
