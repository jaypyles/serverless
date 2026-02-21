import type { AppConfig } from "@/types";

export function createIngress(config: AppConfig) {
  return {
    apiVersion: "traefik.io/v1alpha1",
    kind: "Ingress",
    metadata: {
      name: config.name,
      namespace: config.namespace,
    },
    spec: {
      rules: [
        {
          host: config.domain,
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: config.name,
                    port: { number: 80 },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}
