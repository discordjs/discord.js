import { DiscordSnowflake } from '@sapphire/snowflake';
import { Routes, Snowflake } from 'discord-api-types/v10';
import { MockAgent, setGlobalDispatcher } from 'undici';
import type { MockInterceptor } from 'undici/types/mock-interceptor';
import { APIRequest, REST } from '../src';
import { genPath } from './util';

const newSnowflake: Snowflake = DiscordSnowflake.generate().toString();

const api = new REST().setToken('A-Very-Fake-Token');

// @discordjs/rest uses the `content-type` header to detect whether to parse
// the response as JSON or as an ArrayBuffer.
const responseOptions: MockInterceptor.MockResponseOptions = {
	headers: {
		'content-type': 'application/json',
	},
};

/*
const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
setGlobalDispatcher(mockAgent);

const mockPool = mockAgent.get('http://localhost:3000');
mockPool.intercept({ path: '/foo', method: 'GET' }).reply(200, 'foo');

const res = await fetch('http://localhost:3000/foo');

console.log(res.status, await res.text()); // 200 foo
*/

const mockAgent = new MockAgent();
mockAgent.disableNetConnect(); // don't accidentally make requests to Discord
setGlobalDispatcher(mockAgent); // this allows the Agent to intercept requests

const mockPool = mockAgent.get('https://discord.com');

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
			method: 'patch', // yes, this has to be lowercase
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
			query: query,
		}),
	).toStrictEqual({ test: true });
});

test('getAuth', async () => {
	mockPool
		.intercept({
			path: genPath('/getAuth'),
			method: 'GET',
		})
		.reply((t) => ({
			data: { auth: t.headers.get('authorization') },
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
		.reply((t) => ({
			data: { reason: t.headers.get('x-audit-log-reason') },
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
		.reply((t) => ({
			data: t.body!,
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
		.reply((t) => ({
			data: t.body!,
			statusCode: 200,
			responseOptions,
		}));

	expect(await api.post('/postEcho', { body: { foo: 'bar' } })).toStrictEqual({ foo: 'bar' });
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

test('Old Message Delete Edge-Case: Old message', async () => {
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

test('Request and Response Events', async () => {
	mockPool
		.intercept({
			path: genPath('/request'),
			method: 'GET',
		})
		.reply(() => ({
			data: { test: true },
			statusCode: 200,
			responseOptions,
		}))
		.times(2);

	const requestListener = jest.fn();
	const responseListener = jest.fn();

	api.on('request', requestListener);
	api.on('response', responseListener);

	await api.get('/request');

	expect(requestListener).toHaveBeenCalledTimes(1);
	expect(responseListener).toHaveBeenCalledTimes(1);
	expect(requestListener).toHaveBeenLastCalledWith<[APIRequest]>(
		expect.objectContaining({
			method: 'get',
			path: '/request',
			route: '/request',
			data: { files: undefined, body: undefined, auth: true },
			retries: 0,
		}) as APIRequest,
	);
	expect(responseListener).toHaveBeenLastCalledWith<[APIRequest, Response]>(
		expect.objectContaining({
			method: 'get',
			path: '/request',
			route: '/request',
			data: { files: undefined, body: undefined, auth: true },
			retries: 0,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			options: expect.any(Object),
		}) as APIRequest,
		// Bug in undici's mock where statusText is undefined.
		// However if we receive a 200 response, the statusText will
		// always be "OK" in real-world situations.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		expect.objectContaining({ status: 200 } as Response),
	);

	api.off('request', requestListener);
	api.off('response', responseListener);

	await api.get('/request');

	expect(requestListener).toHaveBeenCalledTimes(1);
	expect(responseListener).toHaveBeenCalledTimes(1);
});
