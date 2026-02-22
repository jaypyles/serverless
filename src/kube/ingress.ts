import type { AppConfig } from "@/types";

export function createIngress(config: AppConfig) {
  return {
    apiVersion: "traefik.io/v1alpha1",
    kind: "IngressRoute",
    metadata: {
      name: "serverless",
      namespace: config.namespace,
    },
    spec: {
      entryPoints: ["web"],
      routes: [
        {
          match: `Host(\`serverless.${config.domain}\`)`,
          kind: "Rule",
          services: [{ name: "serverless", port: 80 }],
        },
      ],
    },
  };
}
