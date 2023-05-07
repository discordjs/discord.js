import process from 'node:process';
import type { GatewayIntentBits } from 'discord-api-types/v10';

export class Env {
	public readonly redisUrl: string = process.env.REDIS_URL!;

	public readonly discordToken: string = process.env.DISCORD_TOKEN!;

	public readonly discordProxyURL: string | null = process.env.DISCORD_PROXY_URL ?? null;

	public readonly intents: GatewayIntentBits | 0 = Number(process.env.INTENTS ?? 0);

	public readonly shardCount: number | null = process.env.SHARD_COUNT ? Number(process.env.SHARD_COUNT) : null;

	public readonly shardIds: number[] | null = process.env.SHARD_IDS
		? process.env.SHARD_IDS.split(',').map(Number)
		: null;

	public readonly shardsPerWorker: number | 'all' | null =
		process.env.SHARDS_PER_WORKER === 'all'
			? 'all'
			: process.env.SHARDS_PER_WORKER
			? Number(process.env.SHARDS_PER_WORKER)
			: null;

	private readonly REQUIRED_ENV_VARS = ['REDIS_URL', 'DISCORD_TOKEN'] as const;

	public constructor() {
		for (const key of this.REQUIRED_ENV_VARS) {
			if (!(key in process.env)) {
				throw new Error(`Missing required environment variable: ${key}`);
			}
		}
	}
}
