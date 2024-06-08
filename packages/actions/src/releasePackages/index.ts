import { getInput } from '@actions/core';
import { program } from 'commander';
import { generateReleaseTree } from './generateReleaseTree.js';
import { releasePackage } from './releasePackage.js';

program
	.name('release packages')
	.description('releases monorepo packages with proper sequencing')
	.argument('[package]', "release a specific package (and it's dependencies)", getInput('package'))
	.option(
		'-e, --exclude <packages...>',
		'exclude specific packages from releasing (will still release if necessary for another package)',
		getInput('exclude').split(','),
	)
	.parse();

const { exclude } = program.opts<{ exclude: string[] }>();
const packageName = program.args[0]!;

const tree = await generateReleaseTree(packageName, exclude);
for (const branch of tree) {
	console.log(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);
	await Promise.all(branch.map(async (release) => releasePackage(release)));
}

console.log(
	`Successfully released ${tree.map((branch) => branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')).join(', ')}`,
);
