import type { GatewaySendPayload } from 'discord-api-types/v10';
import { GatewayOpcodes } from 'discord-api-types/v10';
import { describe, expect, test, vi } from 'vitest';
import { WebSocketManager, type IShardingStrategy } from '../../src/index.js';
import { mockGatewayInformation } from '../gateway.mock.js';

vi.useFakeTimers();

const NOW = vi.fn().mockReturnValue(Date.now());
global.Date.now = NOW;

test('fetch gateway information', async () => {
	const fetchGatewayInformation = vi.fn(async () => mockGatewayInformation);

	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		fetchGatewayInformation,
	});

	const initial = await manager.fetchGatewayInformation();
	expect(initial).toEqual(mockGatewayInformation);
	expect(fetchGatewayInformation).toHaveBeenCalledOnce();

	fetchGatewayInformation.mockClear();

	const cached = await manager.fetchGatewayInformation();
	expect(cached).toEqual(mockGatewayInformation);
	expect(fetchGatewayInformation).not.toHaveBeenCalled();

	fetchGatewayInformation.mockClear();

	const forced = await manager.fetchGatewayInformation(true);
	expect(forced).toEqual(mockGatewayInformation);
	expect(fetchGatewayInformation).toHaveBeenCalledOnce();

	fetchGatewayInformation.mockClear();

	NOW.mockReturnValue(Number.POSITIVE_INFINITY);
	const cacheExpired = await manager.fetchGatewayInformation();
	expect(cacheExpired).toEqual(mockGatewayInformation);
	expect(fetchGatewayInformation).toHaveBeenCalledOnce();
});

describe('get shard count', () => {
	test('with shard count', async () => {
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardCount: 2,
			async fetchGatewayInformation() {
				return mockGatewayInformation;
			},
		});

		expect(await manager.getShardCount()).toBe(2);
	});

	test('with shard ids array', async () => {
		const shardIds = [5, 9];
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardIds,
			async fetchGatewayInformation() {
				return mockGatewayInformation;
			},
		});

		expect(await manager.getShardCount()).toBe(shardIds.at(-1)! + 1);
	});

	test('with shard id range', async () => {
		const shardIds = { start: 5, end: 9 };
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardIds,
			async fetchGatewayInformation() {
				return mockGatewayInformation;
			},
		});

		expect(await manager.getShardCount()).toBe(shardIds.end + 1);
	});
});

test('update shard count', async () => {
	const fetchGatewayInformation = vi.fn(async () => mockGatewayInformation);

	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardCount: 2,
		fetchGatewayInformation,
	});

	expect(await manager.getShardCount()).toBe(2);
	expect(fetchGatewayInformation).not.toHaveBeenCalled();

	fetchGatewayInformation.mockClear();

	await manager.updateShardCount(3);
	expect(await manager.getShardCount()).toBe(3);
	expect(fetchGatewayInformation).toHaveBeenCalled();
});

test('it handles passing in both shardIds and shardCount', async () => {
	const shardIds = { start: 2, end: 3 };
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardIds,
		shardCount: 4,
		async fetchGatewayInformation() {
			return mockGatewayInformation;
		},
	});

	expect(await manager.getShardCount()).toBe(4);
	expect(await manager.getShardIds()).toStrictEqual([2, 3]);
});

test('strategies', async () => {
	class MockStrategy implements IShardingStrategy {
		public spawn = vi.fn();

		public connect = vi.fn();

		public destroy = vi.fn();

		public send = vi.fn();

		public fetchStatus = vi.fn();
	}

	const strategy = new MockStrategy();

	const shardIds = [0, 1, 2];

	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardIds,
		async fetchGatewayInformation() {
			return mockGatewayInformation;
		},
		buildStrategy: () => strategy,
	});

	await manager.connect();
	expect(strategy.spawn).toHaveBeenCalledWith(shardIds);
	expect(strategy.connect).toHaveBeenCalled();

	const destroyOptions = { reason: ':3' };
	await manager.destroy(destroyOptions);
	expect(strategy.destroy).toHaveBeenCalledWith(destroyOptions);

	const send: GatewaySendPayload = {
		op: GatewayOpcodes.RequestGuildMembers,
		// eslint-disable-next-line id-length
		d: { guild_id: '1234', limit: 0, query: '' },
	};
	await manager.send(0, send);
	expect(strategy.send).toHaveBeenCalledWith(0, send);
});
