#!/usr/bin/env node
import { runGenerator } from '@discordjs/ts-docgen';
import { createCommand } from 'commander';
import packageFile from '../package.json';

interface CLIOptions {
	input: string;
	custom: string;
	output: string;
}

const command = createCommand()
	.version(packageFile.version)
	.option('-i, --input <string>', 'Path to an existing TypeDoc JSON output file')
	.option('-c, --custom <string>', 'Custom docs definition file to use')
	.option('-o, --output <string>', 'Path to output file');

const program = command.parse(process.argv);
const options = program.opts<CLIOptions>();

runGenerator({
	existingOutput: options.input,
	custom: options.custom,
	output: options.output,
});
