export const getExpressServerContent = (
  handlerFiles: Record<string, string>,
  port: number,
) => {
  const routes = Object.keys(handlerFiles)
    .map((filename) => {
      const routeName = "/" + filename.replace(/\.js$/, "");
      const importPath = `./functions/${filename}`;
      return `

app.all("${routeName}", async (req, res, next) => {
  try {
    const { handler } = await import("${importPath}");
    if (typeof handler !== "function") throw new Error("Handler is not a function");
    handler(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
        `;
    })
    .join("\n");

  return `#!/usr/bin/env node

import express from "express";

const app = express();
app.use(express.json());

${routes}

const port = ${port};
app.listen(port, "0.0.0.0", () => console.log("Server running on port", port));
`;
};
