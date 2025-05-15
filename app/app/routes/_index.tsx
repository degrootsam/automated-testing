import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import {
  FaArrowAltCircleRight,
  FaCheckCircle,
  FaFolder,
  FaGitAlt,
  FaSync,
} from "react-icons/fa";
import { FaGithub, FaPlus } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { Alert, Button, Card, Heading, List, Modal } from "~/components";
import { ListItemButtonProps, ListItemProps } from "~/components/list";
import { ModalProps } from "~/components/modal";
import Page from "~/components/page";
import {
  commitSession,
  config,
  getSession,
  Project,
} from "~/utils/index.server";
import { IProject } from "~/utils/projects/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Testing Suite Dashboard" },
    { name: "description", content: "Welcome to your personal testing suite!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const gitAuthorized = config.git.pat ? true : false;

  if (!gitAuthorized) {
    return redirect("/github/auth");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme");
  const message = session.get("message") as string | undefined;
  session.set("message", "");

  const projects = Project.listProjects();

  return Response.json(
    { projects: projects, message, preferredTheme },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export default function Index() {
  const navigation = useNavigation();
  const {
    projects: data,
    upstreamHasChanges,
    message = "",
    preferredTheme,
  } = useLoaderData<typeof loader>();

  const [projects, setProjects] = useState<IProject[]>(data);
  const [isLoading, setIsLoading] = useState<boolean>(
    navigation.state !== "idle"
  );

  const handleClickSyncMasterRepo = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setModal((prev) => ({
      ...prev,
      showModal: true,
      title: "Are you sure?",
      children:
        "Warning! This will overwrite any changes in the bb-testing directory (excluding the /projects directory).",
    }));
  };

  const handleClickSyncProjects = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    await syncProjects();
  };

  const syncProjects = async () => {
    const response = await fetch("/projects/sync", { method: "POST" });
    if (!response.ok) {
      return;
    }
    try {
      const { projects } = await response.json();
      setProjects(projects);
    } catch (err) {
      console.error(err);
    }
  };

  const hideSyncProjectModal = () => {
    setModal((prev) => ({ ...prev, showModal: false }));
  };

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const syncProject = async (project: IProject) => {
    setShowAlert(false);
    setIsLoading(true);

    const { name } = project;

    const response = await fetch(`/projects/sync/${name}`, {
      method: "POST",
    });

    if (!response.ok) {
      setAlertMessage(response.statusText);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }

    try {
      const { projects } = await response.json();
      setProjects(projects);
    } catch (err) {
      setShowAlert(true);
      const message =
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : (err as string);
      setAlertMessage(message);
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleClickSyncProject = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const { dataset } = event.currentTarget;
    if (!dataset.project) return;

    const project = projects.find(
      (project) => project.name === dataset.project
    );

    if (!project) {
      setShowAlert(true);
      setAlertMessage(`${project} is not a valid project`);
      return;
    }

    setSelectedProject(project);

    setModal({
      title: "Are you sure?",
      showModal: true,
      onHideModal: hideSyncProjectModal,
      buttons: [
        {
          children: "Confirm",
          color: "primary",
          onClick: handleConfirmSyncProject,
        },
      ],
    });
  };

  const handleConfirmSyncProject = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    hideSyncProjectModal();
    if (!selectedProject) return;
    await syncProject(selectedProject!);
  };

  const [modal, setModal] = useState<ModalProps>({
    showModal: false,
    title: "",
    buttons: [
      {
        children: "Confirm",
        onClick: handleConfirmSyncProject,
        color: "primary",
      },
    ],
    onHideModal: hideSyncProjectModal,
  });

  const [showAlert, setShowAlert] = useState<boolean>(message ? true : false);
  const [alertMessage, setAlertMessage] = useState<string>(message);

  const hideAlert = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowAlert(false);
  };

  return (
    <Page
      title="Welcome to your personal testing suite"
      preferredTheme={preferredTheme}
    >
      <Modal {...modal}>
        Please make sure you have saved your work before you continue.
      </Modal>
      <Card className="max-w-xl w-full ">
        <div className="mb-4">
          <div className="flex flex-row justify-between">
            <div>
              <p className="font-bold opacity-60 text-sm">Suite name</p>
              <Heading size="h4">bb-testing</Heading>
            </div>
            <div className="flex flex-row gap-4">
              {/* <Tooltip */}
              {/*   message={ */}
              {/*     upstreamHasChanges */}
              {/*       ? "Update(s) available for master repository" */}
              {/*       : "Master repository has no update(s)" */}
              {/*   } */}
              {/* > */}
              {/*   <Button */}
              {/*     size="sm" */}
              {/*     color={upstreamHasChanges ? "primary" : undefined} */}
              {/*     disabled={!upstreamHasChanges} */}
              {/*     loading={isLoading} */}
              {/*     onClick={handleClickSyncMasterRepo} */}
              {/*     className="btn" */}
              {/*   > */}
              {/*     <FaArrowDown /> */}
              {/*     Update Suite */}
              {/*   </Button> */}
              {/* </Tooltip> */}
            </div>
          </div>
        </div>
        {showAlert && (
          <div className="pb-4">
            <Alert
              message={alertMessage}
              icon={FaCheckCircle}
              color="success"
              buttons={[{ children: "Close", onClick: hideAlert }]}
            />
          </div>
        )}
        <List
          title="Projects inside"
          button={
            <div className="flex flex-row gap-2">
              <Link to="/projects/create" aria-disabled={isLoading}>
                <Button size="sm" loading={isLoading}>
                  <FaPlus />
                  Create project
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={handleClickSyncProjects}
                disabled={projects.length === 0}
                loading={isLoading}
              >
                <FaSync />
                Synchronize projects
              </Button>
            </div>
          }
          items={projects.map((project: IProject) => {
            const buttons: ListItemButtonProps[] = [
              {
                "data-project": project.name,
                tooltip: "View in dashboard",
                href: `/projects/${project.name}/suites/view`,
                icon: FaArrowAltCircleRight,
              },
              {
                "data-project": project.name,
                icon: VscVscode,
                href: project.urls.vscode,
                tooltip: "Open in VSCode",
              },
            ];

            if (project.git.initialized) {
              buttons.push({
                "data-project": project.name,
                icon: FaGithub,
                href: project.urls.git,
                tooltip: "Open on GitHub",
              });
            } else {
              buttons.push({
                "data-project": project.name,
                icon: FaGitAlt,
                loading: isLoading,
                href: "/projects/init",
                tooltip: "Initialize repository",
              });
            }

            if (!project.git.remoteHasChanges) {
              buttons.push({
                "data-project": project.name,
                icon: FaSync,
                onClick: handleClickSyncProject,
                loading: isLoading,
                tooltip: "Sync changes",
              });
            }
            const color = project.git.remoteHasChanges
              ? "primary"
              : project.git.error
              ? "error"
              : "success";
            const message = project.git.remoteHasChanges
              ? "An update is available!"
              : project.git.error
              ? project.git.error
              : "Project is up-to-date";
            return {
              title: project.name,
              icon: FaFolder,
              buttons,
              status: {
                color,
                ariaLabel: message,
                animate: color === "error" ? "ping" : undefined,
              },
            } as ListItemProps;
          })}
        />
      </Card>
    </Page>
  );
}
