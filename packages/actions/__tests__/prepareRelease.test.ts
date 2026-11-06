import { appendFile, chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import {
	applyReleasePlan,
	createReleasePlan,
	openReleasePullRequest,
	parseNextVersion,
} from '../src/prepareRelease/prepareRelease.js';
import * as commands from '../src/util/runCommand.js';

const runCommand = commands.runCommand;

const temporaryDirectories: string[] = [];
const releaseBranch = 'prepare-release-42-1';

afterEach(async () => {
	vi.restoreAllMocks();
	await Promise.all(
		temporaryDirectories.splice(0).map(async (directory) => rm(directory, { recursive: true, force: true })),
	);
});

async function fixture() {
	const directory = await mkdtemp(path.join(os.tmpdir(), 'prepare-release-'));
	temporaryDirectories.push(directory);
	const root = path.join(directory, 'repo');
	await mkdir(root);
	const git = async (...args: string[]) => runCommand('git', args, root);
	await git('init', '--initial-branch=main');
	await git('config', 'user.name', 'Release test');
	await git('config', 'user.email', 'release@example.com');
	await git('config', 'commit.gpgsign', 'false');
	await git('config', 'tag.gpgsign', 'false');
	for (const folder of ['rest', 'builders', 'discord.js', 'create-discord-bot', 'private']) {
		const scoped = folder === 'rest' || folder === 'builders';
		const name = scoped ? `@discordjs/${folder}` : folder;
		await mkdir(path.join(root, 'packages', folder, 'src'), { recursive: true });
		await writeFile(
			path.join(root, 'packages', folder, 'package.json'),
			JSON.stringify({ name, version: '1.0.0', private: folder === 'private', scripts: { release: 'cliff-jumper' } }),
		);
		await writeFile(
			path.join(root, 'packages', folder, '.cliff-jumperrc.json'),
			JSON.stringify({
				name: folder,
				...(scoped ? { org: 'discordjs' } : {}),
				packagePath: `packages/${folder}`,
				skipChangelog: false,
				skipTag: true,
				...(scoped ? {} : { tagTemplate: folder === 'discord.js' ? '{{new-version}}' : '{{name}}@{{new-version}}' }),
			}),
		);
		await writeFile(path.join(root, 'packages', folder, 'src', 'index.ts'), 'export {};\n');
		await writeFile(path.join(root, 'packages', folder, 'CHANGELOG.md'), '# Changelog\n');
	}

	await writeFile(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n');
	const commit = async (message = 'fix: change packages') => {
		await git('add', '.');
		await git('commit', '-m', message);
	};

	await commit('chore: initial release');
	for (const tag of ['@discordjs/rest@1.0.0', '@discordjs/builders@1.0.0', '1.0.0', 'create-discord-bot@1.0.0'])
		await git('tag', tag);
	const remote = path.join(directory, 'remote.git');
	await runCommand('git', ['init', '--bare', remote], directory);
	await git('remote', 'add', 'origin', remote);
	await git('push', 'origin', 'HEAD:refs/heads/main');
	const run = vi
		.spyOn(commands, 'runCommand')
		.mockImplementation(async (command: string, args: string[], cwd: string) => {
			if (command !== 'pnpm') return runCommand(command, args, cwd);
			if (args[0] === 'install') {
				await appendFile(path.join(root, 'pnpm-lock.yaml'), '# updated\n');
				return '';
			}

			const name = args[1]!;
			const folder = name.replace('@discordjs/', '');
			const manifestPath = path.join(root, 'packages', folder, 'package.json');
			const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as { version: string };
			const nextVersion = '1.0.1';
			if (!args.includes('--dry-run')) {
				await writeFile(manifestPath, JSON.stringify({ ...manifest, version: nextVersion }));
				await appendFile(path.join(root, 'packages', folder, 'CHANGELOG.md'), `# [${nextVersion}]\n`);
			}

			return `📦 Bumped ${name}@${nextVersion}`;
		});
	return { root, remote, git, commit, run };
}

describe('Release preparation', () => {
	test('auto detects nested package diffs against each reachable stable release and leaves the repository untouched', async () => {
		const { root, git, commit } = await fixture();
		await git('checkout', '-b', 'other');
		await writeFile(path.join(root, 'other.txt'), 'unreachable');
		await commit();
		await git('tag', '@discordjs/rest@99.0.0');
		await git('checkout', 'main');
		await appendFile(path.join(root, 'packages/rest/src/index.ts'), '// changed\n');
		await writeFile(path.join(root, 'README.md'), 'unrelated change');
		await commit();
		await git('tag', '@discordjs/rest@2.0.0-dev.1');
		const before = await git('rev-parse', 'HEAD');
		const tags = await git('tag');
		const plan = await createReleasePlan(root, 'main', 'auto', '');
		expect(plan.packages.find((pkg) => pkg.name === '@discordjs/rest')).toMatchObject({
			previousTag: '@discordjs/rest@1.0.0',
			nextVersion: '1.0.1',
		});
		expect(plan.packages.filter((pkg) => pkg.nextVersion).map((pkg) => pkg.name)).toEqual(['@discordjs/rest']);
		expect(plan.packages.some((pkg) => pkg.name === 'private')).toBe(false);
		expect(await git('status', '--porcelain')).toBe('');
		expect(await git('rev-parse', 'HEAD')).toBe(before);
		expect(await git('tag')).toBe(tags);
	});

	test('manual selection accepts multiple published names and folder aliases and deduplicates them', async () => {
		const { root } = await fixture();
		const plan = await createReleasePlan(
			root,
			'main',
			'manual',
			'rest, @discordjs/rest\ndiscord.js create-discord-bot',
		);
		expect(plan.packages).toHaveLength(3);
		expect(plan.packages.map((pkg) => pkg.name)).toEqual(
			['@discordjs/rest', 'discord.js', 'create-discord-bot'].sort((first, second) => first.localeCompare(second)),
		);
		expect(plan.packages.every((pkg) => pkg.nextVersion === '1.0.1')).toBe(true);
	});

	test('no changes produce no bumps or push; missing release tags select the package for a first release', async () => {
		const { root, git, run } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'auto', '');
		expect(plan.packages.every((pkg) => pkg.nextVersion === null)).toBe(true);
		run.mockClear();
		const prepared = await applyReleasePlan(root, plan, releaseBranch);
		expect(prepared).toBeNull();
		expect(run).not.toHaveBeenCalled();
		const createPullRequest = vi.fn();
		expect(
			await openReleasePullRequest(plan, prepared, 'https://github.com/example/run', createPullRequest),
		).toBeNull();
		expect(createPullRequest).not.toHaveBeenCalled();
		await git('tag', '-d', '@discordjs/rest@1.0.0');
		const firstRelease = await createReleasePlan(root, 'main', 'auto', '');
		expect(firstRelease.packages.find((pkg) => pkg.name === '@discordjs/rest')).toMatchObject({
			previousTag: null,
			nextVersion: '1.0.1',
		});
	});

	test('rejects invalid selection and dirty trees', async () => {
		const { root } = await fixture();
		await expect(createReleasePlan(root, 'main', 'manual', '')).rejects.toThrow('Select at least one');
		await expect(createReleasePlan(root, 'main', 'manual', 'rest;echo,nope')).rejects.toThrow('Unknown');
		await expect(createReleasePlan(root, 'main', 'manual', 'private')).rejects.toThrow('non-releasable');
		await expect(createReleasePlan(root, 'main', 'auto', 'rest')).rejects.toThrow('must be empty');
		await expect(createReleasePlan(root, 'main', 'invalid', '')).rejects.toThrow('Mode');
		await appendFile(path.join(root, 'packages/rest/src/index.ts'), '// dirty\n');
		await expect(createReleasePlan(root, 'main', 'auto', '')).rejects.toThrow('clean working tree');
	});

	test('pushes selected releases to a separate branch and opens a PR without changing the base or tags', async () => {
		const { root, git, run } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest,discord.js');
		await git('config', 'push.followTags', 'true');
		await git('tag', '-a', 'unrelated-local-tag', '-m', 'Local annotated tag');
		const tags = await git('tag');
		const remoteTags = await git('ls-remote', '--tags', 'origin');
		const result = await applyReleasePlan(root, plan, releaseBranch);
		const commit = await git('rev-parse', 'HEAD');
		expect(result).toEqual({ branch: releaseBranch, commit });
		const remoteRefs = await git('ls-remote', 'origin');
		expect(remoteRefs).toContain(`${commit}\trefs/heads/${releaseBranch}`);
		expect(remoteRefs).toContain(`${plan.head}\trefs/heads/main`);
		expect(await git('tag')).toBe(tags);
		expect(await git('ls-remote', '--tags', 'origin')).toBe(remoteTags);
		expect(await git('status', '--porcelain')).toBe('');
		expect(await git('show', 'HEAD:pnpm-lock.yaml')).toContain('# updated');
		expect(await git('show', 'HEAD:packages/builders/package.json')).toContain('1.0.0');
		const createPullRequest = vi.fn(async () => ({ html_url: 'https://github.com/example/repo/pull/1', number: 1 }));
		expect(await openReleasePullRequest(plan, result, 'https://github.com/example/run', createPullRequest)).toEqual({
			number: 1,
			url: 'https://github.com/example/repo/pull/1',
		});
		expect(createPullRequest).toHaveBeenCalledWith({
			base: 'main',
			head: releaseBranch,
			title: 'chore: release discord.js@1.0.1, @discordjs/rest@1.0.1',
			body: expect.stringContaining('| @discordjs/rest | 1.0.0 | 1.0.1 |'),
		});
		expect(
			run.mock.calls.filter(([command, args]) => command === 'pnpm' && args[0] !== 'install').map(([, args]) => args),
		).toEqual([
			['--filter', '@discordjs/rest', 'release', '--dry-run'],
			['--filter', 'discord.js', 'release', '--dry-run'],
			['--filter', '@discordjs/rest', 'release'],
			['--filter', 'discord.js', 'release'],
		]);
	});

	test('rejects a stale plan and an advanced remote branch before modifying packages', async () => {
		const { root, git, commit } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest');
		await writeFile(path.join(root, 'new.txt'), 'new commit');
		await commit();
		await expect(applyReleasePlan(root, plan, releaseBranch)).rejects.toThrow('HEAD changed');
		await git('push', 'origin', 'HEAD:refs/heads/main');
		await git('checkout', '--detach', plan.head);
		await expect(applyReleasePlan(root, plan, releaseBranch)).rejects.toThrow('Target branch advanced');
		expect(await git('status', '--porcelain')).toBe('');
	});

	test('succeeds when the remote base branch rejects direct pushes', async () => {
		const { root, remote, git } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest');
		const tags = await git('tag');
		const hook = path.join(remote, 'hooks', 'update');
		await writeFile(hook, '#!/bin/sh\nif [ "$1" = refs/heads/main ]; then exit 1; fi\n');
		await chmod(hook, 0o755);
		const result = await applyReleasePlan(root, plan, releaseBranch);
		expect(await git('ls-remote', 'origin', 'refs/heads/main')).toContain(plan.head);
		expect(await git('ls-remote', 'origin', `refs/heads/${releaseBranch}`)).toContain(result!.commit);
		expect(await git('tag')).toBe(tags);
	});

	test('opens a release PR against the selected maintenance branch without changing either base branch', async () => {
		const { root, git } = await fixture();
		const main = await git('rev-parse', 'HEAD');
		await git('checkout', '-b', 'release/v14');
		await git('push', 'origin', 'HEAD:refs/heads/release/v14');
		const plan = await createReleasePlan(root, 'release/v14', 'manual', 'rest');
		const result = await applyReleasePlan(root, plan, releaseBranch);
		expect(await git('ls-remote', 'origin', 'refs/heads/main')).toContain(main);
		expect(await git('ls-remote', 'origin', 'refs/heads/release/v14')).toContain(plan.head);
		expect(await git('ls-remote', 'origin', `refs/heads/${releaseBranch}`)).toContain(await git('rev-parse', 'HEAD'));
		const createPullRequest = vi.fn(async () => ({ html_url: 'https://github.com/example/repo/pull/2', number: 2 }));
		await openReleasePullRequest(plan, result, 'https://github.com/example/run', createPullRequest);
		expect(createPullRequest).toHaveBeenCalledWith(
			expect.objectContaining({ base: 'release/v14', head: releaseBranch }),
		);
	});

	test('rejects using the base branch for the prepared release', async () => {
		const { root, git } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest');
		await expect(applyReleasePlan(root, plan, 'main')).rejects.toThrow('must differ');
		expect(await git('status', '--porcelain')).toBe('');
	});

	test('surfaces PR creation failures while retaining the separate release branch', async () => {
		const { root, git } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest');
		const result = await applyReleasePlan(root, plan, releaseBranch);
		const createPullRequest = vi.fn(async () => {
			throw new Error('Pull requests permission required');
		});
		await expect(
			openReleasePullRequest(plan, result, 'https://github.com/example/run', createPullRequest),
		).rejects.toThrow('permission required');
		expect(await git('ls-remote', 'origin', 'refs/heads/main')).toContain(plan.head);
		expect(await git('ls-remote', 'origin', `refs/heads/${releaseBranch}`)).toContain(result!.commit);
	});

	test('does not overwrite an existing release branch', async () => {
		const { root, git } = await fixture();
		const plan = await createReleasePlan(root, 'main', 'manual', 'rest');
		await git('branch', releaseBranch);
		await expect(applyReleasePlan(root, plan, releaseBranch)).rejects.toThrow();
		expect(await git('rev-parse', releaseBranch)).toBe(plan.head);
		expect(await git('status', '--porcelain')).toBe('');
	});

	test('fails visibly if cliff-jumper changes its version output format', () => {
		expect(parseNextVersion('📦 Bumped @discordjs/rest@3.0.0\n', '@discordjs/rest')).toBe('3.0.0');
		expect(() => parseNextVersion('something else', '@discordjs/rest')).toThrow('Could not read');
	});
});
