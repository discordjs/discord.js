import type { ExecException } from 'node:child_process';
import { cp, glob, mkdir, stat, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import { styleText } from 'node:util';
import type { PackageManager } from './helpers/packageManager.js';
import { install, isNodePackageManager } from './helpers/packageManager.js';
import { GUIDE_URL } from './util/constants.js';

interface Options {
	directory: string;
	installPackages: boolean;
	packageManager: PackageManager;
	typescript?: boolean;
}

export async function createDiscordBot({ directory, installPackages, typescript, packageManager }: Options) {
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
		console.error(
			styleText(
				'red',
				`The directory ${styleText('yellow', `"${directoryName}"`)} is either not a directory or is not empty.`,
			),
		);
		console.error(styleText('red', `Please specify an empty directory.`));
		process.exit(1);
	}

	console.log(`Creating ${directoryName} in ${styleText('green', root)}.`);
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
				new URL('../template/Bun/TypeScript/tsconfig.eslint.json', import.meta.url),
				`${root}/tsconfig.eslint.json`,
			);
			await cp(new URL('../template/Bun/TypeScript/tsconfig.json', import.meta.url), `${root}/tsconfig.json`);
		}
	}

	process.chdir(root);

	const newVSCodeSettings = await readFile('./.vscode/settings.json', {
		encoding: 'utf8',
	}).then((str) => {
		let newStr = str.replace('[REPLACE_ME]', deno || bun ? 'auto' : packageManager);
		if (deno) {
			// @ts-expect-error: This is fine
			newStr = newStr.replaceAll('"[REPLACE_BOOL]"', true);
		}

		return newStr;
	});
	await writeFile('./.vscode/settings.json', newVSCodeSettings);

	const globIterator = glob('./src/**/*.ts');
	for await (const file of globIterator) {
		const newData = await readFile(file, { encoding: 'utf8' }).then((str) =>
			str.replaceAll('[REPLACE_IMPORT_EXT]', typescript && !isNodePackageManager(packageManager) ? 'ts' : 'js'),
		);
		await writeFile(file, newData);
	}

	if (!deno) {
		const newPackageJSON = await readFile('./package.json', {
			encoding: 'utf8',
		}).then((str) => {
			let newStr = str.replace('[REPLACE_ME]', directoryName);
			newStr = newStr.replaceAll(
				'[REPLACE_IMPORT_EXT]',
				typescript && !isNodePackageManager(packageManager) ? 'ts' : 'js',
			);
			return newStr;
		});
		await writeFile('./package.json', newPackageJSON);
	}

	if (installPackages) {
		try {
			install(packageManager);
		} catch (error) {
			console.log();
			const err = error as ExecException;
			if (err.signal === 'SIGINT') {
				console.log(styleText('red', 'Installation aborted.'));
			} else {
				console.error(styleText('red', 'Installation failed.'));
				process.exit(1);
			}
		}
	}

	console.log();
	console.log(styleText('green', 'All done! Be sure to read through the discord.js guide for help on your journey.'));
	console.log(`Link: ${styleText('cyan', GUIDE_URL)}`);
}
