#!/usr/bin/env node

import { Command } from "commander";

import { createServerlessFunction } from "./kube/runner";
import { getFileContents } from "./files/file-contents";
import { getConfig } from "./config/config";

const program = new Command();

program
  .name("serverless")
  .description("Generate and create serverless functions")
  .argument("<file>", "JS file exporting a function (req, res) => {}")
  .option("-p, --port <port>", "Port the server will listen on", "3000")
  .option("-o, --output <output>", "Output YAML file", "dist/output.yaml")
  .option("-s, --server <server>", "Output server file", "dist/server.js")
  .option("-n, --namespace <namespace>", "Kubernetes namespace", "default")
  .option("-d, --domain <domain>", "Domain for ingress", "jaydenpyles.dev")
  .option(
    "-e, --env <env...>",
    "Environment variables as KEY=VALUE pairs",
    (val: string, prev: string[]) => prev.concat([val]),
    [] as string[],
  )
  .action(
    (
      file: string,
      options: {
        port: string;
        output: string;
        server: string;
        namespace: string;
        domain: string;
        env: string[];
      },
    ) => {
      const serverContent = getFileContents(file, options);
      const config = getConfig(file, options);
      createServerlessFunction(config, options, serverContent);
    },
  );

program.parse(process.argv);
