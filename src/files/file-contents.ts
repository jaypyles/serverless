import fs from "fs";
import path from "path";

import { getExpressServerContent } from "@/server/server";
import { readRegistry, register } from "@/kube/registry";

export const getFileContents = (file: string, options: Record<string, any>) => {
  const fullPath = path.resolve(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    console.error("File does not exist:", fullPath);
    process.exit(1);
  }

  const handlerContents = fs.readFileSync(fullPath, "utf-8");

  register(path.basename(file, ".js"), handlerContents);

  const { data } = readRegistry();

  return getExpressServerContent(data, parseInt(options.port, 10));
};
