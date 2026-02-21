export function createConfigMap(
  serverContent: string,
  name: string = "serverless-func",
  namespace: string = "default",
) {
  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: "myfunc",
      namespace,
    },
    data: {
      "index.js": serverContent,
    },
  };
}
