import type { AppConfig } from "@/types";

export function createIngress(config: AppConfig) {
  return {
    apiVersion: "traefik.io/v1alpha1",
    kind: "IngressRoute",
    metadata: {
      name: config.name,
      namespace: config.namespace,
    },
    spec: {
      entryPoints: ["web"],
      routes: [
        {
          match: `Host(\`${config.name}.${config.domain}\`)`,
          kind: "Rule",
          services: [{ name: config.name, port: 80 }],
        },
      ],
    },
  };
}
