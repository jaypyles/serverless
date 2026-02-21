#!/usr/bin/env node

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { Command } from "commander";

import { createDeployment } from "@/kube/deployment";
import { createService } from "@/kube/service";
import { createIngress } from "@/kube/ingress";
import { createConfigMap } from "./kube/configmap";

const program = new Command();

program
  .name("blueprint")
  .description("Generate server.js from a JS HTTP function and K8s manifests")
  .argument("<file>", "JS file exporting a function (req, res) => {}")
  .option("-p, --port <port>", "Port the server will listen on", "3000")
  .option("-o, --output <output>", "Output YAML file", "dist/output.yaml")
  .option("-s, --server <server>", "Output server file", "dist/server.js")
  .action(
    (
      file: string,
      options: { port: string; output: string; server: string },
    ) => {
      const fullPath = path.resolve(process.cwd(), file);

      if (!fs.existsSync(fullPath)) {
        console.error("File does not exist:", fullPath);
        process.exit(1);
      }

      // Generate server.js content
      const serverContent = `#!/usr/bin/env node

const express = require("express");
const handler = require("${fullPath.replace(/\\/g, "\\\\")}");
const app = express();

app.use(express.json());
app.all("*", (req, res) => handler(req, res));

const port = ${options.port};
app.listen(port, () => console.log("Server running at http://localhost:" + port));
`;

      // Write server.js
      fs.mkdirSync(path.dirname(options.server), { recursive: true });
      fs.writeFileSync(options.server, serverContent);
      fs.chmodSync(options.server, 0o755); // make executable
      console.log("Generated server.js at", options.server);

      // Generate K8s manifests
      const config = {
        name: path.basename(file, ".js"),
        namespace: "default",
        image: "dockerhubuser/myapp:latest",
        port: parseInt(options.port, 10),
        replicas: 1,
        domain: "test.com",
      };

      const resources = [
        createDeployment(config),
        createService(config),
        createIngress(config),
        createConfigMap(fullPath, config.name, config.namespace),
      ];

      const yamlOutput = resources.map((r) => YAML.stringify(r)).join("---\n");
      fs.mkdirSync(path.dirname(options.output), { recursive: true });
      fs.writeFileSync(options.output, yamlOutput);

      console.log("Generated Kubernetes manifests at", options.output);
    },
  );

program.parse(process.argv);
