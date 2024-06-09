import { exec } from 'node:child_process';
import process from 'node:process';
import { setInterval, clearInterval } from 'node:timers';
import { getOctokit, context } from '@actions/github';
import type { ReleaseEntry } from './generateReleaseTree.js';

let octokit: ReturnType<typeof getOctokit> | undefined;

if (process.env.GITHUB_TOKEN) {
	octokit = getOctokit(process.env.GITHUB_TOKEN);
}

async function checkRegistry(release: ReleaseEntry) {
	const res = await fetch(`https://registry.npmjs.org/${release.name}/${release.version}`);
	return res.ok;
}

async function execPromise(execString: string) {
	const child = exec(execString);
	child.stdout?.pipe(process.stdout);
	child.stderr?.pipe(process.stderr);
	// Wait for exec to finish before polling the registry
	return new Promise<void>((resolve) => {
		child.once('close', () => resolve());
	});
}

async function gitTagAndRelease(release: ReleaseEntry) {
	const tagName = `${release.name === 'discord.js' ? `` : `${release.name}@`}${release.version}`;
	await execPromise(`git tag ${tagName}`);
	await execPromise('git push --tags');
	try {
		await octokit?.rest.repos.createRelease({
			...context.repo,
			tag_name: tagName,
			name: tagName,
			draft: true,
			body: release.changelog ?? '',
			generate_release_notes: !release.changelog,
		});
	} catch (error) {
		console.error('Failed to create github release', error);
	}
}

export async function releasePackage(release: ReleaseEntry) {
	// Sanity check against the registry first
	if (await checkRegistry(release)) {
		console.log(`${release.name}@${release.version} already published, skipping.`);
		return;
	}

	await execPromise(`pnpm --filter=${release.name} publish --provenance --no-git-checks`);
	await gitTagAndRelease(release);

	const before = performance.now();

	// Poll registry to ensure next publishes won't fail
	await new Promise<void>((resolve) => {
		const interval = setInterval(async () => {
			if (await checkRegistry(release)) {
				clearInterval(interval);
				resolve();
			}

			if (performance.now() > before + 5 * 60 * 1_000) {
				clearInterval(interval);
				throw new Error(`Release for ${release.name} failed.`);
			}
		}, 15_000);
	});
}
