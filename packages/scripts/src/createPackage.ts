import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chdir } from 'node:process';
import type { JsonMap } from '@iarna/toml';
import { parse as parseTOML, stringify as stringifyTOML } from '@iarna/toml';
import { copy } from 'fs-extra';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';
import cliffJumperJSON from './template/.cliff-jumperrc.json';
import templateJSON from './template/template.package.json';

interface CliffTOML {
	changelog: {
		body: string;
		header: string;
		trim: boolean;
	};
	git: {
		commit_parsers: { group?: string; message: string; skip?: boolean }[];
		conventional_commits: boolean;
		date_order: boolean;
		filter_commits: boolean;
		filter_unconventional: boolean;
		ignore_tags: string;
		sort_commits: string;
		tag_pattern: string;
	};
}

interface LabelerData {
	color: string;
	name: string;
}

export async function createPackage(packageName: string, packageDescription?: string) {
	// Make directory for package
	await mkdir(`packages/${packageName}`);

	// Change to subdirectory
	chdir(`packages/${packageName}`);

	// Create folder structure
	await Promise.all([mkdir('src'), mkdir('__tests__')]);

	// Create files
	await writeFile('src/index.ts', `console.log('Hello, from @discord.js/${packageName}');`);

	await writeFile('.eslintrc.json', await readFile('../scripts/src/template/template.eslintrc.json', 'utf8'));

	await writeFile('.lintstagedrc.js', await readFile('../scripts/src/template/template.lintstagedrc.js', 'utf8'));

	const packageJSON = { ...templateJSON, name: packageName, description: packageDescription ?? '' };

	// Edit changelog script
	packageJSON.scripts.changelog = packageJSON.scripts.changelog.replace('{name}', packageName);

	// Create package.json
	await writeFile(`package.json`, JSON.stringify(packageJSON, null, 2));

	// Update cliff.toml
	const cliffTOML = parseTOML(
		await readFile(join('..', 'scripts/src/template/cliff.toml'), 'utf8'),
	) as unknown as CliffTOML;
	cliffTOML.git.tag_pattern = `@discordjs/${packageName}@[0-9]*`;

	await writeFile('cliff.toml', stringifyTOML(cliffTOML as unknown as JsonMap));

	// Update .cliff-jumperrc.json
	const newCliffJumperJSON = { ...cliffJumperJSON, name: packageName, packagePath: `packages/${packageName}` };

	await writeFile('.cliff-jumperrc.json', JSON.stringify(newCliffJumperJSON, null, 2));

	// Move to github directory
	chdir('../../.github');

	const labelsYAML = parseYAML(await readFile('labels.yml', 'utf8')) as LabelerData[];
	labelsYAML.push({ name: `packages:${packageName}`, color: 'fbca04' });

	await writeFile('labels.yml', stringifyYAML(labelsYAML));

	const labelerYAML = parseYAML(await readFile('labeler.yml', 'utf8')) as Record<string, string[]>;
	labelerYAML[`packages/${packageName}`] = [`packages:${packageName}/*`, `packages:${packageName}/**/*`];

	await writeFile('labeler.yml', stringifyYAML(labelerYAML));

	// Move back to root
	chdir('..');

	// Copy default files over
	await copy('packages/scripts/src/template/default', `packages/${packageName}`);
}
