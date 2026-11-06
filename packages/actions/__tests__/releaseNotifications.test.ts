import { Buffer } from 'node:buffer';
import { webcrypto } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { warning } from '@actions/core';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createReleaseNotifier, type NotificationContext } from '../src/util/releaseNotifications.js';
import type { ReleasePlan } from '../src/util/releasePlan.js';

const context: NotificationContext = {
	branch: 'main',
	mode: 'auto',
	repository: 'discordjs/discord.js',
	requestId: 'interaction-123',
	runAttempt: 2,
	runId: '42',
	runUrl: 'https://github.com/discordjs/discord.js/actions/runs/42',
	workflow: 'Prepare Release',
};

const plan: ReleasePlan = { branch: 'main', head: 'abc123', mode: 'auto', packages: [] };
const config = { url: 'https://worker.example.com/github/releases', secret: 'test-signing-secret' };

vi.mock('node:timers/promises', () => ({ setTimeout: vi.fn(async () => {}) }));
vi.mock('@actions/core', () => ({ warning: vi.fn() }));

afterEach(() => vi.unstubAllGlobals());

function mockDelivery() {
	const send = vi.fn<typeof fetch>().mockImplementation(async () => new Response(null, { status: 204 }));
	vi.stubGlobal('fetch', send);
	return {
		fetch: send,
		wait: vi.mocked(setTimeout).mockClear(),
		warn: vi.mocked(warning).mockClear(),
	};
}

describe('Release callbacks', () => {
	test('supports publishing details without depending on the preparation plan', async () => {
		const deps = mockDelivery();
		const notify = createReleaseNotifier<{ published: string[]; skipped: string[] }>(
			{ ...context, mode: 'publish', workflow: 'Release' },
			config,
		);
		await notify('completed', { published: ['@discordjs/rest@3.0.0'], skipped: [] });
		const payload = JSON.parse(deps.fetch.mock.calls[0]![1]!.body as string);
		expect(payload).toMatchObject({
			event: 'completed',
			mode: 'publish',
			workflow: 'Release',
			published: ['@discordjs/rest@3.0.0'],
			skipped: [],
		});
		expect(payload).not.toHaveProperty('plan');
	});

	test('sends the release plan with an HMAC signature verifiable by Web Crypto in a Worker', async () => {
		const deps = mockDelivery();
		const notify = createReleaseNotifier(context, config);
		await notify('planned', { plan });
		const [url, request] = deps.fetch.mock.calls[0]!;
		expect(url).toBe(config.url);
		expect(request).toMatchObject({ method: 'POST', redirect: 'error' });
		expect(request!.signal).toBeInstanceOf(AbortSignal);
		const body = request!.body as string;
		const headers = new Headers(request!.headers);
		const payload = JSON.parse(body);
		expect(payload).toMatchObject({ ...context, schemaVersion: 1, event: 'planned', sequence: 1, plan });
		expect(headers.get('X-Release-Delivery')).toBe(payload.id);
		expect(headers.get('X-Release-Timestamp')).toBe(payload.timestamp);
		const key = await webcrypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(config.secret),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['verify'],
		);
		const signature = Uint8Array.from(
			Buffer.from(headers.get('X-Release-Signature-256')!.slice('sha256='.length), 'hex'),
		);
		expect(
			await webcrypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(`${payload.timestamp}.${body}`)),
		).toBe(true);
		expect(
			await webcrypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(`${payload.timestamp}.${body} `)),
		).toBe(false);
	});

	test('retries transient failures using the same delivery ID, timestamp, signature, and body', async () => {
		const deps = mockDelivery();
		deps.fetch.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(new Response(null, { status: 503 }));
		await createReleaseNotifier(context, config)('completed', { plan, commit: 'def456' });
		expect(deps.fetch).toHaveBeenCalledTimes(3);
		const requests = deps.fetch.mock.calls.map(([, request]) => request);
		expect(requests[1]!.body).toBe(requests[0]!.body);
		expect(requests[2]!.headers).toEqual(requests[0]!.headers);
		expect(deps.wait.mock.calls).toEqual([[500], [1_000]]);
		expect(deps.warn).not.toHaveBeenCalled();
	});

	test('retries rate limits, but does not retry permanent rejection or log credentials', async () => {
		const deps = mockDelivery();
		deps.fetch
			.mockResolvedValueOnce(new Response(null, { status: 429 }))
			.mockResolvedValueOnce(new Response(null, { status: 401 }));
		await expect(createReleaseNotifier(context, config)('failed')).resolves.toBeUndefined();
		expect(deps.fetch).toHaveBeenCalledTimes(2);
		expect(deps.warn).toHaveBeenCalledOnce();
		expect(JSON.stringify(deps.warn.mock.calls)).not.toContain(config.url);
		expect(JSON.stringify(deps.warn.mock.calls)).not.toContain(config.secret);
	});

	test('reports exhausted delivery attempts without failing preparation or leaking network errors', async () => {
		const deps = mockDelivery();
		deps.fetch.mockRejectedValue(new Error(`request failed for ${config.url}?secret=${config.secret}`));
		await expect(createReleaseNotifier(context, config)('started')).resolves.toBeUndefined();
		expect(deps.fetch).toHaveBeenCalledTimes(3);
		expect(deps.warn).toHaveBeenCalledOnce();
		expect(JSON.stringify(deps.warn.mock.calls)).not.toContain(config.secret);
	});

	test('is disabled without configuration and rejects partial or insecure configuration', async () => {
		for (const invalidConfig of [
			{ url: '', secret: '' },
			{ url: config.url, secret: '' },
			{ url: '', secret: config.secret },
			{ url: 'not-a-url', secret: config.secret },
			{ url: 'http://worker.example.com', secret: config.secret },
			{ url: 'https://user:password@worker.example.com', secret: config.secret },
		]) {
			const deps = mockDelivery();
			await createReleaseNotifier(context, invalidConfig)('started');
			expect(deps.fetch).not.toHaveBeenCalled();
			expect(deps.warn).toHaveBeenCalledTimes(invalidConfig.url || invalidConfig.secret ? 1 : 0);
		}
	});

	test('increments sequence numbers and uses distinct delivery IDs for progress and terminal events', async () => {
		const deps = mockDelivery();
		const notify = createReleaseNotifier(context, config);
		await notify('started');
		await notify('planned', { plan });
		await notify('completed', {
			plan,
			commit: 'def456',
			releaseBranch: 'prepare-release-42-2',
			pullRequest: { number: 1, url: 'https://github.com/example/repo/pull/1' },
		});
		const payloads = deps.fetch.mock.calls.map(([, request]) => JSON.parse(request!.body as string));
		expect(payloads.map((payload) => payload.sequence)).toEqual([1, 2, 3]);
		expect(new Set(payloads.map((payload) => payload.id)).size).toBe(3);
		expect(payloads[2]).toMatchObject({ event: 'completed', commit: 'def456', plan });
		expect(payloads[2]).not.toHaveProperty('dryRun');
		expect(payloads[2]).toHaveProperty('pullRequest.url', 'https://github.com/example/repo/pull/1');
	});
});
