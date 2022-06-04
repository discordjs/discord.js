import { performance } from 'node:perf_hooks';
import { MockAgent, setGlobalDispatcher } from 'undici';
import type { Interceptable, MockInterceptor } from 'undici/types/mock-interceptor';
import { beforeEach, afterEach, test, expect, vitest } from 'vitest';
import { genPath } from './util';
import { DiscordAPIError, HTTPError, RateLimitError, REST, RESTEvents } from '../src';

let mockAgent: MockAgent;
let mockPool: Interceptable;

const api = new REST({ timeout: 2000, offset: 5 }).setToken('A-Very-Fake-Token');
const invalidAuthApi = new REST({ timeout: 2000 }).setToken('Definitely-Not-A-Fake-Token');
const rateLimitErrorApi = new REST({ rejectOnRateLimit: ['/channels'] }).setToken('Obviously-Not-A-Fake-Token');

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	setGlobalDispatcher(mockAgent);

	mockPool = mockAgent.get('https://discord.com');
	api.setAgent(mockAgent);
	invalidAuthApi.setAgent(mockAgent);
	rateLimitErrorApi.setAgent(mockAgent);
});

afterEach(async () => {
	await mockAgent.close();
});

// @discordjs/rest uses the `content-type` header to detect whether to parse
// the response as JSON or as an ArrayBuffer.
const responseOptions: MockInterceptor.MockResponseOptions = {
	headers: {
		'content-type': 'application/json',
	},
};

let resetAfter = 0;
let sublimitResetAfter = 0;
let retryAfter = 0;
let sublimitRequests = 0;
let sublimitHits = 0;
let serverOutage = true;
let unexpected429 = true;
let unexpected429cf = true;
const sublimitIntervals: {
	reset: NodeJS.Timer | null;
	retry: NodeJS.Timer | null;
} = {
	reset: null,
	retry: null,
};

const sublimit = { body: { name: 'newname' } };
const noSublimit = { body: { bitrate: 40000 } };

function startSublimitIntervals() {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!sublimitIntervals.reset) {
		sublimitResetAfter = Date.now() + 250;
		sublimitIntervals.reset = setInterval(() => {
			sublimitRequests = 0;
			sublimitResetAfter = Date.now() + 250;
		}, 250);
	}
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!sublimitIntervals.retry) {
		retryAfter = Date.now() + 1000;
		sublimitIntervals.retry = setInterval(() => {
			sublimitHits = 0;
			retryAfter = Date.now() + 1000;
		}, 1000);
	}
}

// This is tested first to ensure the count remains accurate
test('Significant Invalid Requests', async () => {
	mockPool
		.intercept({
			path: genPath('/badRequest'),
			method: 'GET',
		})
		.reply(403, { message: 'Missing Permissions', code: 50013 }, responseOptions)
		.times(10);

	const invalidListener = vitest.fn();
	const invalidListener2 = vitest.fn();
	api.on(RESTEvents.InvalidRequestWarning, invalidListener);
	// Ensure listeners on REST do not get double added
	api.on(RESTEvents.InvalidRequestWarning, invalidListener2);
	api.off(RESTEvents.InvalidRequestWarning, invalidListener2);
	const [a, b, c, d, e] = [
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
	];
	await expect(a).rejects.toThrowError('Missing Permissions');
	await expect(b).rejects.toThrowError('Missing Permissions');
	await expect(c).rejects.toThrowError('Missing Permissions');
	await expect(d).rejects.toThrowError('Missing Permissions');
	await expect(e).rejects.toThrowError('Missing Permissions');
	expect(invalidListener).toHaveBeenCalledTimes(0);
	api.requestManager.options.invalidRequestWarningInterval = 2;
	const [f, g, h, i, j] = [
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
		api.get('/badRequest'),
	];
	await expect(f).rejects.toThrowError('Missing Permissions');
	await expect(g).rejects.toThrowError('Missing Permissions');
	await expect(h).rejects.toThrowError('Missing Permissions');
	await expect(i).rejects.toThrowError('Missing Permissions');
	await expect(j).rejects.toThrowError('Missing Permissions');
	expect(invalidListener).toHaveBeenCalledTimes(3);
	api.off(RESTEvents.InvalidRequestWarning, invalidListener);
});

test('Handle standard rate limits', async () => {
	mockPool
		.intercept({
			path: genPath('/standard'),
			method: 'GET',
		})
		.reply(() => {
			const response = Date.now() >= resetAfter ? 204 : 429;
			resetAfter = Date.now() + 250;

			if (response === 204) {
				return {
					statusCode: 204,
					data: '',
					responseOptions: {
						headers: {
							'x-ratelimit-limit': '1',
							'x-ratelimit-remaining': '0',
							'x-ratelimit-reset-after': ((resetAfter - Date.now()) / 1000).toString(),
							'x-ratelimit-bucket': '80c17d2f203122d936070c88c8d10f33',
							via: '1.1 google',
						},
					},
				};
			}

			return {
				statusCode: 429,
				data: {
					limit: '1',
					remaining: '0',
					resetAfter: (resetAfter / 1000).toString(),
					bucket: '80c17d2f203122d936070c88c8d10f33',
					retryAfter: (resetAfter - Date.now()).toString(),
				},
				responseOptions: {
					headers: {
						'x-ratelimit-limit': '1',
						'x-ratelimit-remaining': '0',
						'x-ratelimit-reset-after': ((resetAfter - Date.now()) / 1000).toString(),
						'x-ratelimit-bucket': '80c17d2f203122d936070c88c8d10f33',
						'retry-after': (resetAfter - Date.now()).toString(),
						via: '1.1 google',
					},
				},
			};
		})
		.times(3);

	const [a, b, c] = [api.get('/standard'), api.get('/standard'), api.get('/standard')];
	const uint8 = new Uint8Array();

	expect(new Uint8Array((await a) as ArrayBuffer)).toStrictEqual(uint8);
	const previous1 = performance.now();
	expect(new Uint8Array((await b) as ArrayBuffer)).toStrictEqual(uint8);
	const previous2 = performance.now();
	expect(new Uint8Array((await c) as ArrayBuffer)).toStrictEqual(uint8);
	const now = performance.now();
	expect(previous2).toBeGreaterThanOrEqual(previous1 + 200);
	expect(now).toBeGreaterThanOrEqual(previous2 + 200);
});

test('Handle sublimits', async () => {
	mockPool
		.intercept({
			path: genPath('/channels/:id'),
			method: 'PATCH',
		})
		.reply((t) => {
			const body = JSON.parse(t.body as string) as Record<string, unknown>;

			if ('name' in body || 'topic' in body) {
				sublimitHits += 1;
				sublimitRequests += 1;
				const response = 2 - sublimitHits >= 0 && 10 - sublimitRequests >= 0 ? 200 : 429;
				startSublimitIntervals();

				if (response === 200) {
					return {
						statusCode: 200,
						data: '',
						responseOptions: {
							headers: {
								'x-ratelimit-limit': '10',
								'x-ratelimit-remaining': `${10 - sublimitRequests}`,
								'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
								via: '1.1 google',
							},
						},
					};
				}

				return {
					statusCode: 429,
					data: {
						limit: '10',
						remaining: `${10 - sublimitRequests}`,
						resetAfter: (sublimitResetAfter / 1000).toString(),
						retryAfter: ((retryAfter - Date.now()) / 1000).toString(),
					},
					responseOptions: {
						headers: {
							'x-ratelimit-limit': '10',
							'x-ratelimit-remaining': `${10 - sublimitRequests}`,
							'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
							'retry-after': ((retryAfter - Date.now()) / 1000).toString(),
							via: '1.1 google',
							...responseOptions.headers,
						},
					},
				};
			} else if (!('name' in body) && !('topic' in body)) {
				sublimitRequests += 1;
				const response = 10 - sublimitRequests >= 0 ? 200 : 429;
				startSublimitIntervals();

				if (response === 200) {
					return {
						statusCode: 200,
						data: '',
						responseOptions: {
							headers: {
								'x-ratelimit-limit': '10',
								'x-ratelimit-remaining': `${10 - sublimitRequests}`,
								'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
								via: '1.1 google',
							},
						},
					};
				}

				return {
					statusCode: 429,
					data: {
						limit: '10',
						remaining: `${10 - sublimitRequests}`,
						resetAfter: (sublimitResetAfter / 1000).toString(),
						retryAfter: ((sublimitResetAfter - Date.now()) / 1000).toString(),
					},
					responseOptions: {
						headers: {
							'x-ratelimit-limit': '10',
							'x-ratelimit-remaining': `${10 - sublimitRequests}`,
							'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
							'retry-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
							via: '1.1 google',
							...responseOptions.headers,
						},
					},
				};
			}

			return {
				statusCode: 420,
				data: 'Oh no',
			};
		})
		.persist();

	// Return the current time on these results as their response does not indicate anything
	// Queue all requests, don't wait, to allow retroactive check
	const [aP, bP, cP, dP, eP] = [
		api.patch('/channels/:id', sublimit).then(() => Date.now()),
		api.patch('/channels/:id', sublimit).then(() => Date.now()),
		api.patch('/channels/:id', sublimit).then(() => Date.now()), // Limit hits
		api.patch('/channels/:id', noSublimit).then(() => Date.now()), // Ensure normal request passes
		api.patch('/channels/:id', sublimit).then(() => Date.now()), // For retroactive check
	];

	const [a, b, c, d] = await Promise.all([aP, bP, cP, dP]);

	const [f, g] = await Promise.all([
		api.patch('/channels/:id', sublimit).then(() => Date.now()),
		api.patch('/channels/:id', noSublimit).then(() => Date.now()),
	]); // For additional sublimited checks
	const e = await eP;

	expect(a).toBeLessThanOrEqual(b);
	expect(b).toBeLessThanOrEqual(c);
	expect(d).toBeLessThanOrEqual(c);
	expect(c).toBeLessThanOrEqual(e);
	expect(d).toBeLessThanOrEqual(e);
	expect(e).toBeLessThanOrEqual(f);
	expect(e).toBeLessThanOrEqual(g);
	expect(g).toBeLessThanOrEqual(f);

	clearInterval(sublimitIntervals.reset!);
	clearInterval(sublimitIntervals.retry!);

	// Reject on RateLimit
	const [aP2, bP2, cP2] = [
		rateLimitErrorApi.patch('/channels/:id', sublimit),
		rateLimitErrorApi.patch('/channels/:id', sublimit),
		rateLimitErrorApi.patch('/channels/:id', sublimit),
	];
	await expect(aP2).resolves;
	await expect(bP2).rejects.toThrowError();
	await expect(bP2).rejects.toBeInstanceOf(RateLimitError);
	await expect(cP2).rejects.toThrowError();
	await expect(cP2).rejects.toBeInstanceOf(RateLimitError);
});

test('Handle unexpected 429', async () => {
	mockPool
		.intercept({
			path: genPath('/unexpected'),
			method: 'GET',
		})
		.reply(() => {
			if (unexpected429) {
				unexpected429 = false;
				return {
					statusCode: 429,
					data: '',
					responseOptions: {
						headers: {
							'retry-after': '1',
							via: '1.1 google',
						},
					},
				};
			}

			return {
				statusCode: 200,
				data: { test: true },
				responseOptions,
			};
		})
		.times(3);

	const previous = performance.now();
	let firstResolvedTime: number;
	let secondResolvedTime: number;
	const unexepectedSublimit = api.get('/unexpected').then((res) => {
		firstResolvedTime = performance.now();
		return res;
	});
	const queuedSublimit = api.get('/unexpected').then((res) => {
		secondResolvedTime = performance.now();
		return res;
	});

	expect(await unexepectedSublimit).toStrictEqual({ test: true });
	expect(await queuedSublimit).toStrictEqual({ test: true });
	expect(performance.now()).toBeGreaterThanOrEqual(previous + 1000);
	// @ts-expect-error
	expect(secondResolvedTime).toBeGreaterThan(firstResolvedTime);
});

test('Handle unexpected 429 cloudflare', async () => {
	mockPool
		.intercept({
			path: genPath('/unexpected-cf'),
			method: 'GET',
		})
		.reply(() => {
			if (unexpected429cf) {
				unexpected429cf = false;

				return {
					statusCode: 429,
					data: '',
					responseOptions: {
						headers: {
							'retry-after': '1',
						},
					},
				};
			}

			return {
				statusCode: 200,
				data: { test: true },
				responseOptions,
			};
		})
		.times(2); // twice because it re-runs the request after first 429

	const previous = Date.now();
	expect(await api.get('/unexpected-cf')).toStrictEqual({ test: true });
	expect(Date.now()).toBeGreaterThanOrEqual(previous + 1000);
});

test('Handle global rate limits', async () => {
	mockPool
		.intercept({
			path: genPath('/triggerGlobal'),
			method: 'GET',
		})
		.reply(() => ({
			data: { global: true },
			statusCode: 200,
			responseOptions,
		}));

	mockPool
		.intercept({
			path: genPath('/regularRequest'),
			method: 'GET',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.get('/triggerGlobal')).toStrictEqual({ global: true });
	expect(await api.get('/regularRequest')).toStrictEqual({ test: true });
});

test('Handle temp server outage', async () => {
	mockPool
		.intercept({
			path: genPath('/temp'),
			method: 'GET',
		})
		.reply(() => {
			if (serverOutage) {
				serverOutage = false;

				return {
					statusCode: 500,
					data: '',
				};
			}

			return {
				statusCode: 200,
				data: { test: true },
				responseOptions,
			};
		})
		.times(2);

	expect(await api.get('/temp')).toStrictEqual({ test: true });
});

test('perm server outage', async () => {
	mockPool
		.intercept({
			path: genPath('/outage'),
			method: 'GET',
		})
		.reply(500, '', responseOptions)
		.times(4);

	const promise = api.get('/outage');
	await expect(promise).rejects.toThrowError();
	await expect(promise).rejects.toBeInstanceOf(HTTPError);
});

test('server responding too slow', async () => {
	const api2 = new REST({ timeout: 1 }).setToken('A-Very-Really-Real-Token');

	mockPool
		.intercept({
			path: genPath('/slow'),
			method: 'GET',
		})
		.reply(200, '')
		.delay(100)
		.times(10);

	const promise = api2.get('/slow');

	await expect(promise).rejects.toThrowError('Request aborted');
}, 1000);

test('Unauthorized', async () => {
	mockPool
		.intercept({
			path: genPath('/unauthorized'),
			method: 'GET',
		})
		.reply(401, { message: '401: Unauthorized', code: 0 }, responseOptions)
		.times(2);

	const setTokenSpy = vitest.spyOn(invalidAuthApi.requestManager, 'setToken');

	// Ensure authless requests don't reset the token
	const promiseWithoutTokenClear = invalidAuthApi.get('/unauthorized', { auth: false });
	await expect(promiseWithoutTokenClear).rejects.toThrowError('401: Unauthorized');
	await expect(promiseWithoutTokenClear).rejects.toBeInstanceOf(DiscordAPIError);
	expect(setTokenSpy).not.toHaveBeenCalled();

	// Ensure authed requests do reset the token
	const promise = invalidAuthApi.get('/unauthorized');
	await expect(promise).rejects.toThrowError('401: Unauthorized');
	await expect(promise).rejects.toBeInstanceOf(DiscordAPIError);
	expect(setTokenSpy).toHaveBeenCalledTimes(1);
});

test('Bad Request', async () => {
	mockPool
		.intercept({
			path: genPath('/badRequest'),
			method: 'GET',
		})
		.reply(403, { message: 'Missing Permissions', code: 50013 }, responseOptions);

	const promise = api.get('/badRequest');
	await expect(promise).rejects.toThrowError('Missing Permissions');
	await expect(promise).rejects.toBeInstanceOf(DiscordAPIError);
});

test('malformedRequest', async () => {
	// This test doesn't really make sense because
	// there is no such thing as a 601 status code.
	// So, what exactly is a malformed request?
	mockPool
		.intercept({
			path: genPath('/malformedRequest'),
			method: 'GET',
		})
		.reply(() => ({
			statusCode: 405,
			data: '',
		}));

	await expect(api.get('/malformedRequest')).rejects.toBeInstanceOf(DiscordAPIError);
});
