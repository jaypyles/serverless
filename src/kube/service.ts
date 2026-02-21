import type { AppConfig } from "@/types";

export function createService(config: AppConfig) {
  return {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: config.name,
    },
    spec: {
      selector: { app: config.name },
      ports: [
        {
          port: 80,
          targetPort: config.port,
        },
      ],
    },
  };
}
