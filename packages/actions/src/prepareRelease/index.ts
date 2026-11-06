import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getInput, info, setFailed, setOutput, summary } from '@actions/core';
import { getOctokit } from '@actions/github';
import { createReleaseNotifier, type NotifyRelease } from '../util/releaseNotifications.js';
import type { ReleaseManifest, ReleasePlan } from '../util/releasePlan.js';
import {
	applyReleasePlan,
	createReleasePlan,
	openReleasePullRequest,
	type ReleasePullRequest,
} from './prepareRelease.js';

interface PrepareNotificationDetails {
	commit?: string;
	plan?: ReleasePlan;
	pullRequest?: ReleasePullRequest | null;
	releaseBranch?: string;
}

let notify: NotifyRelease<PrepareNotificationDetails> = async () => {};

try {
	const branch = getInput('branch', { required: true });
	const mode = getInput('mode');
	const repository = process.env.GITHUB_REPOSITORY!;
	const runId = process.env.GITHUB_RUN_ID!;
	const runAttempt = Number(process.env.GITHUB_RUN_ATTEMPT ?? '1');
	const runUrl = `${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${runId}`;
	notify = createReleaseNotifier<PrepareNotificationDetails>(
		{
			branch,
			mode,
			repository,
			requestId: getInput('request_id') || null,
			runAttempt,
			runId,
			runUrl,
			workflow: process.env.GITHUB_WORKFLOW!,
		},
		{ url: process.env.RELEASE_WEBHOOK_URL ?? '', secret: process.env.RELEASE_WEBHOOK_SECRET ?? '' },
	);
	await notify('started');
	const plan = await createReleasePlan(process.cwd(), branch, mode, getInput('packages'));
	const planFile = path.join(process.env.RUNNER_TEMP!, 'release-plan.json');
	await writeFile(planFile, `${JSON.stringify(plan, null, 2)}\n`);
	setOutput('plan-file', planFile);
	summary.addHeading('Release plan');
	summary.addRaw(`Branch: \`${plan.branch}\`; commit: \`${plan.head}\`\n\n`);
	summary.addTable([
		['Package', 'Last release tag', 'Current version', 'Proposed version'],
		...plan.packages.map((pkg) => [
			pkg.name,
			pkg.previousTag ?? 'No release tag',
			pkg.version,
			pkg.nextVersion ?? 'Unchanged',
		]),
	]);
	await summary.write();
	await notify('planned', { plan });
	const prepared = await applyReleasePlan(process.cwd(), plan, `prepare-release-${runId}-${runAttempt}`);
	const [owner, repo] = repository.split('/') as [string, string];
	const pullRequest = await openReleasePullRequest(plan, prepared, runUrl, async (parameters) => {
		const token = process.env.GITHUB_TOKEN;
		if (!token) throw new Error('GITHUB_TOKEN is required to open the release pull request');
		const { data } = await getOctokit(token).rest.pulls.create({ owner, repo, ...parameters });
		return data;
	});
	if (prepared && pullRequest) {
		const manifest: ReleaseManifest = {
			schemaVersion: 1,
			repository,
			runId,
			runAttempt,
			pullRequestNumber: pullRequest.number,
			releaseBranch: prepared.branch,
			releaseCommit: prepared.commit,
			plan,
		};
		await writeFile(planFile, `${JSON.stringify(manifest, null, 2)}\n`);
		info(`Release pull request: ${pullRequest.url}`);
		await summary.addLink(`Release PR #${pullRequest.number}`, pullRequest.url).write();
		await notify('completed', { plan, commit: prepared.commit, releaseBranch: prepared.branch, pullRequest });
	} else {
		info('No package changes detected; no release branch or pull request was created.');
		await summary.addRaw('\nNo package changes detected.\n').write();
		await notify('completed', { plan, commit: plan.head, pullRequest: null });
	}
} catch (error) {
	setFailed(error instanceof Error ? error.message : String(error));
	await notify('failed');
}
