import { createServer } from 'http';
import { REST } from '@discordjs/rest';
import supertest from 'supertest';
import { MockAgent, Interceptable, setGlobalDispatcher } from 'undici';
import type { MockInterceptor } from 'undici/types/mock-interceptor';
import { proxyRequests } from '../src';

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
			responseOptions,
		}));

	await supertest(server).get('/simpleGet').expect(200, { test: true });
});
