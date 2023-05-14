#!/usr/bin/env node

// eslint-disable-next-line n/shebang
import { cp, stat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import chalk from 'chalk';
import validateProjectName from 'validate-npm-package-name';
import { install, resolvePackageManager } from './helpers/packageManager.js';
import { GUIDE_URL } from './util/constants.js';

interface Options {
	directory: string;
	javascript?: boolean;
	typescript?: boolean;
}

export async function createDiscordBot({ typescript, javascript, directory }: Options) {
	if (!directory) {
		console.error(chalk.red('Please specify the project directory.'));
		process.exit(1);
	}

	const root = path.resolve(directory);
	const directoryName = path.basename(root);

	const directoryStats = await stat(root).catch(async (error) => {
		// Create a new directory if the specified one does not exist.
		if (error.code === 'ENOENT') {
			await mkdir(root, { recursive: true });
			return stat(root);
		}

		throw error;
	});

	// If a directory exists and it's not empty, throw an error.
	if (directoryStats.isDirectory() && (await readdir(root)).length > 0) {
		console.error(chalk.red(`The directory ${chalk.yellow(`"${directoryName}"`)} is not empty.`));
		console.error(chalk.red(`Please specify an empty directory.`));
		process.exit(1);
	}

	// We'll use the directory name as the project name. Check npm name validity.
	const validationResult = validateProjectName(directoryName);

	if (!validationResult.validForNewPackages) {
		console.error(
			chalk.red(
				`Cannot create a project named ${chalk.yellow(
					`"${directoryName}"`,
				)} due to npm naming restrictions.\n\nErrors:`,
			),
		);

		for (const error of [...(validationResult.errors ?? []), ...(validationResult.warnings ?? [])]) {
			console.error(chalk.red(`- ${error}`));
		}

		console.error(chalk.red('\nSee https://docs.npmjs.com/cli/configuring-npm/package-json for more details.'));
		process.exit(1);
	}

	const rootStats = await stat(root);

	if (!rootStats.isDirectory()) {
		await mkdir(root, { recursive: true });
	}

	console.log(`Creating ${directoryName} in ${chalk.green(root)}.`);
	await cp(new URL(`../template/${typescript ? 'TypeScript' : 'JavaScript'}`, import.meta.url), root, {
		recursive: true,
	});

	process.chdir(root);

	const newPackageJSON = await readFile('./package.json', { encoding: 'utf8' }).then((str) =>
		str.replace('[REPLACE-NAME]', directoryName),
	);
	await writeFile('./package.json', newPackageJSON);

	const packageManager = resolvePackageManager();
	install(packageManager);
	console.log(chalk.green('All done! Be sure to read through the discord.js guide for help on your journey.'));
	console.log(`Link: ${chalk.cyan(GUIDE_URL)}`);
}
