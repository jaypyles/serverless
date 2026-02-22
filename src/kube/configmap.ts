export function createConfigMap(
  serverContent: string,
  name: string = "serverless-func",
  namespace: string = "default",
) {
  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name,
      namespace,
    },
    data: {
      "index.js": serverContent,
    },
  };
}
