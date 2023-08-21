import type { ExecException } from 'node:child_process';
import { cp, stat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import glob from 'fast-glob';
import { red, yellow, green, cyan } from 'picocolors';
import type { PackageManager } from './helpers/packageManager.js';
import { install } from './helpers/packageManager.js';
import { GUIDE_URL } from './util/constants.js';

interface Options {
	directory: string;
	packageManager: PackageManager;
	typescript?: boolean;
}

export async function createDiscordBot({ directory, typescript, packageManager }: Options) {
	const root = path.resolve(directory);
	const directoryName = path.basename(root);

	console.log();

	const directoryStats = await stat(root).catch(async (error) => {
		// Create a new directory if the specified one does not exist.
		if (error.code === 'ENOENT') {
			await mkdir(root, { recursive: true });
			return stat(root);
		}

		throw error;
	});

	// If the directory is actually a file or if it's not empty, throw an error.
	if (!directoryStats.isDirectory() || (await readdir(root)).length > 0) {
		console.error(red(`The directory ${yellow(`"${directoryName}"`)} is either not a directory or is not empty.`));
		console.error(red(`Please specify an empty directory.`));
		process.exit(1);
	}

	console.log(`Creating ${directoryName} in ${green(root)}.`);
	const deno = packageManager === 'deno';
	await cp(new URL(`../template/${deno ? 'Deno' : typescript ? 'TypeScript' : 'JavaScript'}`, import.meta.url), root, {
		recursive: true,
	});

	const bun = packageManager === 'bun';
	if (bun) {
		await cp(
			new URL(`../template/Bun/${typescript ? 'TypeScript' : 'JavaScript'}/package.json`, import.meta.url),
			`${root}/package.json`,
		);

		if (typescript) {
			await cp(
				new URL('../template/Bun/Typescript/tsconfig.eslint.json', import.meta.url),
				`${root}/tsconfig.eslint.json`,
			);
			await cp(new URL('../template/Bun/Typescript/tsconfig.json', import.meta.url), `${root}/tsconfig.json`);
		}
	}

	process.chdir(root);

	const newVSCodeSettings = await readFile('./.vscode/settings.json', { encoding: 'utf8' }).then((str) => {
		let newStr = str.replace('[REPLACE_ME]', deno || bun ? 'auto' : packageManager);
		if (deno) {
			// @ts-expect-error: This is fine
			newStr = newStr.replaceAll('"[REPLACE_BOOL]"', true);
		}

		return newStr;
	});
	await writeFile('./.vscode/settings.json', newVSCodeSettings);

	const globStream = glob.stream('./src/**/*.ts');
	for await (const file of globStream) {
		const newData = await readFile(file, { encoding: 'utf8' }).then((str) =>
			str.replaceAll('[REPLACE_IMPORT_EXT]', typescript ? 'ts' : 'js'),
		);
		await writeFile(file, newData);
	}

	const newPackageJSON = await readFile('./package.json', { encoding: 'utf8' }).then((str) => {
		let newStr = str.replace('[REPLACE_ME]', directoryName);
		newStr = newStr.replaceAll('[REPLACE_IMPORT_EXT]', typescript ? 'ts' : 'js');
		return newStr;
	});
	await writeFile('./package.json', newPackageJSON);

	try {
		install(packageManager);
	} catch (error) {
		console.log();
		const err = error as ExecException;
		if (err.signal === 'SIGINT') {
			console.log(red('Installation aborted.'));
		} else {
			console.error(red('Installation failed.'));
			process.exit(1);
		}
	}

	console.log();
	console.log(green('All done! Be sure to read through the discord.js guide for help on your journey.'));
	console.log(`Link: ${cyan(GUIDE_URL)}`);
}
