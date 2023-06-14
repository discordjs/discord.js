import { Blob, Buffer } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { MockAgent, setGlobalDispatcher } from 'undici';
import type { Interceptable, MockInterceptor } from 'undici/types/mock-interceptor.js';
import { beforeEach, afterEach, test, expect, vitest } from 'vitest';
import { REST } from '../src/index.js';
import { makeRequest, resolveBody } from '../src/strategies/undiciRequest.js';
import { genPath } from './util.js';

const makeRequestMock = vitest.fn(makeRequest);

const api = new REST({ makeRequest: makeRequestMock }).setToken('A-Very-Fake-Token');

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
	mockAgent.disableNetConnect(); // prevent actual requests to Discord
	setGlobalDispatcher(mockAgent); // enabled the mock client to intercept requests

	mockPool = mockAgent.get('https://discord.com');
});

afterEach(async () => {
	await mockAgent.close();
});

test('resolveBody', async () => {
	await expect(resolveBody(null)).resolves.toEqual(null);
	await expect(resolveBody(undefined)).resolves.toEqual(null);
	await expect(resolveBody('Hello')).resolves.toEqual('Hello');
	await expect(resolveBody(new Uint8Array([1, 2, 3]))).resolves.toStrictEqual(new Uint8Array([1, 2, 3]));
	// ArrayBuffers gets resolved to Uint8Array
	await expect(resolveBody(new ArrayBuffer(8))).resolves.toStrictEqual(new Uint8Array(new ArrayBuffer(8)));

	const urlSearchParams = new URLSearchParams([['a', 'b']]);
	await expect(resolveBody(urlSearchParams)).resolves.toEqual(urlSearchParams.toString());

	const dataView = new DataView(new ArrayBuffer(8));
	await expect(resolveBody(dataView)).resolves.toStrictEqual(new Uint8Array(new ArrayBuffer(8)));

	const blob = new Blob(['hello']);
	await expect(resolveBody(blob)).resolves.toStrictEqual(new Uint8Array(await blob.arrayBuffer()));

	const iterable: Iterable<Uint8Array> = {
		*[Symbol.iterator]() {
			for (let index = 0; index < 3; index++) {
				yield new Uint8Array([1, 2, 3]);
			}
		},
	};
	await expect(resolveBody(iterable)).resolves.toStrictEqual(Buffer.from([1, 2, 3, 1, 2, 3, 1, 2, 3]));

	const asyncIterable: AsyncIterable<Uint8Array> = {
		[Symbol.asyncIterator]() {
			let index = 0;
			return {
				async next() {
					if (index < 3) {
						index++;
						return { value: new Uint8Array([1, 2, 3]), done: false };
					}

					return { value: undefined, done: true };
				},
			};
		},
	};
	await expect(resolveBody(asyncIterable)).resolves.toStrictEqual(Buffer.from([1, 2, 3, 1, 2, 3, 1, 2, 3]));

	// Unknown type
	// @ts-expect-error: This test is ensuring that this throws
	await expect(resolveBody(true)).rejects.toThrow(TypeError);
});

test('use passed undici request', async () => {
	mockPool
		.intercept({
			path: genPath('/simplePost'),
			method: 'POST',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.post('/simplePost')).toStrictEqual({ test: true });
	expect(makeRequestMock).toHaveBeenCalledTimes(1);
});
