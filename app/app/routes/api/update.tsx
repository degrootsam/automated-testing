import { config, Git } from "~/utils/index.server";

export const action = async () => {
  const git = new Git();

  const filesAtRisk = git.listConflicts(config.suitePath);

  if (filesAtRisk.length > 0) {
    return Response.json({
      confirm: {
        message:
          "If you continue with synchronizing, you will lose progress on the following files: ",
        filesAtRisk,
      },
    });
  }

  const { updated, message } = git.updateRepository(
    config.suitePath,
    "upstream",
    "main",
  );

  if (message) {
    return Response.json({ error: { message } });
  }
  return Response.json({ updated });
};
