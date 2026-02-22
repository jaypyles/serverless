import fs from "fs";
import path from "path";
import { configDir } from "@/config/constants";

export const readRegistry = () => {
  const registryFile = path.join(configDir, "registry.json");

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let data: Record<string, string> = {};

  if (fs.existsSync(registryFile)) {
    try {
      const fileContent = fs.readFileSync(registryFile, "utf-8");
      data = JSON.parse(fileContent);
    } catch (err) {
      console.warn("Failed to parse existing registry.json. Overwriting...");
    }
  }

  return { data, registryFile };
};

export const register = (name: string, content: string) => {
  const { registryFile, data } = readRegistry();
  data[name] = content;
  fs.writeFileSync(registryFile, JSON.stringify(data, null, 2), "utf-8");
};
