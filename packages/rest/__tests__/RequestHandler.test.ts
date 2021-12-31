import nock from 'nock';
import { DefaultRestOptions, DiscordAPIError, HTTPError, RateLimitError, REST, RESTEvents } from '../src';

const api = new REST({ timeout: 2000, offset: 5 }).setToken('A-Very-Fake-Token');
const invalidAuthApi = new REST({ timeout: 2000 }).setToken('Definitely-Not-A-Fake-Token');
const rateLimitErrorApi = new REST({ rejectOnRateLimit: ['/channels'] }).setToken('Obviously-Not-A-Fake-Token');

let resetAfter = 0;
let sublimitResetAfter = 0;
let retryAfter = 0;
let sublimitRequests = 0;
let sublimitHits = 0;
let serverOutage = true;
let unexpected429 = true;
let unexpected429cf = true;
const sublimitIntervals = {
	reset: null,
	retry: null,
};

const sublimit = { body: { name: 'newname' } };
const noSublimit = { body: { bitrate: 40000 } };

nock(`${DefaultRestOptions.api}/v${DefaultRestOptions.version}`)
	.persist()
	.replyDate()
	.get('/standard')
	.times(3)
	.reply(function handler(): nock.ReplyFnResult {
		const response = Date.now() >= resetAfter ? 204 : 429;
		resetAfter = Date.now() + 250;
		if (response === 204) {
			return [
				204,
				undefined,
				{
					'x-ratelimit-limit': '1',
					'x-ratelimit-remaining': '0',
					'x-ratelimit-reset-after': ((resetAfter - Date.now()) / 1000).toString(),
					'x-ratelimit-bucket': '80c17d2f203122d936070c88c8d10f33',
					via: '1.1 google',
				},
			];
		}
		return [
			429,
			{
				limit: '1',
				remaining: '0',
				resetAfter: (resetAfter / 1000).toString(),
				bucket: '80c17d2f203122d936070c88c8d10f33',
				retryAfter: (resetAfter - Date.now()).toString(),
			},
			{
				'x-ratelimit-limit': '1',
				'x-ratelimit-remaining': '0',
				'x-ratelimit-reset-after': ((resetAfter - Date.now()) / 1000).toString(),
				'x-ratelimit-bucket': '80c17d2f203122d936070c88c8d10f33',
				'retry-after': (resetAfter - Date.now()).toString(),
				via: '1.1 google',
			},
		];
	})
	.get('/triggerGlobal')
	.reply(function handler(): nock.ReplyFnResult {
		return [
			204,
			{ global: true },
			{
				'x-ratelimit-global': 'true',
				'retry-after': '1',
				via: '1.1 google',
			},
		];
	})
	.get('/regularRequest')
	.reply(204, { test: true })
	.patch('/channels/:id', (body) => ['name', 'topic'].some((key) => Reflect.has(body as Record<string, unknown>, key)))
	.reply(function handler(): nock.ReplyFnResult {
		sublimitHits += 1;
		sublimitRequests += 1;
		const response = 2 - sublimitHits >= 0 && 10 - sublimitRequests >= 0 ? 204 : 429;
		startSublimitIntervals();
		if (response === 204) {
			return [
				204,
				undefined,
				{
					'x-ratelimit-limit': '10',
					'x-ratelimit-remaining': `${10 - sublimitRequests}`,
					'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
					via: '1.1 google',
				},
			];
		}
		return [
			429,
			{
				limit: '10',
				remaining: `${10 - sublimitRequests}`,
				resetAfter: (sublimitResetAfter / 1000).toString(),
				retryAfter: ((retryAfter - Date.now()) / 1000).toString(),
			},
			{
				'x-ratelimit-limit': '10',
				'x-ratelimit-remaining': `${10 - sublimitRequests}`,
				'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
				'retry-after': ((retryAfter - Date.now()) / 1000).toString(),
				via: '1.1 google',
			},
		];
	})
	.patch('/channels/:id', (body) =>
		['name', 'topic'].every((key) => !Reflect.has(body as Record<string, unknown>, key)),
	)
	.reply(function handler(): nock.ReplyFnResult {
		sublimitRequests += 1;
		const response = 10 - sublimitRequests >= 0 ? 204 : 429;
		startSublimitIntervals();
		if (response === 204) {
			return [
				204,
				undefined,
				{
					'x-ratelimit-limit': '10',
					'x-ratelimit-remaining': `${10 - sublimitRequests}`,
					'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
					via: '1.1 google',
				},
			];
		}
		return [
			429,
			{
				limit: '10',
				remaining: `${10 - sublimitRequests}`,
				resetAfter: (sublimitResetAfter / 1000).toString(),
				retryAfter: ((sublimitResetAfter - Date.now()) / 1000).toString(),
			},
			{
				'x-ratelimit-limit': '10',
				'x-ratelimit-remaining': `${10 - sublimitRequests}`,
				'x-ratelimit-reset-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
				'retry-after': ((sublimitResetAfter - Date.now()) / 1000).toString(),
				via: '1.1 google',
			},
		];
	})
	.get('/unexpected')
	.times(2)
	.reply(function handler(): nock.ReplyFnResult {
		if (unexpected429) {
			unexpected429 = false;
			return [
				429,
				undefined,
				{
					'retry-after': '1',
					via: '1.1 google',
				},
			];
		}
		return [204, { test: true }];
	})
	.get('/unexpected-cf')
	.times(2)
	.reply(function handler(): nock.ReplyFnResult {
		if (unexpected429cf) {
			unexpected429cf = false;
			return [
				429,
				undefined,
				{
					'retry-after': '1',
				},
			];
		}
		return [204, { test: true }];
	})
	.get('/temp')
	.times(2)
	.reply(function handler(): nock.ReplyFnResult {
		if (serverOutage) {
			serverOutage = false;
			return [500];
		}
		return [204, { test: true }];
	})
	.get('/outage')
	.times(2)
	.reply(500)
	.get('/slow')
	.times(2)
	.delay(3000)
	.reply(200)
	.get('/badRequest')
	.reply(403, { message: 'Missing Permissions', code: 50013 })
	.get('/unauthorized')
	.reply(401, { message: '401: Unauthorized', code: 0 })
	.get('/malformedRequest')
	.reply(601);

// This is tested first to ensure the count remains accurate
test('Significant Invalid Requests', async () => {
	const invalidListener = jest.fn();
	const invalidListener2 = jest.fn();
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
	const [a, b, c] = [api.get('/standard'), api.get('/standard'), api.get('/standard')];

	expect(await a).toStrictEqual(Buffer.alloc(0));
	const previous1 = Date.now();
	expect(await b).toStrictEqual(Buffer.alloc(0));
	const previous2 = Date.now();
	expect(await c).toStrictEqual(Buffer.alloc(0));
	const now = Date.now();
	expect(previous2).toBeGreaterThanOrEqual(previous1 + 250);
	expect(now).toBeGreaterThanOrEqual(previous2 + 250);
});

test('Handle global rate limits', async () => {
	const earlier = Date.now();
	expect(await api.get('/triggerGlobal')).toStrictEqual({ global: true });
	expect(await api.get('/regularRequest')).toStrictEqual({ test: true });
	expect(Date.now()).toBeGreaterThanOrEqual(earlier + 100);
});

test('Handle sublimits', async () => {
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

	expect(a).toBeLessThan(b);
	expect(b).toBeLessThan(c);
	expect(d).toBeLessThan(c);
	expect(c).toBeLessThan(e);
	expect(d).toBeLessThan(e);
	expect(e).toBeLessThan(f);
	expect(e).toBeLessThan(g);
	expect(g).toBeLessThan(f);

	clearInterval(sublimitIntervals.reset);
	clearInterval(sublimitIntervals.retry);
});

test('Handle unexpected 429', async () => {
	const previous = Date.now();
	expect(await api.get('/unexpected')).toStrictEqual({ test: true });
	expect(Date.now()).toBeGreaterThanOrEqual(previous + 1000);
});

test('Handle unexpected 429 cloudflare', async () => {
	const previous = Date.now();
	expect(await api.get('/unexpected-cf')).toStrictEqual({ test: true });
	expect(Date.now()).toBeGreaterThanOrEqual(previous + 1000);
});

test('Handle temp server outage', async () => {
	expect(await api.get('/temp')).toStrictEqual({ test: true });
});

test('perm server outage', async () => {
	const promise = api.get('/outage');
	await expect(promise).rejects.toThrowError();
	await expect(promise).rejects.toBeInstanceOf(HTTPError);
});

test('server responding too slow', async () => {
	const promise = api.get('/slow');
	await expect(promise).rejects.toThrowError('The user aborted a request.');
}, 10000);

test('Bad Request', async () => {
	const promise = api.get('/badRequest');
	await expect(promise).rejects.toThrowError('Missing Permissions');
	await expect(promise).rejects.toBeInstanceOf(DiscordAPIError);
});

test('Unauthorized', async () => {
	const promise = invalidAuthApi.get('/unauthorized');
	await expect(promise).rejects.toThrowError('401: Unauthorized');
	await expect(promise).rejects.toBeInstanceOf(DiscordAPIError);
});

test('Reject on RateLimit', async () => {
	const [aP, bP, cP] = [
		rateLimitErrorApi.patch('/channels/:id', sublimit),
		rateLimitErrorApi.patch('/channels/:id', sublimit),
		rateLimitErrorApi.patch('/channels/:id', sublimit),
	];
	await expect(aP).resolves;
	await expect(bP).rejects.toThrowError();
	await expect(bP).rejects.toBeInstanceOf(RateLimitError);
	await expect(cP).rejects.toThrowError();
	await expect(cP).rejects.toBeInstanceOf(RateLimitError);
});

test('malformedRequest', async () => {
	expect(await api.get('/malformedRequest')).toBe(null);
});

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
