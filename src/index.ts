#!/usr/bin/env node

import { Command } from "commander";
import { createDeployCommand } from "./commands/deploy";
import { createDeleteCommand } from "./commands/delete";

const program = new Command();
createDeployCommand(program);
createDeleteCommand(program);
program.parse(process.argv);
