import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { releaseTitle, type ReleaseChange, type ReleasePlan } from '../util/releasePlan.js';
import { runCommand } from '../util/runCommand.js';

interface ReleaseConfig {
	name: string;
	org?: string;
	packagePath: string;
	tagTemplate?: string;
}

export interface PreparedRelease {
	branch: string;
	commit: string;
}

export interface ReleasePullRequest {
	number: number;
	url: string;
}

async function readPackages(root: string) {
	const packages = [];
	for (const entry of await readdir(path.join(root, 'packages'), { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const folder = `packages/${entry.name}`;
		const manifest = await readFile(path.join(root, folder, 'package.json'), 'utf8').catch(
			(error: NodeJS.ErrnoException) => {
				if (error.code === 'ENOENT') return null;
				throw error;
			},
		);
		if (manifest === null) continue;
		const pkg = JSON.parse(manifest) as {
			name: string;
			private?: boolean;
			scripts?: { release?: string };
			version: string;
		};
		if (pkg.private || pkg.scripts?.release !== 'cliff-jumper') continue;
		const config = JSON.parse(await readFile(path.join(root, folder, '.cliff-jumperrc.json'), 'utf8')) as ReleaseConfig;
		if (config.packagePath !== folder || (config.org ? `@${config.org}/${config.name}` : config.name) !== pkg.name) {
			throw new Error(`Release configuration does not match ${pkg.name}`);
		}

		const tagTemplate = (config.tagTemplate ?? (config.org ? '{{full-name}}@{{new-version}}' : 'v{{new-version}}'))
			.replaceAll('{{full-name}}', pkg.name)
			.replaceAll('{{name}}', config.name)
			.replaceAll('{{org}}', config.org ?? '');
		packages.push({ folder, name: pkg.name, version: pkg.version, tagTemplate });
	}

	return packages.sort((first, second) => first.name.localeCompare(second.name));
}

function stableTagPattern(template: string) {
	return new RegExp(
		`^${template.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&').replace('\\{\\{new-version\\}\\}', '\\d+\\.\\d+\\.\\d+')}$`,
	);
}

/**
 * Uses cliff-jumper's own recommendation to plan version bumps before generating changelogs.
 */
export function parseNextVersion(output: string, name: string) {
	const prefix = `📦 Bumped ${name}@`;
	const version = output
		.split('\n')
		.find((line) => line.startsWith(prefix))
		?.slice(prefix.length)
		.trim();
	if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
		throw new Error(`Could not read cliff-jumper's proposed version for ${name}:\n${output}`);
	}

	return version;
}

export async function createReleasePlan(
	root: string,
	branch: string,
	mode: string,
	selection: string,
): Promise<ReleasePlan> {
	if (mode !== 'auto' && mode !== 'manual') throw new Error('Mode must be auto or manual');
	await runCommand('git', ['check-ref-format', `refs/heads/${branch}`], root);
	if (await runCommand('git', ['status', '--porcelain', '--untracked-files=no'], root)) {
		throw new Error('Release preparation requires a clean working tree and index');
	}

	if ((await runCommand('git', ['rev-parse', '--is-shallow-repository'], root)) === 'true') {
		throw new Error('Release preparation requires full history and tags (fetch-depth: 0)');
	}

	let packages = await readPackages(root);
	const names = [...new Set(selection.split(/[\s,]+/).filter(Boolean))];
	if (mode === 'auto' && names.length) throw new Error('Package selection must be empty in auto mode');
	if (mode === 'manual') {
		if (!names.length) throw new Error('Select at least one package in manual mode');
		for (const name of names) {
			if (!packages.some((pkg) => pkg.name === name || pkg.folder === `packages/${name}`)) {
				throw new Error(`Unknown or non-releasable package: ${name}`);
			}
		}

		packages = packages.filter(
			(pkg) => names.includes(pkg.name) || names.includes(pkg.folder.slice('packages/'.length)),
		);
	}

	const head = await runCommand('git', ['rev-parse', 'HEAD'], root);
	const tags = (await runCommand('git', ['tag', '--merged', 'HEAD', '--sort=-version:refname'], root)).split('\n');
	const changes: ReleaseChange[] = [];
	for (const { tagTemplate, ...pkg } of packages) {
		const pattern = stableTagPattern(tagTemplate);
		const previousTag = tags.find((tag) => pattern.test(tag)) ?? null;
		const diff = previousTag
			? await runCommand('git', ['diff', '--name-only', `${previousTag}..${head}`, '--', `${pkg.folder}/`], root)
			: await runCommand('git', ['ls-files', '--', `${pkg.folder}/`], root);
		let nextVersion: string | null = null;
		if (diff || mode === 'manual') {
			const output = await runCommand('pnpm', ['--filter', pkg.name, 'release', '--dry-run'], root);
			nextVersion = parseNextVersion(output, pkg.name);
		}

		changes.push({ ...pkg, previousTag, nextVersion });
	}

	return { branch, head, mode, packages: changes };
}

/**
 * Makes one release commit and pushes it to a separate branch for review.
 */
export async function applyReleasePlan(
	root: string,
	plan: ReleasePlan,
	releaseBranch: string,
): Promise<PreparedRelease | null> {
	const releases = plan.packages.filter((pkg) => pkg.nextVersion !== null);
	if (!releases.length) return null;
	if (releaseBranch === plan.branch) throw new Error('The release branch must differ from the base branch');
	await runCommand('git', ['check-ref-format', '--branch', releaseBranch], root);
	if ((await runCommand('git', ['rev-parse', 'HEAD'], root)) !== plan.head)
		throw new Error('HEAD changed after planning');
	if (await runCommand('git', ['status', '--porcelain', '--untracked-files=no'], root)) {
		throw new Error('Working tree changed after planning');
	}

	// Reject a stale base before generating changes; later base updates go through normal PR review.
	const remoteHead = await runCommand('git', ['ls-remote', '--exit-code', 'origin', `refs/heads/${plan.branch}`], root);
	if (remoteHead.split(/\s/)[0] !== plan.head)
		throw new Error('Target branch advanced; rerun to generate a fresh plan');
	await runCommand('git', ['switch', '--create', releaseBranch], root);
	for (const pkg of releases) {
		await runCommand('pnpm', ['--filter', pkg.name, 'release'], root);
		const manifest = JSON.parse(await readFile(path.join(root, pkg.folder, 'package.json'), 'utf8')) as {
			version: string;
		};
		if (manifest.version !== pkg.nextVersion) throw new Error(`Version for ${pkg.name} differs from the release plan`);
	}

	await runCommand('pnpm', ['install', '--lockfile-only', '--ignore-scripts', '--no-frozen-lockfile'], root);
	await runCommand(
		'git',
		[
			'add',
			'--',
			'pnpm-lock.yaml',
			...releases.flatMap((pkg) => [`${pkg.folder}/package.json`, `${pkg.folder}/CHANGELOG.md`]),
		],
		root,
	);
	await runCommand(
		'git',
		[
			'-c',
			'user.name=discordjs-release[bot]',
			'-c',
			'user.email=discordjs-release[bot]@users.noreply.github.com',
			'commit',
			'--no-verify',
			'-m',
			`${releaseTitle(plan)}\n\n${releases.map((pkg) => `${pkg.name}@${pkg.nextVersion}`).join('\n')}`,
		],
		root,
	);
	await runCommand('git', ['-c', 'push.followTags=false', 'push', 'origin', `HEAD:refs/heads/${releaseBranch}`], root);
	return { branch: releaseBranch, commit: await runCommand('git', ['rev-parse', 'HEAD'], root) };
}

export async function openReleasePullRequest(
	plan: ReleasePlan,
	prepared: PreparedRelease | null,
	runUrl: string,
	createPullRequest: (parameters: {
		base: string;
		body: string;
		head: string;
		title: string;
	}) => Promise<{ html_url: string; number: number }>,
): Promise<ReleasePullRequest | null> {
	if (!prepared) return null;
	const releases = plan.packages.filter((pkg) => pkg.nextVersion !== null);
	const { html_url: url, number } = await createPullRequest({
		base: plan.branch,
		head: prepared.branch,
		title: releaseTitle(plan),
		body: [
			'Bumps package versions and changelogs for the following releases:',
			'',
			'| Package | Current | New |',
			'| --- | --- | --- |',
			...releases.map((pkg) => `| ${pkg.name} | ${pkg.version} | ${pkg.nextVersion} |`),
			'',
			`Prepared from \`${plan.head}\` on \`${plan.branch}\`.`,
			'',
			`[Workflow run](${runUrl})`,
		].join('\n'),
	});
	return { number, url };
}
