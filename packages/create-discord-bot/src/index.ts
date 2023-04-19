#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import chalk from 'chalk';
import { program } from 'commander';
import validateProjectName from 'validate-npm-package-name';

// A directory must be specified.
program
	.description('Create a template bot.')
	.requiredOption('--name <name>', 'The name of your project.')
	.option('--typescript', 'Whether to use a TypeScript template.')
	.argument('<directory>', 'The directory where this will be created.')
	.parse();

const { typescript, name } = program.opts();
const [directory] = program.args;

// Is the name supplied a valid npm name?
const validationResult = validateProjectName(name);

if (!validationResult.validForNewPackages) {
	console.error(
		chalk.red(`Cannot create a project named ${chalk.cyan(`"${name}"`)} due to npm naming restrictions.\n\nErrors:`),
	);

	for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
		console.error(chalk.red(`- ${error}`));
	}

	console.error(chalk.red('\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.'));
	process.exit(1);
}

// Is there a specified directory?
if (!directory) {
	console.error(chalk.red('Please specify the project directory!'));
	process.exit(1);
}

// Resolve the root of the project.
const root = path.resolve(directory);
const directoryName = path.basename(root);

// Ensure the directory exists.
if (!existsSync(root)) mkdirSync(root, { recursive: true });
console.log(`Creating ${directoryName} in ${chalk.green(root)}.`);

// Copy template!
cpSync(new URL(`../template/${typescript ? 'TypeScript' : 'ESM'}`, import.meta.url), root, { recursive: true });

// Move to the pasted directory.
process.chdir(root);

// Replace the name in the package.json.
const newPackageJSON = readFileSync('./package.json', { encoding: 'utf8' }).replace('[REPLACE-NAME]', name);
writeFileSync('./package.json', newPackageJSON);

// Install dependencies, because we're so nice.
console.log('Installing dependencies...');
execSync('npm install');

// Completion feedback.
console.log(chalk.green('All done! Be sure to check out the discord.js guide too!'));
