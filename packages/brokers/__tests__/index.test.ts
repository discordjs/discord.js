import type Redis from 'ioredis';
import { test, expect, vi } from 'vitest';
import { PubSubRedisBroker } from '../src';

const mockRedisClient = {
	defineCommand: vi.fn(),
	xadd: vi.fn(),
	duplicate: vi.fn(() => mockRedisClient),
} as unknown as Redis;

test('pubsub with custom encoding', async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	const encode = vi.fn((data) => data);

	const broker = new PubSubRedisBroker({ redisClient: mockRedisClient, encode });
	await broker.publish('test', 'test');
	expect(encode).toHaveBeenCalledWith('test');
});
