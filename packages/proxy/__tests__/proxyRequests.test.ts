import { createServer } from 'node:http';
import { REST } from '@discordjs/rest';
import supertest from 'supertest';
import type { Interceptable } from 'undici';
import { MockAgent, setGlobalDispatcher } from 'undici';
import type { MockInterceptor } from 'undici/types/mock-interceptor';
import { beforeEach, afterAll, afterEach, test, expect } from 'vitest';
import { proxyRequests } from '../src/index.js';

let mockAgent: MockAgent;
let mockPool: Interceptable;

const responseOptions: MockInterceptor.MockResponseOptions = {
	headers: {
		'content-type': 'application/json',
	},
};

const api = new REST().setToken('A-Very-Fake-Token');
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(proxyRequests(api));

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect(); // prevent actual requests to Discord
	setGlobalDispatcher(mockAgent); // enabled the mock client to intercept requests

	mockPool = mockAgent.get('https://discord.com');
});

afterEach(async () => {
	await mockAgent.close();
});

afterAll(() => {
	server.close();
});

test('simple GET', async () => {
	mockPool
		.intercept({
			path: '/api/v10/simpleGet',
			method: 'GET',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions: {
				...responseOptions,
				headers: {
					...responseOptions.headers,
					'x-ratelimit-limit': '10',
				},
			},
		}));

	const res = await supertest(server).get('/api/v10/simpleGet');
	const headers = res.headers as Record<string, string>;

	expect(headers['content-type']).toEqual(expect.stringMatching(/^application\/json/));
	// Ratelimit headers should be dropped
	expect(headers).not.toHaveProperty('x-ratelimit-limit');
	expect(res.statusCode).toEqual(200);
	expect(res.body).toStrictEqual({ test: true });
});

test('failed request', async () => {
	mockPool
		.intercept({
			path: '/api/v10/simpleGet',
			method: 'GET',
		})
		.reply(() => ({
			data: { code: 404, message: 'Not Found' },
			statusCode: 404,
			responseOptions,
		}));

	const res = await supertest(server).get('/api/v10/simpleGet');
	const headers = res.headers as Record<string, string>;

	expect(headers['content-type']).toEqual(expect.stringMatching(/^application\/json/));
	expect(res.statusCode).toEqual(404);
	expect(res.body).toStrictEqual({ code: 404, message: 'Not Found' });
});
