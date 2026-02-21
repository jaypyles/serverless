export const getExpressServerContent = (
  handlerContents: string,
  port: number,
) => {
  return `#!/usr/bin/env node

const express = require("express");

${handlerContents}

const app = express();

app.use(express.json());
app.all("/", (req, res) => handler(req, res));

const port = ${port};
app.listen(port, "0.0.0.0", () => console.log("Server running"));
`;
};
