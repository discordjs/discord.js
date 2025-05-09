import type Redis from 'ioredis';
import { test, expect, vi } from 'vitest';
import { PubSubRedisBroker } from '../src/index.js';

vi.mock('node:fs', () => ({
	readFileSync: vi.fn(),
}));

const mockRedisClient = {
	defineCommand: vi.fn(),
	xadd: vi.fn(),
	duplicate: vi.fn(() => mockRedisClient),
} as unknown as Redis;

test('pubsub with custom encoding', async () => {
	const encode = vi.fn((data) => data);

	const broker = new PubSubRedisBroker(mockRedisClient, { encode, group: 'group' });
	await broker.publish('test', 'test');
	expect(encode).toHaveBeenCalledWith('test');
});
