#!/usr/bin/env node

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { Command } from "commander";

import { createDeployment } from "@/kube/deployment";
import { createService } from "@/kube/service";
import { createIngress } from "@/kube/ingress";
import { createConfigMap } from "./kube/configmap";
import { getExpressServerContent } from "./server/server";
import { spawn } from "child_process";

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
      const fullPath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(fullPath)) {
        console.error("File does not exist:", fullPath);
        process.exit(1);
      }

      const handlerContents = fs.readFileSync(fullPath, "utf-8");

      const serverContent = getExpressServerContent(
        handlerContents,
        parseInt(options.port, 10),
      );

      const envObj: Record<string, any> = {};
      options.env.forEach((e) => {
        const [key, value] = e.split("=");
        if (!key || value === undefined) return;
        envObj[key] = { value };
      });

      envObj.USER_FUNC_CODE = {
        valueFrom: {
          configMapKeyRef: {
            name: path.basename(file, ".js"),
            key: "index.js",
          },
        },
      };

      const name = path.basename(file, ".js");

      const config = {
        name,
        namespace: options.namespace,
        image: "jpyles0524/serverless:latest",
        port: parseInt(options.port, 10),
        replicas: 1,
        domain: options.domain,
        env: envObj,
      };

      const resources = [
        createDeployment(config),
        createService(config),
        createIngress(config),
        createConfigMap(serverContent, config.name, config.namespace),
      ];

      const yamlOutput = resources.map((r) => YAML.stringify(r)).join("---\n");
      fs.mkdirSync(path.dirname(options.output), { recursive: true });
      fs.writeFileSync(options.output, yamlOutput);

      const kubectl = spawn("kubectl", ["apply", "-f", "-"], {
        stdio: ["pipe", "pipe", "pipe"], // explicitly pipe stdin, stdout, stderr
      });

      kubectl.stdout.on("data", (data: string) => {
        process.stdout.write(data);
      });

      // Capture stderr
      kubectl.stderr.on("data", (data: string) => {
        process.stderr.write(data);
      });

      kubectl.stdin.write(yamlOutput);
      kubectl.stdin.end();

      kubectl.on("close", () => {
        console.log(
          `Serverless function now available at https://${name}.${options.domain}`,
        );
      });
    },
  );

program.parse(process.argv);
