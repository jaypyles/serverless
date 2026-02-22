import { getExpressServerContent } from "@/server/server";
import { readRegistry } from "./registry";

export function createConfigMap(
  name: string = "serverless-func",
  namespace: string = "default",
) {
  const { data: functions } = readRegistry();
  const server = getExpressServerContent(functions, 3000);

  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name,
      namespace,
    },
    data: { functions, server },
  };
}
