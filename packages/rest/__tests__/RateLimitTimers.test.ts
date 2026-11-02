import { Response } from 'undici';
import { afterEach, beforeEach, expect, test, vitest } from 'vitest';
import { RateLimitError, REST } from '../src/index.js';

beforeEach(() => {
	vitest.useFakeTimers();
});

afterEach(() => {
	vitest.useRealTimers();
});

test('rejecting a global rate limit does not leave a timer running', async () => {
	const makeRequest = vitest.fn();
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, makeRequest }).setToken('A-Very-Fake-Token');
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;

	await expect(api.get('/global', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);

	expect(makeRequest).not.toHaveBeenCalled();
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});

test('rejecting a route rate limit does not leave a timer running', async () => {
	const makeRequest = vitest.fn(
		async () =>
			new Response(null, {
				status: 204,
				headers: {
					'x-ratelimit-limit': '1',
					'x-ratelimit-remaining': '0',
					'x-ratelimit-reset-after': '1',
				},
			}),
	);
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, makeRequest }).setToken('A-Very-Fake-Token');
	await api.get('/local');
	expect(vitest.getTimerCount()).toBe(0);

	await expect(api.get('/local', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);

	expect(makeRequest).toHaveBeenCalledTimes(1);
	expect(vitest.getTimerCount()).toBe(0);
});

test.each([
	['global', 600],
	['route', 600],
	['global', 1_200],
	['route', 1_200],
] as const)(
	'an asynchronous %s policy taking %ims does not extend the rate limit delay',
	async (scope, policyDelay) => {
		const makeRequest = vitest.fn(
			async () =>
				new Response(null, {
					status: 204,
					headers: {
						'x-ratelimit-limit': '1',
						'x-ratelimit-remaining': '0',
						'x-ratelimit-reset-after': '1',
					},
				}),
		);
		const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
			'A-Very-Fake-Token',
		);
		if (scope === 'global') {
			api.globalRemaining = 0;
			api.globalReset = Date.now() + 1_000;
		} else {
			await api.get('/async-policy');
		}
		const initialRequests = makeRequest.mock.calls.length;
		const policy = vitest.fn(async () => {
			await new Promise<void>((resolve) => {
				setTimeout(resolve, policyDelay);
			});
			return false;
		});
		const request = api.get('/async-policy', { rejectOnRateLimit: policy });

		await vitest.advanceTimersByTimeAsync(Math.max(1_000, policyDelay) - 1);
		expect(makeRequest).toHaveBeenCalledTimes(initialRequests);
		await vitest.advanceTimersByTimeAsync(1);
		await request;

		expect(policy).toHaveBeenCalledTimes(1);
		expect(makeRequest).toHaveBeenCalledTimes(initialRequests + 1);
		expect(vitest.getTimerCount()).toBe(0);
	},
);

test('a rejected request preserves the global delay shared by waiting requests', async () => {
	const makeRequest = vitest.fn(async () => new Response(null, { status: 204 }));
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;
	const first = api.get('/first');
	await vitest.advanceTimersByTimeAsync(0);
	const globalDelay = api.globalDelay;
	expect(globalDelay).not.toBeNull();
	expect(vitest.getTimerCount()).toBe(1);

	await expect(api.get('/rejected', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);
	const second = api.get('/second');
	await vitest.advanceTimersByTimeAsync(0);

	expect(api.globalDelay).toBe(globalDelay);
	expect(vitest.getTimerCount()).toBe(1);
	await vitest.advanceTimersByTimeAsync(1_000);
	await Promise.all([first, second]);

	expect(makeRequest).toHaveBeenCalledTimes(2);
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});
