import os from "os";
import { AppConfig } from "@/types";
import { createDeployment } from "./deployment";
import { createService } from "./service";
import { createIngress } from "./ingress";
import { createConfigMap } from "./configmap";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const spawnKubectlCommand = (args: string[]) => {
  const kubectl = spawn("kubectl", args, {
    stdio: ["pipe", "pipe", "pipe"],
  });

  kubectl.stdout.on("data", (data: string) => {
    process.stdout.write(data);
  });

  // Capture stderr
  kubectl.stderr.on("data", (data: string) => {
    process.stderr.write(data);
  });

  return kubectl;
};

export const createServerlessFunction = (
  config: AppConfig,
  options: Record<string, any>,
) => {
  const resources = [
    createDeployment(config),
    createService(config),
    createIngress(config),
    createConfigMap(config.name, config.namespace),
  ];
  const configDir = path.join(os.homedir(), ".config", "serverless");
  const outputPath = path.join(configDir, "output.yaml");

  const yamlOutput = resources.map((r) => YAML.stringify(r)).join("---\n");

  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(outputPath, yamlOutput);

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
