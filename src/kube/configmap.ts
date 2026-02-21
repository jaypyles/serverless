import fs from "fs";
import path from "path";

export function createConfigMap(
  filePath: string,
  name: string = "serverless-func",
  namespace: string = "default",
) {
  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`Cannot create ConfigMap: file does not exist: ${absPath}`);
  }

  const fileContents = fs.readFileSync(absPath, "utf-8");

  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name,
      namespace,
    },
    data: {
      "index.js": fileContents,
    },
  };
}
