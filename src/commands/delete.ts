import { Command } from "commander";

import { spawnKubectlCommand } from "@/kube/runner";

export const createDeleteCommand = (program: Command) => {
  program
    .command("delete")
    .description("Delete a serverless function")
    .argument("<name>", "Serverless function name")
    .action((name) => {
      const command = [
        "delete",
        "deployment,service,configmap,ingressroute.traefik.io",
        name,
      ];
      spawnKubectlCommand(command);
    });
};
