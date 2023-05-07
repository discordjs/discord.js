#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import chalk from 'chalk';
import { program } from 'commander';
import validateProjectName from 'validate-npm-package-name';
import { install, resolvePackageManager } from './helpers/packageManager.js';
import { GUIDE_URL } from './util/constants.js';

program
	.description('Create a basic discord.js bot.')
	.option('--typescript', 'Whether to use the TypeScript template.')
	.argument('<directory>', 'The directory where this will be created.')
	.parse();

const { typescript } = program.opts();
const [directory] = program.args;

if (!directory) {
	console.error(chalk.red('Please specify the project directory.'));
	process.exit(1);
}

const root = path.resolve(directory);
const directoryName = path.basename(root);

// We'll use the directory name as the project name. Check npm name validity.
const validationResult = validateProjectName(directoryName);

if (!validationResult.validForNewPackages) {
	console.error(
		chalk.red(
			`Cannot create a project named ${chalk.yellow(`"${directoryName}"`)} due to npm naming restrictions.\n\nErrors:`,
		),
	);

	for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
		console.error(chalk.red(`- ${error}`));
	}

	console.error(chalk.red('\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.'));
	process.exit(1);
}

if (!existsSync(root)) {
	mkdirSync(root, { recursive: true });
}

console.log(`Creating ${directoryName} in ${chalk.green(root)}.`);
cpSync(new URL(`../template/${typescript ? 'TypeScript' : 'JavaScript'}`, import.meta.url), root, { recursive: true });

process.chdir(root);

const newPackageJSON = readFileSync('./package.json', { encoding: 'utf8' }).replace('[REPLACE-NAME]', directoryName);
writeFileSync('./package.json', newPackageJSON);

const packageManager = resolvePackageManager();
install(packageManager);
console.log(chalk.green('All done! Be sure to read through the discord.js guide for help on your journey.'));
console.log(`Link: ${chalk.cyan(GUIDE_URL)}`);
