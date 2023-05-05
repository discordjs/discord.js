/**
 * Calculates the shard id for a given guild id.
 *
 * @param guildId - The guild id to calculate the shard id for
 * @param shardCount - The total number of shards
 */
export function calculateShardId(guildId: string, shardCount: number) {
	return Number(BigInt(guildId) >> 22n) % shardCount;
}
