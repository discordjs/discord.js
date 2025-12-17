import process from 'node:process';
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

	if (dry) {
		info(`[DRY] Release would be "${tagName}", skipping release creation.`);
		return;
	}

	const commitHash = (await $`git rev-parse HEAD`.text()).trim();

	try {
		await octokit?.rest.repos.createRelease({
			...context.repo,
			tag_name: tagName,
			target_commitish: commitHash,
			name: tagName,
			body: release.changelog ?? '',
			generate_release_notes: release.changelog === undefined,
			make_latest: release.name === 'discord.js' ? 'true' : 'false',
		});
	} catch (error) {
		warning(`Failed to create github release: ${error}`);
	}
}

export async function releasePackage(release: ReleaseEntry, dry: boolean, devTag?: string, doGitRelease = !devTag) {
	// Sanity check against the registry first
	if (await checkRegistry(release)) {
		info(`${release.name}@${release.version} already published, skipping.`);
		return false;
	}

	if (dry) {
		info(`[DRY] Releasing ${release.name}@${release.version}`);
	} else {
		await $`pnpm --filter=${release.name} publish --provenance --no-git-checks ${devTag ? `--tag=${devTag}` : ''}`;
	}

	// && !devTag just to be sure
	if (doGitRelease && !devTag) await gitTagAndRelease(release, dry);

	if (dry) return true;

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

	if (devTag) {
		// Send and forget, deprecations are less important than releasing other dev versions and can be done manually
		void $`pnpm exec npm-deprecate --name "*${devTag}*" --message "This version is deprecated. Please use a newer version." --package ${release.name}`
			.nothrow()
			// eslint-disable-next-line promise/prefer-await-to-then
			.then(() => {});
	}

	// Evil, but I can't think of a cleaner mechanism
	if (release.name === 'create-discord-bot') {
		await $`pnpm --filter=create-discord-bot run rename-to-app`;
		// eslint-disable-next-line require-atomic-updates
		release.name = 'create-discord-app';
		await releasePackage(release, dry, devTag, false);
	}

	return true;
}
