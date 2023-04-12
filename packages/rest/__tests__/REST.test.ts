import { Buffer, File as NativeFile } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { DiscordSnowflake } from '@sapphire/snowflake';
import type { Snowflake } from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';
import type { FormData } from 'undici';
import { File as UndiciFile, MockAgent, setGlobalDispatcher } from 'undici';
import type { Interceptable, MockInterceptor } from 'undici/types/mock-interceptor';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { REST } from '../src/index.js';
import { genPath } from './util.js';

const File = NativeFile ?? UndiciFile;

const newSnowflake: Snowflake = DiscordSnowflake.generate().toString();

const api = new REST().setToken('A-Very-Fake-Token');

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

test('simple GET', async () => {
	mockPool
		.intercept({
			path: genPath('/simpleGet'),
			method: 'GET',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.get('/simpleGet')).toStrictEqual({ test: true });
});

test('simple DELETE', async () => {
	mockPool
		.intercept({
			path: genPath('/simpleDelete'),
			method: 'DELETE',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.delete('/simpleDelete')).toStrictEqual({ test: true });
});

test('simple PATCH', async () => {
	mockPool
		.intercept({
			path: genPath('/simplePatch'),
			method: 'PATCH',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.patch('/simplePatch')).toStrictEqual({ test: true });
});

test('simple PUT', async () => {
	mockPool
		.intercept({
			path: genPath('/simplePut'),
			method: 'PUT',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.put('/simplePut')).toStrictEqual({ test: true });
});

test('simple POST', async () => {
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
});

test('simple PUT 2', async () => {
	mockPool
		.intercept({
			path: genPath('/simplePut'),
			method: 'PUT',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.put('/simplePut')).toStrictEqual({ test: true });
});

test('getQuery', async () => {
	const query = new URLSearchParams([
		['foo', 'bar'],
		['hello', 'world'],
	]);

	mockPool
		.intercept({
			path: `${genPath('/getQuery')}?${query.toString()}`,
			method: 'GET',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(
		await api.get('/getQuery', {
			query,
		}),
	).toStrictEqual({ test: true });
});

test('getAuth', async () => {
	mockPool
		.intercept({
			path: genPath('/getAuth'),
			method: 'GET',
		})
		.reply((from) => ({
			data: { auth: (from.headers as unknown as Record<string, string | undefined>).Authorization ?? null },
			statusCode: 200,
			responseOptions,
		}))
		.times(3);

	// default
	expect(await api.get('/getAuth')).toStrictEqual({ auth: 'Bot A-Very-Fake-Token' });

	// unauthorized
	expect(
		await api.get('/getAuth', {
			auth: false,
		}),
	).toStrictEqual({ auth: null });

	// authorized
	expect(
		await api.get('/getAuth', {
			auth: true,
		}),
	).toStrictEqual({ auth: 'Bot A-Very-Fake-Token' });
});

test('getReason', async () => {
	mockPool
		.intercept({
			path: genPath('/getReason'),
			method: 'GET',
		})
		.reply((from) => ({
			data: { reason: (from.headers as unknown as Record<string, string | undefined>)['X-Audit-Log-Reason'] ?? null },
			statusCode: 200,
			responseOptions,
		}))
		.times(3);

	// default
	expect(await api.get('/getReason')).toStrictEqual({ reason: null });

	// plain text
	expect(
		await api.get('/getReason', {
			reason: 'Hello',
		}),
	).toStrictEqual({ reason: 'Hello' });

	// encoded
	expect(
		await api.get('/getReason', {
			reason: '😄',
		}),
	).toStrictEqual({ reason: '%F0%9F%98%84' });
});

test('urlEncoded', async () => {
	mockPool
		.intercept({
			path: genPath('/urlEncoded'),
			method: 'POST',
		})
		.reply((from) => ({
			data: from.body!,
			statusCode: 200,
		}));

	const body = new URLSearchParams([
		['client_id', '1234567890123545678'],
		['client_secret', 'totally-valid-secret'],
		['redirect_uri', 'http://localhost'],
		['grant_type', 'authorization_code'],
		['code', 'very-invalid-code'],
	]);

	expect(
		new Uint8Array(
			(await api.post('/urlEncoded', {
				body,
				passThroughBody: true,
				auth: false,
			})) as ArrayBuffer,
		),
	).toStrictEqual(new Uint8Array(Buffer.from(body.toString())));
});

test('postEcho', async () => {
	mockPool
		.intercept({
			path: genPath('/postEcho'),
			method: 'POST',
		})
		.reply((from) => ({
			data: from.body!,
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.post('/postEcho', { body: { foo: 'bar' } })).toStrictEqual({ foo: 'bar' });
});

test('201 status code', async () => {
	mockPool
		.intercept({
			path: genPath('/postNon200StatusCode'),
			method: 'POST',
		})
		.reply((from) => ({
			data: from.body!,
			statusCode: 201,
			responseOptions,
		}));

	expect(await api.post('/postNon200StatusCode', { body: { foo: 'bar' } })).toStrictEqual({ foo: 'bar' });
});

test('Old Message Delete Edge-Case: Old message', async () => {
	mockPool
		.intercept({
			path: genPath('/channels/339942739275677727/messages/392063687801700356'),
			method: 'DELETE',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.delete(Routes.channelMessage('339942739275677727', '392063687801700356'))).toStrictEqual({
		test: true,
	});
});

test('Old Message Delete Edge-Case: Old message 2', async () => {
	mockPool
		.intercept({
			path: genPath(`/channels/339942739275677727/messages/${newSnowflake}`),
			method: 'DELETE',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.delete(Routes.channelMessage('339942739275677727', newSnowflake))).toStrictEqual({ test: true });
});

test('postFile', async () => {
	const mockData = {
		statusCode: 200,
		data: 'Hello',
	};

	mockPool
		.intercept({
			path: genPath('/postFileEmptyArray'),
			method: 'POST',
		})
		.reply(({ body }) => {
			expect(body).toBeNull();
			return mockData;
		});

	// postFile empty
	await api.post('/postFileEmptyArray', { files: [] });

	mockPool
		.intercept({
			path: genPath('/postFileStringData'),
			method: 'POST',
		})
		.reply(({ body }) => {
			const fd = body as FormData;

			expect(fd.get('files[0]')).toBeInstanceOf(File);
			expect(fd.get('files[0]')).toHaveProperty('size', 5); // 'Hello'

			return mockData;
		});

	// postFile file (string)
	await api.post('/postFileStringData', {
		files: [{ name: 'out.txt', data: 'Hello' }],
	});

	mockPool
		.intercept({
			path: genPath('/postFileBufferWithJson'),
			method: 'POST',
		})
		.reply(({ body }) => {
			const fd = body as FormData;

			expect(fd.get('files[0]')).toBeInstanceOf(File);
			expect(fd.get('files[0]')).toHaveProperty('size', 5); // Buffer.from('Hello')
			expect(fd.get('payload_json')).toStrictEqual(JSON.stringify({ foo: 'bar' }));

			return mockData;
		});

	// postFile file and JSON
	await api.post('/postFileBufferWithJson', {
		files: [{ name: 'out.txt', data: Buffer.from('Hello') }],
		body: { foo: 'bar' },
	});

	mockPool
		.intercept({
			path: genPath('/postFilesAndJson'),
			method: 'POST',
		})
		.reply(({ body }) => {
			const fd = body as FormData;

			expect(fd.get('files[0]')).toBeInstanceOf(File);
			expect(fd.get('files[1]')).toBeInstanceOf(File);
			expect(fd.get('files[0]')).toHaveProperty('size', 5); // Buffer.from('Hello')
			expect(fd.get('files[1]')).toHaveProperty('size', 2); // Buffer.from('Hi')
			expect(fd.get('payload_json')).toStrictEqual(JSON.stringify({ files: [{ id: 0, description: 'test' }] }));

			return mockData;
		});

	// postFile files and JSON
	await api.post('/postFilesAndJson', {
		files: [
			{ name: 'out.txt', data: Buffer.from('Hello') },
			{ name: 'out.txt', data: Buffer.from('Hi') },
		],
		body: { files: [{ id: 0, description: 'test' }] },
	});

	mockPool
		.intercept({
			path: genPath('/postFileStickerAndJson'),
			method: 'POST',
		})
		.reply(({ body }) => {
			const fd = body as FormData;

			expect(fd.get('file')).toBeInstanceOf(File);
			expect(fd.get('file')).toHaveProperty('size', 7); // Buffer.from('Sticker')
			expect(fd.get('foo')).toStrictEqual('bar');

			return mockData;
		});

	// postFile sticker and JSON
	await api.post('/postFileStickerAndJson', {
		files: [{ key: 'file', name: 'sticker.png', data: Buffer.from('Sticker') }],
		body: { foo: 'bar' },
		appendToFormData: true,
	});
});
