import { ok as assert } from 'node:assert/strict';
import { runCommand } from './runCommand.js';

export type ReleaseVersions = Record<string, string>;

export interface MergedRelease {
	baseBranch: string;
	mergeCommit: string;
	pullRequestNumber: number;
	repository: string;
	sourceBranch: string;
	sourceCommit: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isVersion(value: unknown): value is string {
	return typeof value === 'string' && /^\d+\.\d+\.\d+$/.test(value);
}

export function parseReleaseVersions(value: unknown): ReleaseVersions {
	assert(isRecord(value) && Object.keys(value).length > 0, 'Release selection must contain package versions');
	for (const [name, version] of Object.entries(value)) {
		assert(
			/^(?:@[\da-z][\d._a-z-]*\/)?[\da-z][\d._a-z-]*$/.test(name) && isVersion(version),
			'Invalid release package or version',
		);
	}

	return value as ReleaseVersions;
}

export function preparationSource(branch: string) {
	const match = /^prepare-release-(?<runId>[1-9]\d*)-(?<runAttempt>[1-9]\d*)$/.exec(branch)?.groups;
	assert(
		match && Number.isSafeInteger(Number(match.runId)) && Number.isSafeInteger(Number(match.runAttempt)),
		'Not a preparation branch',
	);
	return { runId: match.runId!, runAttempt: Number(match.runAttempt) };
}

export function validatePreparationRun(
	run: {
		conclusion: string | null;
		event: string;
		path: string;
		repository: { full_name: string };
		run_attempt?: number;
		status: string | null;
	},
	repository: string,
	attempt: number,
) {
	assert(run.repository.full_name === repository, 'Preparation run belongs to another repository');
	assert(
		run.path === '.github/workflows/prepare-release.yml' && run.event === 'workflow_dispatch',
		'Artifact did not originate from the preparation workflow',
	);
	assert(run.run_attempt === attempt, 'Preparation run attempt does not match the release PR');
	assert(
		run.status === 'completed' && run.conclusion === 'success',
		'Preparation run must complete successfully before publishing',
	);
}

/**
 * Validates the artifact against the merged PR and the versions actually changed by its merge commit.
 */
export async function validateReleaseManifest(
	value: unknown,
	expected: MergedRelease,
	root: string,
): Promise<ReleaseVersions> {
	assert(isRecord(value) && value.schemaVersion === 1, 'Unsupported release manifest');
	const source = preparationSource(expected.sourceBranch);
	for (const [key, required] of Object.entries({
		repository: expected.repository,
		pullRequestNumber: expected.pullRequestNumber,
		releaseBranch: expected.sourceBranch,
		releaseCommit: expected.sourceCommit,
		runId: source.runId,
		runAttempt: source.runAttempt,
	}))
		assert(value[key] === required, `Release manifest ${key} does not match the merged PR`);
	assert(
		isRecord(value.plan) && value.plan.branch === expected.baseBranch && Array.isArray(value.plan.packages),
		'Release manifest base branch or packages do not match',
	);
	assert(
		typeof value.plan.head === 'string' && /^[\da-f]{40}$/i.test(value.plan.head),
		'Invalid preparation base commit',
	);
	assert(
		/^[\da-f]{40}$/i.test(expected.mergeCommit) && /^[\da-f]{40}$/i.test(expected.sourceCommit),
		'Invalid release commit',
	);
	assert(
		(await runCommand('git', ['rev-parse', 'HEAD'], root)) === expected.mergeCommit,
		'Publishing must check out the PR merge commit',
	);
	const selected = new Map<string, { folder: string; nextVersion: string; version: string }>();
	for (const pkg of value.plan.packages) {
		assert(isRecord(pkg), 'Invalid package in release manifest');
		if (pkg.nextVersion === null) continue;
		assert(
			typeof pkg.name === 'string' && typeof pkg.folder === 'string' && /^packages\/[^./][^/]*$/.test(pkg.folder),
			'Invalid release package path',
		);
		assert(
			isVersion(pkg.version) && isVersion(pkg.nextVersion) && pkg.version !== pkg.nextVersion,
			'Release manifest must change package versions',
		);
		assert(!selected.has(pkg.name), 'Duplicate release package');
		selected.set(pkg.name, { folder: pkg.folder, version: pkg.version, nextVersion: pkg.nextVersion });
	}

	assert(selected.size > 0, 'Release manifest contains no version bumps');
	const changedFiles = (
		await runCommand(
			'git',
			['diff', '--name-only', `${expected.mergeCommit}^1`, expected.mergeCommit, '--', 'packages/*/package.json'],
			root,
		)
	)
		.split('\n')
		.filter((file) => /^packages\/[^/]+\/package\.json$/.test(file));
	const actual = new Map<string, string>();
	for (const file of changedFiles) {
		const before = JSON.parse(await runCommand('git', ['show', `${expected.mergeCommit}^1:${file}`], root)) as {
			name: string;
			version: string;
		};
		const after = JSON.parse(await runCommand('git', ['show', `${expected.mergeCommit}:${file}`], root)) as {
			name: string;
			private?: boolean;
			version: string;
		};
		if (before.version === after.version) continue;
		const pkg = selected.get(after.name);
		assert(pkg && !after.private && before.name === after.name, `Unplanned or private package version bump in ${file}`);
		assert(
			file === `${pkg.folder}/package.json` && before.version === pkg.version && after.version === pkg.nextVersion,
			`Merged version for ${after.name} differs from the release artifact`,
		);
		actual.set(after.name, after.version);
	}

	assert(actual.size === selected.size, 'Merged PR does not contain every planned version bump');
	return parseReleaseVersions(Object.fromEntries(actual));
}
