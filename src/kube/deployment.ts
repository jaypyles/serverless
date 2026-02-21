import type { AppConfig } from "@/types";

export function createDeployment(config: AppConfig) {
  return {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: config.name,
    },
    spec: {
      replicas: config.replicas ?? 1,
      selector: {
        matchLabels: { app: config.name },
      },
      template: {
        metadata: {
          labels: { app: config.name },
        },
        spec: {
          containers: [
            {
              name: config.name,
              image: config.image,
              ports: [{ containerPort: config.port }],
              env: Object.entries(config.env ?? {}).map(([key, value]) => ({
                name: key,
                value,
              })),
            },
          ],
        },
      },
    },
  };
}
