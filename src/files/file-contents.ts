import fs from "fs";
import path from "path";

import { getExpressServerContent } from "@/server/server";

export const getFileContents = (file: string, options: Record<string, any>) => {
  const fullPath = path.resolve(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    console.error("File does not exist:", fullPath);
    process.exit(1);
  }

  const handlerContents = fs.readFileSync(fullPath, "utf-8");

  return getExpressServerContent(handlerContents, parseInt(options.port, 10));
};
