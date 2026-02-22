import type { AppConfig } from "@/types";

export function createService(config: AppConfig) {
  return {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: "serverless",
    },
    spec: {
      selector: { app: "serverless" },
      ports: [
        {
          port: 80,
          targetPort: config.port,
        },
      ],
    },
  };
}
