import { REST } from '@discordjs/rest';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import { MockAgent, Interceptable } from 'undici';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { WebSocketManager } from '../src';

vi.useFakeTimers();

let mockAgent: MockAgent;
let mockPool: Interceptable;

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	mockPool = mockAgent.get('https://discord.com');
});

const NOW = vi.fn().mockReturnValue(Date.now());
global.Date.now = NOW;

test('fetch gateway information', async () => {
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
	const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest });

	const data: APIGatewayBotInfo = {
		shards: 1,
		session_start_limit: {
			max_concurrency: 3,
			reset_after: 60,
			remaining: 3,
			total: 3,
		},
		url: 'wss://gateway.discord.gg',
	};

	const fetch = vi.fn(() => ({
		data,
		statusCode: 200,
		responseOptions: {
			headers: {
				'content-type': 'application/json',
			},
		},
	}));

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	const initial = await manager.fetchGatewayInformation();
	expect(initial).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();

	fetch.mockRestore();

	const cached = await manager.fetchGatewayInformation();
	expect(cached).toEqual(data);
	expect(fetch).not.toHaveBeenCalled();

	fetch.mockRestore();
	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	const forced = await manager.fetchGatewayInformation(true);
	expect(forced).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();

	fetch.mockRestore();
	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	NOW.mockReturnValue(Infinity);
	const cacheExpired = await manager.fetchGatewayInformation();
	expect(cacheExpired).toEqual(data);
	expect(fetch).toHaveBeenCalledOnce();
});

describe('get shard count', () => {
	test('with shard count', async () => {
		const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
		const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest, shardCount: 2 });

		expect(await manager.getShardCount()).toBe(2);
	});

	test('with shard ids array', async () => {
		const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
		const shardIds = [5, 9];
		const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest, shardIds });

		expect(await manager.getShardCount()).toBe(shardIds.at(-1)! + 1);
	});

	test('with shard id range', async () => {
		const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
		const shardIds = { start: 5, end: 9 };
		const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest, shardIds });

		expect(await manager.getShardCount()).toBe(shardIds.end + 1);
	});
});

test('update shard count', async () => {
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
	const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest, shardCount: 2 });

	const data: APIGatewayBotInfo = {
		shards: 1,
		session_start_limit: {
			max_concurrency: 3,
			reset_after: 60,
			remaining: 3,
			total: 3,
		},
		url: 'wss://gateway.discord.gg',
	};

	const fetch = vi.fn(() => ({
		data,
		statusCode: 200,
		responseOptions: {
			headers: {
				'content-type': 'application/json',
			},
		},
	}));

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	expect(await manager.getShardCount()).toBe(2);
	expect(fetch).not.toHaveBeenCalled();

	fetch.mockRestore();
	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(fetch);

	await manager.updateShardCount(3);
	expect(await manager.getShardCount()).toBe(3);
	expect(fetch).toHaveBeenCalled();
});

test('it handles passing in both shardIds and shardCount', async () => {
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
	const shardIds = { start: 2, end: 3 };
	const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest, shardIds, shardCount: 4 });

	expect(await manager.getShardCount()).toBe(4);
	expect(await manager.getShardIds()).toStrictEqual([2, 3]);
});
