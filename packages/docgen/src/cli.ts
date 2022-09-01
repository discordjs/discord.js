#!/usr/bin/env node
/* eslint-disable n/shebang */
import process from 'node:process';
import { createCommand } from 'commander';
import packageFile from '../package.json';
import { build } from './index.js';

export interface CLIOptions {
	custom: string;
	input: string[];
	output: string;
	root: string;
	typescript: boolean;
}

const command = createCommand()
	.version(packageFile.version)
	.option('-i, --input <string...>', 'Source directories to parse JSDocs in')
	.option('-c, --custom <string>', 'Custom docs definition file to use')
	.option('-r, --root [string]', 'Root directory of the project', '.')
	.option('-o, --output <string>', 'Path to output file')
	.option('--typescript', '', false);

const program = command.parse(process.argv);
const options = program.opts<CLIOptions>();

build(options);
