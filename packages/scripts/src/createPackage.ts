import { mkdir, writeFile, readFile } from 'node:fs/promises';
import process from 'node:process';
import type { JsonMap } from '@iarna/toml';
import { parse as parseTOML, stringify as stringifyTOML } from '@iarna/toml';
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

const packageName = process.argv[2];

// Make directory for package
await mkdir(`packages/${packageName}`);

// Change to subdirectory
process.chdir(`packages/${packageName}`);

const packageJSON = { ...templateJSON, name: packageName };

// Create package.json
await writeFile(`packages/${packageName}/package.json`, JSON.stringify(packageJSON, null, 2));

// Update cliff.toml
const cliffTOML = parseTOML(await readFile('../packages/scripts/template/cliff.toml', 'utf8')) as unknown as CliffTOML;
cliffTOML.git.tag_pattern = `@discordjs/${packageName}@[0-9]*`;

await writeFile('cliff.toml', stringifyTOML(cliffTOML as unknown as JsonMap));

// Update .cliff-jumperrc.json
const newCliffJumperJSON = { ...cliffJumperJSON, name: packageName, packagePath: `packages/${packageName}` };

await writeFile('.cliff-jumperrc.json', JSON.stringify(newCliffJumperJSON, null, 2));

// Move to github directory
process.chdir('../../.github');

const labelsYAML = parseYAML(await readFile('labels.yml', 'utf8')) as LabelerData[];
labelsYAML.push({ color: 'fbca04', name: `packages:${packageName}` });

await writeFile('labels.yml', stringifyYAML(labelsYAML));

const labelerYAML = parseYAML(await readFile('labeler.yml', 'utf8')) as Record<string, string[]>;
labelerYAML[`packages/${packageName}`] = [`packages:${packageName}/*`, `packages:${packageName}/**/*`];

await writeFile('labeler.yml', stringifyYAML(labelerYAML));
