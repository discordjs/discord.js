import { MockAgent, setGlobalDispatcher } from 'undici';
import type { Interceptable } from 'undici/types/mock-interceptor';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { REST } from '../src/index.js';
import { genPath } from './util.js';

const api = new REST();

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

test('negative offset', () => {
	const badREST = new REST({ offset: -5_000 });

	expect(badREST.requestManager.options.offset).toEqual(0);
});
