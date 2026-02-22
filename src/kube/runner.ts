import { AppConfig } from "@/types";
import { createDeployment } from "./deployment";
import { createService } from "./service";
import { createIngress } from "./ingress";
import { createConfigMap } from "./configmap";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const createServerlessFunction = (
  config: AppConfig,
  options: Record<string, any>,
  serverContent: string,
) => {
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
      `Serverless function now available at https://${config.name}.${options.domain}`,
    );
  });
};
