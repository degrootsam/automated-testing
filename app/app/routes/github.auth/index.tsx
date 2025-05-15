import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { Alert, Button, Card, Modal, TextField, Tooltip } from "~/components";
import Page from "~/components/page";
import { IConfig } from "~/utils/config/index.server";
import { config, getSession, Git } from "~/utils/index.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const pat = formData.get("pat")?.toString();
  if (!pat) {
    return {
      error: {
        message: "Please sumbit a Personal Access Token",
      },
    };
  }

  const PAT_REGEX = /^github_pat_[A-Za-z0-9_]{50,}$/;
  if (!PAT_REGEX.test(pat.toString())) {
    return {
      error: {
        message: "Invalid PAT token submitted",
      },
    };
  }

  const git = new Git();
  git.signIn(pat);

  const newGitConfig: IConfig["git"] = {
    ...config.git,
    pat: pat,
  };

  config.updateConfig({ git: newGitConfig });

  return redirect("/");
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme") || "";
  const pat = config.git.pat;

  if (pat) {
    const git = new Git();
    git.signIn();
  }
  return Response.json({ preferredTheme });
};

export default function AuthorizeGit() {
  const formData = useActionData<typeof action>();
  const { preferredTheme } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const handleHideHelpModal = () => {
    setShowHelpModal(false);
  };

  const handleShowHelpModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowHelpModal(true);
  };

  return (
    <Page title="Authorize your GitHub Account" preferredTheme={preferredTheme}>
      <Card className="max-w-xl w-full">
        <Modal
          className="w-128"
          title="How to obtain a fine grained access token"
          showModal={showHelpModal}
          onHideModal={handleHideHelpModal}
        >
          <Alert
            color="info"
            className="mb-4"
            message="The PAT (Personal Access Token) cannot have a lifetime longer than 365 days"
          />
          <ol className="space-y-2 text-sm">
            <li>
              1. Go to{" "}
              <Link
                className="link"
                target="_blank"
                to="https://github.com"
                rel="noreferrer"
              >
                <b>GitHub.com</b>.
              </Link>
            </li>
            <li>2. Click on your profile icon (top right).</li>
            <li>3. Choose settings.</li>
            <li>
              4. In the menu on the left side, choose &ldquo;Developer
              settings&rdquo; (at the bottom).
            </li>
            <li>
              5. Choose &ldquo;Personal access tokens &gt; Fine-grained
              token&rdquo;.
            </li>
            <li>6. Click &ldquo;Generate new token&rdquo;.</li>
            <li>7. Confirm your login.</li>
            <li>
              8. Enter &ldquo;bb-testing-dashboard&rdquo; as the token name and
              optionally enter a description.
            </li>
            <li></li>
            <li>9. Scroll down to &ldquo;Repository access&rdquo;.</li>
            <li>10. Choose &ldquo;All repositories&rdquo;.</li>
            <li>
              11. At the &ldquo;Permissions&rdquo; section, expand
              &ldquo;Repository permissions&rdquo;.
            </li>
            <li>
              12. Configure &ldquo;Administration&rdquo; and
              &ldquo;Contents&rdquo; with Read and Write permissions.
            </li>
            <li>
              13. Scroll all the way down, and click &ldquo;Generate
              token&rdquo;.
            </li>
            <li>
              14. Copy/Paste the token in the textfield &ldquo;Personal Access
              Token&rdquo;.
            </li>
          </ol>
          <br />
          <p className="text-sm mb-2">
            Official documentation on{" "}
            <a
              target="_blank"
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token"
              className="link"
              rel="noreferrer"
            >
              <b>Creating a fine grained personal access token</b>
            </a>
            . <br />
          </p>
        </Modal>

        <div className="flex flex-row justify-end"></div>

        <fetcher.Form method="post">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-sm">
              Please enter your Personal Access Token from GitHub:
            </p>
            {formData?.error && (
              <Alert
                color="error"
                message={formData?.error.message}
                icon={MdError}
              />
            )}
            <div className="flex flex-row gap-2">
              <TextField
                required
                className="w-full"
                placeholder="Personal Access Token"
                name="pat"
              />
              <Tooltip message="Click for help">
                <Button square onClick={handleShowHelpModal}>
                  <FaQuestion />
                </Button>
              </Tooltip>
            </div>
            <div className="flex justify-end">
              <Button loading={fetcher.state !== "idle"} color="primary">
                Save
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </Card>
    </Page>
  );
}
