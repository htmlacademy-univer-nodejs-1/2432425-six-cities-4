#!/usr/bin/env node

import CLIApplication from './cli.js';
import HelpCommand from './cli-command/help.command.js';
import VersionCommand from './cli-command/version.command.js';
import ImportCommand from './cli-command/import.command.js';

const cliManager = new CLIApplication();

cliManager.registerCommands([
  new HelpCommand,
  new VersionCommand,
  new ImportCommand,
]);

cliManager.processCommand(process.argv);
