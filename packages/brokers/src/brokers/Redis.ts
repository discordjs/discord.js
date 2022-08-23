import type Redis from 'ioredis';

export class RedisBroker {
	public constructor(private readonly redisClient: Redis) {}
}
