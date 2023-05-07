/* eslint-disable id-length */
/* eslint-disable promise/prefer-await-to-then */
import { performance } from 'node:perf_hooks';
import { MockAgent, setGlobalDispatcher } from 'undici';
import type { Interceptable, MockInterceptor } from 'undici/types/mock-interceptor';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { DiscordAPIError, REST, BurstHandlerMajorIdKey } from '../src/index.js';
import { BurstHandler } from '../src/lib/handlers/BurstHandler.js';
import { genPath } from './util.js';

const callbackKey = `Global(POST:/interactions/:id/:token/callback):${BurstHandlerMajorIdKey}`;
const callbackPath = new RegExp(genPath('/interactions/[0-9]{17,19}/.+/callback'));

const api = new REST();

let mockAgent: MockAgent;
let mockPool: Interceptable;

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	setGlobalDispatcher(mockAgent);

	mockPool = mockAgent.get('https://discord.com');
	api.setAgent(mockAgent);
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

test('Interaction callback creates burst handler', async () => {
	mockPool.intercept({ path: callbackPath, method: 'POST' }).reply(200);

	expect(api.requestManager.handlers.get(callbackKey)).toBe(undefined);
	expect(
		await api.post('/interactions/1234567890123456789/totallyarealtoken/callback', {
			auth: false,
			body: { type: 4, data: { content: 'Reply' } },
		}),
		// TODO: This should be ArrayBuffer, there is a bug in undici request
	).toBeInstanceOf(Uint8Array);
	expect(api.requestManager.handlers.get(callbackKey)).toBeInstanceOf(BurstHandler);
});

test('Requests are handled in bursts', async () => {
	mockPool.intercept({ path: callbackPath, method: 'POST' }).reply(200).delay(100).times(3);

	// Return the current time on these results as their response does not indicate anything
	const [a, b, c] = await Promise.all([
		api
			.post('/interactions/1234567890123456789/totallyarealtoken/callback', {
				auth: false,
				body: { type: 4, data: { content: 'Reply1' } },
			})
			.then(() => performance.now()),
		api
			.post('/interactions/2345678901234567890/anotherveryrealtoken/callback', {
				auth: false,
				body: { type: 4, data: { content: 'Reply2' } },
			})
			.then(() => performance.now()),
		api
			.post('/interactions/3456789012345678901/nowaytheresanotherone/callback', {
				auth: false,
				body: { type: 4, data: { content: 'Reply3' } },
			})
			.then(() => performance.now()),
	]);

	expect(b - a).toBeLessThan(10);
	expect(c - a).toBeLessThan(10);
});

test('Handle 404', async () => {
	mockPool
		.intercept({ path: callbackPath, method: 'POST' })
		.reply(404, { message: 'Unknown interaction', code: 10_062 }, responseOptions);

	const promise = api.post('/interactions/1234567890123456788/definitelynotarealinteraction/callback', {
		auth: false,
		body: { type: 4, data: { content: 'Malicious' } },
	});
	await expect(promise).rejects.toThrowError('Unknown interaction');
	await expect(promise).rejects.toBeInstanceOf(DiscordAPIError);
});

let unexpected429 = true;
test('Handle unexpected 429', async () => {
	mockPool
		.intercept({
			path: callbackPath,
			method: 'POST',
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
		.times(2);

	const previous = performance.now();
	let firstResolvedTime: number;
	const unexpectedLimit = api
		.post('/interactions/1234567890123456789/totallyarealtoken/callback', {
			auth: false,
			body: { type: 4, data: { content: 'Reply' } },
		})
		.then((res) => {
			firstResolvedTime = performance.now();
			return res;
		});

	expect(await unexpectedLimit).toStrictEqual({ test: true });
	expect(performance.now()).toBeGreaterThanOrEqual(previous + 1_000);
});
