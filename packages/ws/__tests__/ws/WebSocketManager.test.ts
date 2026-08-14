import type { GatewaySendPayload } from 'discord-api-types/v10';
import { GatewayOpcodes } from 'discord-api-types/v10';
import { describe, expect, test, vi } from 'vitest';
import { WebSocketManager, type IShardingStrategy } from '../../src/index.js';
import { mockGatewayInformation } from '../gateway.mock.js';

class MockStrategy implements IShardingStrategy {
	public spawn = vi.fn();

	public connect = vi.fn();

	public destroy = vi.fn();

	public send = vi.fn();

	public fetchStatus = vi.fn();
}

test('connect requires gateway information', async () => {
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
	});

	// @ts-expect-error: Testing the runtime check for a missing gatewayInformation
	await expect(manager.connect()).rejects.toThrow(TypeError);
});

test('gateway information is not available before connecting', () => {
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
	});

	expect(() => manager.getGatewayInformation()).toThrow(Error);
	expect(() => manager.getShardCount()).toThrow(Error);
});

describe('get shard count', () => {
	test('with no shard count or ids', async () => {
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			buildStrategy: () => new MockStrategy(),
		});

		await manager.connect({ gatewayInformation: mockGatewayInformation });

		expect(manager.getShardCount()).toBe(mockGatewayInformation.shards);
	});

	test('with shard count', () => {
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardCount: 2,
		});

		expect(manager.getShardCount()).toBe(2);
	});

	test('with shard ids array', () => {
		const shardIds = [5, 9];
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardIds,
		});

		expect(manager.getShardCount()).toBe(shardIds.at(-1)! + 1);
	});

	test('with shard id range', () => {
		const shardIds = { start: 5, end: 9 };
		const manager = new WebSocketManager({
			token: 'A-Very-Fake-Token',
			intents: 0,
			shardIds,
		});

		expect(manager.getShardCount()).toBe(shardIds.end + 1);
	});
});

test('update shard count', async () => {
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardCount: 2,
		buildStrategy: () => new MockStrategy(),
	});

	expect(manager.getShardCount()).toBe(2);

	await manager.updateShardCount(3);
	expect(manager.getShardCount()).toBe(3);
	expect(manager.getShardIds()).toStrictEqual([0, 1, 2]);
});

test('it handles passing in both shardIds and shardCount', () => {
	const shardIds = { start: 2, end: 3 };
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardIds,
		shardCount: 4,
	});

	expect(manager.getShardCount()).toBe(4);
	expect(manager.getShardIds()).toStrictEqual([2, 3]);
});

test('strategies', async () => {
	const strategy = new MockStrategy();

	const shardIds = [0, 1, 2];

	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		shardIds,
		buildStrategy: () => strategy,
	});

	await manager.connect({ gatewayInformation: mockGatewayInformation });
	expect(manager.getGatewayInformation()).toBe(mockGatewayInformation);
	expect(strategy.spawn).toHaveBeenCalledWith(shardIds);
	expect(strategy.connect).toHaveBeenCalled();

	const destroyOptions = { reason: ':3' };
	await manager.destroy(destroyOptions);
	expect(strategy.destroy).toHaveBeenCalledWith(destroyOptions);
	expect(() => manager.getGatewayInformation()).toThrow(Error);

	const send: GatewaySendPayload = {
		op: GatewayOpcodes.RequestGuildMembers,
		// eslint-disable-next-line id-length
		d: { guild_id: '1234', limit: 0, query: '' },
	};
	await manager.send(0, send);
	expect(strategy.send).toHaveBeenCalledWith(0, send);
});
