import path from "path";

export const getConfig = (file: string, options: Record<string, any>) => {
  const envObj: Record<string, any> = {};
  options.env.forEach((e: string) => {
    const [key, value] = e.split("=");
    if (!key || value === undefined) return;
    envObj[key] = { value };
  });

  envObj.USER_FUNC_CODE = {
    valueFrom: {
      configMapKeyRef: {
        name: path.basename(file, ".js"),
        key: "functions",
      },
    },
  };

  envObj.SERVER_CODE = {
    valueFrom: {
      configMapKeyRef: {
        name: path.basename(file, ".js"),
        key: "server",
      },
    },
  };

  const name = path.basename(file, ".js");

  return {
    name,
    namespace: options.namespace,
    image: "jpyles0524/serverless:latest",
    port: parseInt(options.port, 10),
    replicas: 1,
    domain: options.domain,
    env: envObj,
  };
};
