import type { AppConfig } from "@/types";

function mapEnv(envObj: Record<string, any>) {
  return Object.entries(envObj).map(([key, value]) => {
    if (typeof value === "object" && value.valueFrom) {
      return {
        name: key,
        valueFrom: value.valueFrom,
      };
    }
    return {
      name: key,
      value: String(value),
    };
  });
}

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
              imagePullPolicy: "Always",
              ports: [{ containerPort: config.port }],
              env: mapEnv(config.env ?? {}),
            },
          ],
        },
      },
    },
  };
}
