import { Response } from 'undici';
import { afterEach, beforeEach, expect, test, vitest } from 'vitest';
import { RateLimitError, REST } from '../src/index.js';

beforeEach(() => {
	vitest.useFakeTimers();
});

afterEach(() => {
	vitest.restoreAllMocks();
	vitest.useRealTimers();
});

test('rejecting a global rate limit cancels its unused shared timer', async () => {
	const makeRequest = vitest.fn();
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;

	await expect(
		api.get('/global', {
			rejectOnRateLimit: () => {
				expect(api.globalDelay).not.toBeNull();
				expect(vitest.getTimerCount()).toBe(1);
				return true;
			},
		}),
	).rejects.toBeInstanceOf(RateLimitError);

	expect(makeRequest).not.toHaveBeenCalled();
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});

test('rejecting a route rate limit does not create a timer', async () => {
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

test('a rejected request does not prevent subsequent requests from sharing the global delay', async () => {
	const makeRequest = vitest.fn(async () => new Response(null, { status: 204 }));
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;

	await expect(api.get('/rejected', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);

	const first = api.get('/first');
	const second = api.get('/second');
	await vitest.advanceTimersByTimeAsync(0);
	const globalDelay = api.globalDelay;
	expect(globalDelay).not.toBeNull();
	await vitest.advanceTimersByTimeAsync(999);

	expect(makeRequest).not.toHaveBeenCalled();
	expect(api.globalDelay).toBe(globalDelay);
	expect(vitest.getTimerCount()).toBe(1);
	await vitest.advanceTimersByTimeAsync(1);
	await Promise.all([first, second]);

	expect(makeRequest).toHaveBeenCalledTimes(2);
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});

test.each(['global', 'route'] as const)('waiting for a %s rate limit keeps its timer referenced', async (scope) => {
	const setTimeout = vitest.spyOn(globalThis, 'setTimeout');
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
		await api.get('/waiting');
	}
	const initialRequests = makeRequest.mock.calls.length;
	setTimeout.mockClear();
	const request = api.get('/waiting');
	await vitest.advanceTimersByTimeAsync(0);

	expect(makeRequest).toHaveBeenCalledTimes(initialRequests);
	expect(vitest.getTimerCount()).toBe(1);
	expect(setTimeout.mock.results[0]?.value.hasRef()).toBe(true);
	await vitest.advanceTimersByTimeAsync(1_000);
	await request;
	expect(makeRequest).toHaveBeenCalledTimes(initialRequests + 1);
	expect(vitest.getTimerCount()).toBe(0);
});

test.each([true, false])(
	'an asynchronous rejection preserves another policy that rejects: %s',
	async (rejectSecond) => {
		const makeRequest = vitest.fn(async () => new Response(null, { status: 204 }));
		const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
			'A-Very-Fake-Token',
		);
		api.globalRemaining = 0;
		api.globalReset = Date.now() + 1_000;
		const firstPolicy = Promise.withResolvers<boolean>();
		const secondPolicy = Promise.withResolvers<boolean>();
		const first = expect(api.get('/first', { rejectOnRateLimit: () => firstPolicy.promise })).rejects.toBeInstanceOf(
			RateLimitError,
		);
		const secondRequest = api.get('/second', { rejectOnRateLimit: () => secondPolicy.promise });
		const second = rejectSecond ? expect(secondRequest).rejects.toBeInstanceOf(RateLimitError) : secondRequest;
		await vitest.advanceTimersByTimeAsync(0);
		const globalDelay = api.globalDelay;

		firstPolicy.resolve(true);
		await first;
		expect(api.globalDelay).toBe(globalDelay);
		expect(vitest.getTimerCount()).toBe(1);
		expect(makeRequest).not.toHaveBeenCalled();
		secondPolicy.resolve(rejectSecond);
		if (!rejectSecond) await vitest.advanceTimersByTimeAsync(1_000);
		await second;
		expect(makeRequest).toHaveBeenCalledTimes(rejectSecond ? 0 : 1);
		expect(api.globalDelay).toBeNull();
		expect(vitest.getTimerCount()).toBe(0);
	},
);

test('a rejection after an expired global delay does not cancel a newer delay', async () => {
	const makeRequest = vitest.fn(async () => new Response(null, { status: 204 }));
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;
	const policy = Promise.withResolvers<boolean>();
	const rejected = expect(api.get('/rejected', { rejectOnRateLimit: () => policy.promise })).rejects.toBeInstanceOf(
		RateLimitError,
	);
	await vitest.advanceTimersByTimeAsync(1_000);
	api.globalReset = Date.now() + 1_000;
	const request = api.get('/waiting');
	await vitest.advanceTimersByTimeAsync(0);
	const globalDelay = api.globalDelay;

	policy.resolve(true);
	await rejected;
	expect(api.globalDelay).toBe(globalDelay);
	expect(vitest.getTimerCount()).toBe(1);
	expect(makeRequest).not.toHaveBeenCalled();
	await vitest.advanceTimersByTimeAsync(1_000);
	await request;
	expect(makeRequest).toHaveBeenCalledOnce();
	expect(api.globalDelay).toBeNull();
});

test('a failing global rate-limit policy cancels its unused timer', async () => {
	const makeRequest = vitest.fn();
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;
	const error = new Error('Policy failed');
	await expect(
		api.get('/failed-policy', {
			rejectOnRateLimit: async () => {
				throw error;
			},
		}),
	).rejects.toBe(error);

	expect(makeRequest).not.toHaveBeenCalled();
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});

test('canceling a global delay supports numeric timer handles', async () => {
	const setTimeout = globalThis.setTimeout;
	vitest
		.spyOn(globalThis, 'setTimeout')
		.mockImplementation(
			(callback, delay) => Number(setTimeout(callback, delay)) as unknown as ReturnType<typeof setTimeout>,
		);
	const makeRequest = vitest.fn();
	const api = new REST({ hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest }).setToken(
		'A-Very-Fake-Token',
	);
	api.globalRemaining = 0;
	api.globalReset = Date.now() + 1_000;

	await expect(api.get('/rejected', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);

	expect(makeRequest).not.toHaveBeenCalled();
	expect(api.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});

test('canceling a global delay does not affect another REST instance', async () => {
	const makeRequest = vitest.fn(async () => new Response(null, { status: 204 }));
	const options = { hashSweepInterval: 0, handlerSweepInterval: 0, offset: 0, makeRequest };
	const waitingAPI = new REST(options).setToken('A-Very-Fake-Token');
	const rejectingAPI = new REST(options).setToken('Another-Very-Fake-Token');
	for (const api of [waitingAPI, rejectingAPI]) {
		api.globalRemaining = 0;
		api.globalReset = Date.now() + 1_000;
	}
	const request = waitingAPI.get('/waiting');
	await vitest.advanceTimersByTimeAsync(0);
	const globalDelay = waitingAPI.globalDelay;

	await expect(rejectingAPI.get('/rejected', { rejectOnRateLimit: true })).rejects.toBeInstanceOf(RateLimitError);

	expect(waitingAPI.globalDelay).toBe(globalDelay);
	expect(rejectingAPI.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(1);
	expect(makeRequest).not.toHaveBeenCalled();
	await vitest.advanceTimersByTimeAsync(1_000);
	await request;
	expect(makeRequest).toHaveBeenCalledOnce();
	expect(waitingAPI.globalDelay).toBeNull();
	expect(vitest.getTimerCount()).toBe(0);
});
