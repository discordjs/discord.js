import { getInput, startGroup, endGroup, getBooleanInput, summary } from '@actions/core';
import { program } from 'commander';
import { generateReleaseTree } from './generateReleaseTree.js';
import { releasePackage } from './releasePackage.js';

function npmPackageLink(packageName: string) {
	return `https://npmjs.com/package/${packageName}` as const;
}

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

interface ReleaseResult {
	identifier: string;
	url: string;
}

const publishedPackages: ReleaseResult[] = [];
const skippedPackages: ReleaseResult[] = [];

for (const branch of tree) {
	startGroup(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);

	await Promise.all(
		branch.map(async (release) => {
			const published = await releasePackage(release, dry, tag);
			const identifier = `${release.name}@${release.version}`;

			if (published) {
				publishedPackages.push({ identifier, url: npmPackageLink(release.name) });
			} else {
				skippedPackages.push({ identifier, url: npmPackageLink(release.name) });
			}
		}),
	);

	endGroup();
}

const result = summary.addHeading('Release summary');

if (dry) {
	result.addRaw('\n\n> [!NOTE]\n> This is a dry run.\n\n');
}

result.addHeading('Released', 2);

if (publishedPackages.length === 0) {
	result.addRaw('\n_None_\n\n');
} else {
	result.addRaw('\n');

	for (const { identifier, url } of publishedPackages) {
		result.addRaw(`- [${identifier}](${url})\n`);
	}

	result.addRaw(`\n`);
}

result.addHeading('Skipped', 2);

if (skippedPackages.length === 0) {
	result.addRaw('\n_None_\n\n');
} else {
	result.addRaw('\n');

	for (const { identifier, url } of skippedPackages) {
		result.addRaw(`- [${identifier}](${url})\n`);
	}

	result.addRaw(`\n`);
}

await result.write();
