import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { setFailed, setOutput, summary } from '@actions/core';
import { validateReleaseManifest, type MergedRelease } from '../util/releaseManifest.js';

try {
	const root = process.env.RUNNER_TEMP!;
	const manifest: unknown = JSON.parse(await readFile(path.join(root, 'release-manifest/release-plan.json'), 'utf8'));
	const merged = JSON.parse(await readFile(path.join(root, 'merged-release.json'), 'utf8')) as MergedRelease;
	const versions = await validateReleaseManifest(manifest, merged, process.cwd());
	setOutput('versions', versions);
	await summary
		.addHeading(`Prepared release PR #${merged.pullRequestNumber}`)
		.addList(Object.entries(versions).map(([name, version]) => `${name}@${version}`))
		.write();
} catch (error) {
	setFailed(error instanceof Error ? error.message : String(error));
}
