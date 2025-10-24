import { getInput, startGroup, endGroup, getBooleanInput, notice } from '@actions/core';
import { program } from 'commander';
import { generateReleaseTree } from './generateReleaseTree.js';
import { releasePackage } from './releasePackage.js';

const excludeInput = getInput('exclude');
let dryInput = false;
let devInput = false;

try {
	devInput = getBooleanInput('dev');
} catch {
	// We're not running in actions
}

try {
	dryInput = getBooleanInput('dry');
} catch {
	// We're not running in actions or the input isn't set (cron)
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
	.option('--tag <tag>', 'tag to use for dev releases (defaults to "dev")', getInput('tag'))
	.parse();

const {
	exclude,
	dry,
	dev,
	tag: inputTag,
} = program.opts<{ dev: boolean; dry: boolean; exclude: string[]; tag: string }>();

// All this because getInput('tag') will return empty string when not set :P
if (!dev && inputTag.length) {
	throw new Error('The --tag option can only be used with --dev');
}

const tag = inputTag.length ? inputTag : dev ? 'dev' : undefined;

const [packageName] = program.processedArgs as [string];
const tree = await generateReleaseTree(dry, tag, packageName, exclude);

const released: string[] = [];
const skipped: string[] = [];

for (const branch of tree) {
	startGroup(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);
	await Promise.all(
		branch.map(async (release) => {
			const result = await releasePackage(release, dry, tag);
			if (result) {
				released.push(`${release.name}@${release.version}`);
			} else {
				skipped.push(`${release.name}@${release.version}`);
			}
		}),
	);
	endGroup();
}

const releasedPackages = released.length > 0 ? released.join(', ') : 'None';
const skippedPackages = skipped.length > 0 ? skipped.join(', ') : 'None';
notice(`Released: ${releasedPackages}\nSkipped: ${skippedPackages}`, { title: 'Release summary' });
