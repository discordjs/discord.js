import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { program } from 'commander';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { generateReleaseTree } from '../src/releasePackages/generateReleaseTree.js';
import { releasePackage } from '../src/releasePackages/releasePackage.js';

vi.mock('@actions/core', () => ({
	getInput: vi.fn(() => ''),
	getBooleanInput: vi.fn(() => false),
	startGroup: vi.fn(),
	endGroup: vi.fn(),
	setFailed: vi.fn(),
	warning: vi.fn(),
	summary: {
		addHeading: vi.fn().mockReturnThis(),
		addRaw: vi.fn().mockReturnThis(),
		write: vi.fn(),
	},
}));
vi.mock('@actions/github', () => ({ context: { ref: 'refs/heads/main', payload: {} } }));
vi.mock('commander', () => ({
	program: {
		name: vi.fn().mockReturnThis(),
		description: vi.fn().mockReturnThis(),
		argument: vi.fn().mockReturnThis(),
		option: vi.fn().mockReturnThis(),
		parse: vi.fn().mockReturnThis(),
		opts: vi.fn(),
		processedArgs: [],
	},
}));
vi.mock('../src/releasePackages/generateReleaseTree.js', () => ({ generateReleaseTree: vi.fn() }));
vi.mock('../src/releasePackages/releasePackage.js', () => ({ releasePackage: vi.fn() }));

const rest = { name: '@discordjs/rest', version: '3.0.0' };
const core = { name: '@discordjs/core', version: '2.0.0' };
const send = vi.fn<typeof fetch>();

beforeEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
	vi.stubGlobal('fetch', send.mockResolvedValue(new Response(null, { status: 204 })));
	vi.stubEnv('RELEASE_WEBHOOK_URL', 'https://worker.example.com/releases');
	vi.stubEnv('RELEASE_WEBHOOK_SECRET', 'test-signing-secret');
	vi.stubEnv('GITHUB_REPOSITORY', 'discordjs/discord.js');
	vi.stubEnv('GITHUB_RUN_ID', '42');
	vi.stubEnv('GITHUB_RUN_ATTEMPT', '2');
	vi.stubEnv('GITHUB_SERVER_URL', 'https://github.com');
	vi.stubEnv('GITHUB_WORKFLOW', 'Release');
	vi.stubEnv('GITHUB_EVENT_NAME', 'workflow_dispatch');
	context.payload = { inputs: { ref: 'v14' } };
	vi.mocked(getInput).mockImplementation((name) => (name === 'request_id' ? 'interaction-123' : ''));
	vi.spyOn(program, 'opts').mockReturnValue({ exclude: [], dry: false, dev: false, tag: '', versions: '' });
	vi.mocked(generateReleaseTree).mockResolvedValue([[rest], [core]]);
	vi.mocked(releasePackage).mockImplementation(async (release) => release.name === rest.name);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});

function payloads() {
	return send.mock.calls.map(([, request]) => JSON.parse(request!.body as string));
}

describe('Publish callbacks', () => {
	test('reports started and completed with published, skipped, and dry-run results', async () => {
		vi.spyOn(program, 'opts').mockReturnValue({ exclude: [], dry: true, dev: false, tag: '', versions: '' });
		await import('../src/releasePackages/index.js');
		expect(payloads().map((payload) => payload.event)).toEqual(['started', 'completed']);
		expect(payloads()[1]).toMatchObject({
			branch: 'v14',
			mode: 'publish',
			requestId: 'interaction-123',
			runUrl: 'https://github.com/discordjs/discord.js/actions/runs/42',
			runAttempt: 2,
			dryRun: true,
			published: [{ identifier: '@discordjs/rest@3.0.0', url: 'https://npmjs.com/package/@discordjs/rest' }],
			skipped: [{ identifier: '@discordjs/core@2.0.0', url: 'https://npmjs.com/package/@discordjs/core' }],
			pullRequest: null,
		});
		expect(setFailed).not.toHaveBeenCalled();
	});

	test('identifies merged release PRs for correlation with preparation', async () => {
		vi.stubEnv('GITHUB_EVENT_NAME', 'pull_request_target');
		context.payload = {
			pull_request: { number: 12, html_url: 'https://github.com/discordjs/discord.js/pull/12', base: { ref: 'v14' } },
		};
		vi.spyOn(program, 'opts').mockReturnValue({
			exclude: [],
			dry: false,
			dev: false,
			tag: '',
			versions: JSON.stringify({ [rest.name]: rest.version }),
		});
		await import('../src/releasePackages/index.js');
		expect(payloads()[1]).toMatchObject({
			event: 'completed',
			branch: 'v14',
			pullRequest: { number: 12, url: 'https://github.com/discordjs/discord.js/pull/12' },
		});
	});

	test('waits for concurrent publishes before reporting failure and stops dependent releases', async () => {
		let finish!: (published: boolean) => void;
		const slow = new Promise<boolean>((resolve) => {
			finish = resolve;
		});
		const sibling = { name: '@discordjs/builders', version: '2.0.0' };
		vi.mocked(generateReleaseTree).mockResolvedValue([[rest, sibling], [core]]);
		vi.mocked(releasePackage).mockImplementation(async (release) => {
			if (release.name === rest.name) throw new Error('Publishing failed with private command output');
			return slow;
		});
		const run = import('../src/releasePackages/index.js');
		await vi.waitFor(() => expect(releasePackage).toHaveBeenCalledTimes(2));
		expect(payloads().map((payload) => payload.event)).toEqual(['started']);
		finish(true);
		await run;
		expect(payloads().map((payload) => payload.event)).toEqual(['started', 'failed']);
		expect(payloads()[1].published).toEqual([
			{ identifier: '@discordjs/builders@2.0.0', url: 'https://npmjs.com/package/@discordjs/builders' },
		]);
		expect(JSON.stringify(payloads())).not.toContain('private command output');
		expect(setFailed).toHaveBeenCalledWith('Publishing failed with private command output');
		expect(releasePackage).toHaveBeenCalledTimes(2);
	});

	test('reports selection failures before publishing starts', async () => {
		vi.stubEnv('GITHUB_EVENT_NAME', 'pull_request_target');
		await import('../src/releasePackages/index.js');
		expect(payloads().map((payload) => payload.event)).toEqual(['started', 'failed']);
		expect(releasePackage).not.toHaveBeenCalled();
	});

	test('publishes normally without callback configuration', async () => {
		vi.stubEnv('RELEASE_WEBHOOK_URL', '');
		vi.stubEnv('RELEASE_WEBHOOK_SECRET', '');
		await import('../src/releasePackages/index.js');
		expect(send).not.toHaveBeenCalled();
		expect(releasePackage).toHaveBeenCalledTimes(2);
		expect(setFailed).not.toHaveBeenCalled();
	});
});
