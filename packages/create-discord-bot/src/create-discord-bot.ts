#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { program } from 'commander';
import validateProjectName from 'validate-npm-package-name';
import { install, resolvePackageManager } from './helpers/packageManager.js';
import { GUIDE_URL } from './util/constants.js';

program
	.description('Create a basic discord.js bot.')
	.option('--typescript', 'Whether to use the TypeScript template.')
	.parse();

const main = async () => {
	p.intro(`${chalk.bgCyan(chalk.black(' Create DiscordJS Bot '))}`);

	const project = await p.group(
		{
			path: async () =>
				p.text({
					message: 'Where should we create your project?',
					placeholder: './sparkling-solid',
					validate: (value) => {
						if (!value) return 'Please enter a path.';
						if (!value.startsWith('.')) return 'Please enter a relative path.';
					},
				}),
			type: async ({ results }) =>
				p.select({
					message: `Pick a project type within "${results.path}"`,
					initialValue: 'ts',
					options: [
						{ value: 'ts', label: 'TypeScript' },
						{ value: 'js', label: 'JavaScript' },
					],
				}),
			install: async () =>
				p.confirm({
					message: 'Install dependencies?',
					initialValue: false,
				}),
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			},
		},
	);

	const root = path.resolve(project.path);
	const directoryName = path.basename(root);

	if (existsSync(root) && readdirSync(root).length > 0) {
		console.error(chalk.bold.red(`${chalk.yellow(`"${directoryName}"`)} is not empty.`));
		console.error(chalk.bold.red(`Please specify an empty directory.`));
		process.exit(1);
	}

	const validationResult = validateProjectName(directoryName);

	if (!validationResult.validForNewPackages) {
		console.error(
			chalk.bold.red(
				`Cannot create a project named ${chalk.bold.yellow(
					`"${directoryName}"`,
				)} due to npm naming restrictions.\n\nErrors:`,
			),
		);

		for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
			console.error(chalk.bold.red(`- ${error}`));
		}

		console.error(chalk.bold.red('\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.'));
		process.exit(1);
	}

	if (!existsSync(root)) {
		mkdirSync(root, { recursive: true });
	}

	const spinner = p.spinner();

	spinner.start('Creating project...');
	cpSync(new URL(`../template/${project.type ? 'TypeScript' : 'JavaScript'}`, import.meta.url), root, {
		recursive: true,
	});

	process.chdir(root);

	const newPackageJSON = readFileSync('./package.json', { encoding: 'utf8' }).replace('[REPLACE-NAME]', directoryName);
	writeFileSync('./package.json', newPackageJSON);

	spinner.stop('Files created.');

	spinner.start('Downloading dependencies... this may take a while.');

	const packageManager = resolvePackageManager();
	install(packageManager);

	spinner.stop("Downloaded dependencies. You're ready to go!");
	console.log(chalk.bold.green('All done! Be sure to read through the discord.js guide for help on your journey.'));
	console.log(`Link: ${chalk.bold.cyan(GUIDE_URL)}`);
};

await main();
