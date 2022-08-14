#!/usr/bin/env node
import { createCommand } from 'commander';
import { build } from './index.js';
import packageFile from '../package.json';

export interface CLIOptions {
	input: string[];
	custom: string;
	root: string;
	output: string;
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
