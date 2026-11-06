import { ok as assert } from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { setFailed, setOutput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { preparationSource, validatePreparationRun, type MergedRelease } from '../util/releaseManifest.js';

try {
	const token = process.env.GITHUB_TOKEN;
	assert(token, 'GITHUB_TOKEN is required to read preparation artifacts');
	const octokit = getOctokit(token);
	const { data: pr } = await octokit.rest.pulls.get({ ...context.repo, pull_number: context.issue.number });
	const repository = `${context.repo.owner}/${context.repo.repo}`;
	assert(
		pr.merged && pr.merge_commit_sha && pr.head.repo?.full_name === repository,
		'Only merged preparation PRs from this repository can be published',
	);
	const source = preparationSource(pr.head.ref);
	let preparation;
	for (let attempt = 0; attempt < 24; attempt++) {
		const { data } = await octokit.rest.actions.getWorkflowRunAttempt({
			...context.repo,
			run_id: Number(source.runId),
			attempt_number: source.runAttempt,
		});
		preparation = data;
		if (data.status === 'completed') break;
		await setTimeout(5_000);
	}

	assert(preparation, 'Preparation run was not found');
	validatePreparationRun(preparation, repository, source.runAttempt);
	const name = `release-plan-${source.runAttempt}`;
	const { data } = await octokit.rest.actions.listWorkflowRunArtifacts({
		...context.repo,
		run_id: Number(source.runId),
		name,
	});
	const artifacts = data.artifacts.filter((artifact) => artifact.name === name && !artifact.expired);
	assert(artifacts.length === 1, 'Preparation artifact is unavailable or expired; prepare a new release PR');
	const merged: MergedRelease = {
		repository,
		pullRequestNumber: pr.number,
		baseBranch: pr.base.ref,
		sourceBranch: pr.head.ref,
		sourceCommit: pr.head.sha,
		mergeCommit: pr.merge_commit_sha,
	};
	await writeFile(path.join(process.env.RUNNER_TEMP!, 'merged-release.json'), JSON.stringify(merged));
	setOutput('run-id', source.runId);
	setOutput('artifact-id', artifacts[0]!.id);
} catch (error) {
	setFailed(error instanceof Error ? error.message : String(error));
}
