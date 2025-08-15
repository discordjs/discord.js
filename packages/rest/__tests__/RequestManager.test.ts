import { MockAgent, setGlobalDispatcher, type Interceptable } from 'undici';
import type { MockInterceptor } from 'undici/types/mock-interceptor.js';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { REST } from '../src/index.js';
import { normalizeRateLimitOffset } from '../src/lib/utils/utils.js';
import { genPath } from './util.js';

const api = new REST();

// @discordjs/rest uses the `content-type` header to detect whether to parse
// the response as JSON or as an ArrayBuffer.
const responseOptions: MockInterceptor.MockResponseOptions = {
	headers: {
		'content-type': 'application/json',
	},
};

let mockAgent: MockAgent;
let mockPool: Interceptable;

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	setGlobalDispatcher(mockAgent);

	mockPool = mockAgent.get('https://discord.com');
});

afterEach(async () => {
	await mockAgent.close();
});

test('no token', async () => {
	mockPool
		.intercept({
			path: genPath('/simpleGet'),
			method: 'GET',
		})
		.reply(200, 'Well this is awkward...');

	const promise = api.get('/simpleGet');
	await expect(promise).rejects.toThrowError('Expected token to be set for this request, but none was present');
	await expect(promise).rejects.toBeInstanceOf(Error);
});

test('no token: webhook with token', async () => {
	mockPool
		.intercept({
			path: genPath('/webhooks/:id/:token'),
			method: 'POST',
		})
		.reply(() => ({
			data: { successful: true },
			statusCode: 200,
			responseOptions,
		}))
		.times(1);

	// this route does not require the manager to have a token
	const promise = api.post('/webhooks/:id/:token');
	await expect(promise).resolves.toEqual({ successful: true });
});

test('negative offset', () => {
	const badREST = new REST({ offset: -5_000 });

	expect(normalizeRateLimitOffset(badREST.options.offset, 'hehe :3')).toEqual(0);
});
