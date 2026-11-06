import process from 'node:process';
import { getInput, startGroup, endGroup, getBooleanInput, setFailed, summary } from '@actions/core';
import { context } from '@actions/github';
import { program } from 'commander';
import { parseReleaseVersions } from '../util/releaseManifest.js';
import { createReleaseNotifier } from '../util/releaseNotifications.js';
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
	.option(
		'--versions <json>',
		'release packages from a validated preparation artifact and their dependencies',
		getInput('versions'),
	)
	.parse();

const {
	exclude,
	dry,
	dev,
	tag: inputTag,
	versions: versionInput,
} = program.opts<{ dev: boolean; dry: boolean; exclude: string[]; tag: string; versions: string }>();

interface ReleaseResult {
	identifier: string;
	url: string;
}

const publishedPackages: ReleaseResult[] = [];
const skippedPackages: ReleaseResult[] = [];
const pullRequest = context.payload.pull_request;
const details = {
	dryRun: dry,
	published: publishedPackages,
	skipped: skippedPackages,
	pullRequest: pullRequest ? { number: pullRequest.number, url: pullRequest.html_url as string } : null,
};
const repository = process.env.GITHUB_REPOSITORY ?? '';
const runId = process.env.GITHUB_RUN_ID ?? '';
const notify = createReleaseNotifier<typeof details>(
	{
		branch: pullRequest?.base.ref ?? context.payload.inputs?.ref ?? context.ref,
		mode: dev ? 'publish-dev' : 'publish',
		repository,
		requestId: getInput('request_id') || null,
		runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT ?? '1'),
		runId,
		runUrl: `${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${runId}`,
		workflow: process.env.GITHUB_WORKFLOW ?? '',
	},
	{ url: process.env.RELEASE_WEBHOOK_URL ?? '', secret: process.env.RELEASE_WEBHOOK_SECRET ?? '' },
);

try {
	await notify('started', details);
	// All this because getInput('tag') will return empty string when not set :P
	if (!dev && inputTag.length) {
		throw new Error('The --tag option can only be used with --dev');
	}

	const tag = inputTag.length ? inputTag : dev ? 'dev' : undefined;
	const [packageName] = program.processedArgs as [string];
	const versions = versionInput ? parseReleaseVersions(JSON.parse(versionInput)) : undefined;
	if (process.env.GITHUB_EVENT_NAME === 'pull_request_target' && !versions)
		throw new Error('Merged release publishing requires a validated artifact selection');
	if (versions && (dev || packageName || exclude.length))
		throw new Error(
			'Artifact selection cannot be combined with development releases, package selection, or exclusions',
		);
	const tree = await generateReleaseTree(dry, tag, packageName, exclude, versions);

	for (const branch of tree) {
		startGroup(`Releasing ${branch.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`);

		const results = await Promise.allSettled(
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
		const failure = results.find((result) => result.status === 'rejected');
		if (failure) throw failure.reason;
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
	await notify('completed', details);
} catch (error) {
	setFailed(error instanceof Error ? error.message : String(error));
	await notify('failed', details);
}
