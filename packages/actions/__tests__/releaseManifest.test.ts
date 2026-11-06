import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
	parseReleaseVersions,
	preparationSource,
	validatePreparationRun,
	validateReleaseManifest,
	type MergedRelease,
} from '../src/util/releaseManifest.js';
import { releaseTitle, type ReleaseManifest } from '../src/util/releasePlan.js';
import { runCommand } from '../src/util/runCommand.js';

const directories: string[] = [];
afterEach(async () => {
	await Promise.all(directories.splice(0).map(async (directory) => rm(directory, { recursive: true, force: true })));
});

async function fixture(strategy: 'merge' | 'rebase' | 'squash' = 'squash') {
	const root = await mkdtemp(path.join(os.tmpdir(), 'release-manifest-'));
	directories.push(root);
	const git = async (...args: string[]) => runCommand('git', args, root);
	await git('init', '--initial-branch=main');
	await git('config', 'user.name', 'Release test');
	await git('config', 'user.email', 'release@example.com');
	await git('config', 'commit.gpgsign', 'false');
	for (const name of ['rest', 'core', 'builders']) {
		await mkdir(path.join(root, 'packages', name), { recursive: true });
		await writeFile(
			path.join(root, 'packages', name, 'package.json'),
			JSON.stringify({ name: `@discordjs/${name}`, version: '1.0.0' }),
		);
	}

	const commit = async (message: string) => {
		await git('add', '.');
		await git('commit', '-m', message);
	};

	await commit('chore: initial');
	const base = await git('rev-parse', 'HEAD');
	const branch = 'prepare-release-42-1';
	await git('checkout', '-b', branch);
	await writeFile(
		path.join(root, 'packages/rest/package.json'),
		JSON.stringify({ name: '@discordjs/rest', version: '2.0.0' }),
	);
	await writeFile(
		path.join(root, 'packages/core/package.json'),
		JSON.stringify({ name: '@discordjs/core', version: '1.1.0' }),
	);
	await commit('chore: release packages');
	const source = await git('rev-parse', 'HEAD');
	await git('checkout', 'main');
	await writeFile(path.join(root, 'README.md'), 'Other changes after preparation');
	await commit('docs: unrelated update');
	if (strategy === 'squash') {
		await git('merge', '--squash', branch);
		await commit('chore: release packages');
	} else if (strategy === 'merge') {
		await git('merge', '--no-ff', branch, '-m', 'Merge release PR');
	} else {
		await git('checkout', branch);
		await git('rebase', 'main');
		await git('checkout', 'main');
		await git('merge', '--ff-only', branch);
	}

	const expected: MergedRelease = {
		repository: 'discordjs/discord.js',
		pullRequestNumber: 12,
		baseBranch: 'main',
		sourceBranch: branch,
		sourceCommit: source,
		mergeCommit: await git('rev-parse', 'HEAD'),
	};
	const manifest: ReleaseManifest = {
		schemaVersion: 1,
		repository: expected.repository,
		runId: '42',
		runAttempt: 1,
		pullRequestNumber: 12,
		releaseBranch: branch,
		releaseCommit: source,
		plan: {
			branch: 'main',
			head: base,
			mode: 'manual',
			packages: [
				{
					name: '@discordjs/rest',
					folder: 'packages/rest',
					version: '1.0.0',
					nextVersion: '2.0.0',
					previousTag: '@discordjs/rest@1.0.0',
				},
				{
					name: '@discordjs/core',
					folder: 'packages/core',
					version: '1.0.0',
					nextVersion: '1.1.0',
					previousTag: '@discordjs/core@1.0.0',
				},
			],
		},
	};
	return { root, git, manifest, expected };
}

describe('Prepared release manifests', () => {
	test.each(['squash', 'merge', 'rebase'] as const)(
		'validates the versions actually bumped by a %s merge',
		async (strategy) => {
			const { root, manifest, expected } = await fixture(strategy);
			expect(await validateReleaseManifest(manifest, expected, root)).toEqual({
				'@discordjs/rest': '2.0.0',
				'@discordjs/core': '1.1.0',
			});
		},
	);

	test('rejects artifacts for another PR, run attempt, repository, base branch, or source commit', async () => {
		const { root, manifest, expected } = await fixture();
		for (const update of [
			{ pullRequestNumber: 13 },
			{ runId: '43' },
			{ runAttempt: 2 },
			{ repository: 'other/repo' },
			{ releaseBranch: 'prepare-release-43-1' },
			{ releaseCommit: 'a'.repeat(40) },
			{ plan: { ...manifest.plan, branch: 'v14' } },
		]) {
			await expect(validateReleaseManifest({ ...manifest, ...update }, expected, root)).rejects.toThrow('match');
		}
	});

	test('rejects edited versions, extra bumps, missing bumps, and private packages', async () => {
		const { root, git, manifest, expected } = await fixture();
		const edited = structuredClone(manifest);
		edited.plan.packages[0]!.nextVersion = '3.0.0';
		await expect(validateReleaseManifest(edited, expected, root)).rejects.toThrow('differs');
		const missing = structuredClone(manifest);
		missing.plan.packages.pop();
		await expect(validateReleaseManifest(missing, expected, root)).rejects.toThrow('Unplanned');
		const extra = structuredClone(manifest);
		extra.plan.packages.push({ ...extra.plan.packages[0]!, folder: 'packages/builders', name: '@discordjs/builders' });
		await expect(validateReleaseManifest(extra, expected, root)).rejects.toThrow('every planned');
		await writeFile(
			path.join(root, 'packages/rest/package.json'),
			JSON.stringify({ name: '@discordjs/rest', version: '2.0.0', private: true }),
		);
		await git('add', '.');
		await git('commit', '--amend', '--no-edit');
		await expect(
			validateReleaseManifest(manifest, { ...expected, mergeCommit: await git('rev-parse', 'HEAD') }, root),
		).rejects.toThrow('private');
	});

	test('rejects an expired-format artifact, duplicate entries, unsafe paths, and a different checkout', async () => {
		const { root, manifest, expected } = await fixture();
		await expect(validateReleaseManifest(manifest.plan, expected, root)).rejects.toThrow('Unsupported');
		const duplicate = structuredClone(manifest);
		duplicate.plan.packages.push(duplicate.plan.packages[0]!);
		await expect(validateReleaseManifest(duplicate, expected, root)).rejects.toThrow('Duplicate');
		const unsafe = structuredClone(manifest);
		unsafe.plan.packages[0]!.folder = 'packages/../../other';
		await expect(validateReleaseManifest(unsafe, expected, root)).rejects.toThrow('path');
		await expect(validateReleaseManifest(manifest, { ...expected, mergeCommit: 'a'.repeat(40) }, root)).rejects.toThrow(
			'merge commit',
		);
	});

	test('accepts artifacts only from successful preparation workflow dispatches in the same repository', () => {
		const run = {
			repository: { full_name: 'discordjs/discord.js' },
			path: '.github/workflows/prepare-release.yml',
			event: 'workflow_dispatch',
			status: 'completed',
			conclusion: 'success',
			run_attempt: 1,
		};
		expect(() => validatePreparationRun(run, 'discordjs/discord.js', 1)).not.toThrow();
		for (const update of [
			{ path: '.github/workflows/tests.yml' },
			{ event: 'pull_request' },
			{ conclusion: 'failure' },
			{ status: 'in_progress' },
			{ run_attempt: 2 },
			{ repository: { full_name: 'fork/repo' } },
		])
			expect(() => validatePreparationRun({ ...run, ...update }, 'discordjs/discord.js', 1)).toThrow();
		expect(preparationSource('prepare-release-42-3')).toEqual({ runId: '42', runAttempt: 3 });
		expect(() => preparationSource('some-branch')).toThrow();
		expect(() => parseReleaseVersions({})).toThrow();
		expect(() => parseReleaseVersions({ '@discordjs/rest': 'not-a-version' })).toThrow();
	});

	test('release titles name packages and versions while respecting the PR title subject limit', async () => {
		const { manifest } = await fixture();
		expect(releaseTitle(manifest.plan)).toBe('chore: release @discordjs/core@1.1.0, @discordjs/rest@2.0.0');
		const many = {
			...manifest.plan,
			packages: Array.from({ length: 20 }, (_, index) => ({
				...manifest.plan.packages[0]!,
				name: `@discordjs/package-${index}`,
			})),
		};
		const title = releaseTitle(many);
		expect(title).toContain('and 19 other packages');
		expect(title.slice('chore: '.length).length).toBeLessThanOrEqual(72);
	});
});
