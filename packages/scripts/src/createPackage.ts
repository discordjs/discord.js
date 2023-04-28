import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chdir } from 'node:process';
import { copy } from 'fs-extra';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';
import cliffJumperJSON from './template/.cliff-jumperrc.json';
import apiExtractorJSON from './template/api-extractor.json';
import templateJSON from './template/template.package.json';

interface LabelerData {
	color: string;
	name: string;
}

function sortYAMLObject(yaml: Record<string, string[]>) {
	const sortedYAML: typeof yaml = {};
	for (const key of Object.keys(yaml).sort((a, b) => a.localeCompare(b))) sortedYAML[key] = yaml[key]!;
	return sortedYAML;
}

export async function createPackage(packageName: string, packageDescription?: string) {
	const packageDir = join('packages', packageName);

	// Make directory for package
	await mkdir(packageDir);

	// Change to subdirectory
	chdir(packageDir);

	// Create folder structure
	await Promise.all([mkdir('src'), mkdir('__tests__')]);

	const templateDir = join('..', 'scripts', 'src', 'template');

	// Create files
	await writeFile(join('src', 'index.ts'), `console.log('Hello, from @discordjs/${packageName}');`);
	await writeFile('.eslintrc.json', await readFile(join(templateDir, 'template.eslintrc.json'), 'utf8'));
	await writeFile('.lintstagedrc.js', await readFile(join(templateDir, 'template.lintstagedrc.js'), 'utf8'));

	const packageJSON = {
		...templateJSON,
		name: templateJSON.name.replace('{name}', packageName),
		description: packageDescription ?? '',
	};

	// Edit changelog script
	packageJSON.scripts.changelog = packageJSON.scripts.changelog.replace('{name}', packageName);

	// Edit repository directory
	packageJSON.repository.directory = packageJSON.repository.directory.replace('{name}', packageName);

	// Create package.json
	await writeFile(`package.json`, JSON.stringify(packageJSON, null, 2));

	// Update cliff.toml
	const cliffTOML = (await readFile(join(templateDir, 'cliff.toml'), 'utf8')).replace('{name}', packageName);

	await writeFile('cliff.toml', cliffTOML);

	// Update .cliff-jumperrc.json
	const newCliffJumperJSON = { ...cliffJumperJSON, name: packageName, packagePath: `packages/${packageName}` };

	await writeFile('.cliff-jumperrc.json', JSON.stringify(newCliffJumperJSON, null, 2));

	// Update api-extractor.json
	const newApiExtractorJSON = { ...apiExtractorJSON };
	newApiExtractorJSON.docModel.projectFolderUrl = newApiExtractorJSON.docModel.projectFolderUrl.replace(
		'{name}',
		packageName,
	);

	await writeFile('api-extractor.json', JSON.stringify(newApiExtractorJSON, null, 2));

	// Move to github directory
	chdir(join('..', '..', '.github'));

	const labelsYAML = parseYAML(await readFile('labels.yml', 'utf8')) as LabelerData[];
	labelsYAML.push({ name: `packages:${packageName}`, color: 'fbca04' });

	labelsYAML.sort((a, b) => a.name.localeCompare(b.name));

	await writeFile('labels.yml', stringifyYAML(labelsYAML));

	const labelerYAML = parseYAML(await readFile('labeler.yml', 'utf8')) as Record<string, string[]>;
	labelerYAML[`packages:${packageName}`] = [`packages/${packageName}/*`, `packages/${packageName}/**/*`];

	await writeFile('labeler.yml', stringifyYAML(sortYAMLObject(labelerYAML)));

	const issueLabelerYAML = parseYAML(await readFile('issue-labeler.yml', 'utf8')) as Record<string, string[]>;
	issueLabelerYAML[`packages:${packageName}`] = [
		`### Which (application|package|application or package) is this (bug report|feature request) for\\?\\n\\n${packageName}\\n`,
	];

	await writeFile('issue-labeler.yml', stringifyYAML(sortYAMLObject(issueLabelerYAML)));

	// Move back to root
	chdir('..');

	// Copy default files over
	await copy(join('packages', 'scripts', 'src', 'template', 'default'), packageDir);
}
