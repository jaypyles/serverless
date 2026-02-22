import { Command } from "commander";

import { createServerlessFunction } from "@/kube/runner";
import { getFileContents } from "@/files/file-contents";
import { getConfig } from "@/config/config";

export const createDeployCommand = (program: Command) => {
  program
    .command("deploy")
    .description("Deploy a JS file as a serverless function")
    .argument("<file>", "JS file exporting (req, res) => {}")
    .option("-p, --port <port>", "Port", "3000")
    .option("-o, --output <output>", "Output YAML file", "dist/output.yaml")
    .option("-s, --server <server>", "Output server file", "dist/server.js")
    .option("-n, --namespace <namespace>", "Kubernetes namespace", "default")
    .option("-d, --domain <domain>", "Domain for ingress", "jaydenpyles.dev")
    .option(
      "-e, --env <env...>",
      "Environment variables as KEY=VALUE",
      (val: string, prev: string[]) => prev.concat([val]),
      [],
    )
    .action((file, options) => {
      const serverContent = getFileContents(file, options);
      const config = getConfig(file, options);
      createServerlessFunction(config, options, serverContent);
    });
};
