import { getInput, startGroup, endGroup, getBooleanInput, info } from '@actions/core';
import { program } from 'commander';
import { generateReleaseTree } from './generateReleaseTree.js';
import { releasePackage } from './releasePackage.js';

const excludeInput = getInput('exclude');
let dryInput = false;
let devInput = false;
try {
	dryInput = getBooleanInput('dry');
	devInput = getBooleanInput('dev');
} catch {
	// We're not running in actions
}

program
	.name('release packages')
	.description('releases monorepo packages with proper sequencing')
	.argument('[package]', "release a specific package (and it's dependencies)", getInput('package'))
	.option(
		'-e, --exclude <packages...>',
		'exclude specific packages from releasing (will still release if necessary for another package)',
		excludeInput ? excludeInput.split(',') : [],
	)
	.option('--dry', 'skips actual publishing and outputs logs instead', dryInput)
	.option('--dev', 'publishes development versions and skips tagging / github releases', devInput)
	.parse();

const { exclude, dry, dev } = program.opts<{ dev: boolean; dry: boolean; exclude: string[] }>();
const packageName = program.args[0]!;

const tree = await generateReleaseTree(dev, dry, packageName, exclude);
for (const branch of tree) {
	startGroup(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);
	await Promise.all(branch.map(async (release) => releasePackage(release, dev, dry)));
	endGroup();
}

info(
	`Successfully released ${tree.map((branch) => branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')).join(', ')}`,
);
