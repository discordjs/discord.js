import process from 'node:process';
import { setInterval, clearInterval } from 'node:timers';
import { info, warning } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { $ } from 'bun';
import type { ReleaseEntry } from './generateReleaseTree.js';

let octokit: ReturnType<typeof getOctokit> | undefined;

if (process.env.GITHUB_TOKEN) {
	octokit = getOctokit(process.env.GITHUB_TOKEN);
}

async function checkRegistry(release: ReleaseEntry) {
	const res = await fetch(`https://registry.npmjs.org/${release.name}/${release.version}`);
	return res.ok;
}

async function gitTagAndRelease(release: ReleaseEntry, dry: boolean) {
	const tagName = `${release.name === 'discord.js' ? `` : `${release.name}@`}${release.version}`;
	// Don't throw, if this exits non-zero it's probably because the tag already exists
	await $`git tag ${tagName}`.nothrow();
	if (dry) {
		info(`[DRY] Tag "${tagName}" created, skipping push and release creation.`);
		return;
	}

	await $`git push --tags`;
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
		warning(`Failed to create github release: ${error}`);
	}
}

export async function releasePackage(release: ReleaseEntry, dry: boolean) {
	// Sanity check against the registry first
	if (await checkRegistry(release)) {
		info(`${release.name}@${release.version} already published, skipping.`);
		return;
	}

	if (dry) {
		info(`[DRY] Releasing ${release.name}@${release.version}`);
	} else {
		await $`pnpm --filter=${release.name} publish --provenance --no-git-checks`;
	}

	await gitTagAndRelease(release, dry);

	if (dry) return;

	const before = performance.now();

	// Poll registry to ensure next publishes won't fail
	await new Promise<void>((resolve, reject) => {
		const interval = setInterval(async () => {
			if (await checkRegistry(release)) {
				clearInterval(interval);
				resolve();
				return;
			}

			if (performance.now() > before + 5 * 60 * 1_000) {
				clearInterval(interval);
				reject(new Error(`Release for ${release.name} failed.`));
			}
		}, 15_000);
	});
}
