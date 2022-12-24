import type { Snowflake } from 'discord-api-types/v10';

export function calculateShardId(guildId: Snowflake, shardCount: number) {
	return Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
}
