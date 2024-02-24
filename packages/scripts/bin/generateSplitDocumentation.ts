#!/usr/bin/env node
/* eslint-disable n/shebang */
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { createCommand } from 'commander';
import packageFile from '../package.json';
import { generateSplitDocumentation } from '../src/index.js';

export interface CLIOptions {
	custom: string;
	input: string[];
	newOutput: string;
	output: string;
	root: string;
	typescript: boolean;
}

const command = createCommand().version(packageFile.version);

const program = command.parse(process.argv);
program.opts<CLIOptions>();

console.log('Generating split documentation...');
void generateSplitDocumentation({
	fetchPackageVersions: async (_) => {
		return ['main'];
	},
	fetchPackageVersionDocs: async (_, __) => {
		return JSON.parse(await readFile(`${process.cwd()}/docs/docs.api.json`, 'utf8'));
	},
}).then(() => console.log('Generated split documentation.'));
