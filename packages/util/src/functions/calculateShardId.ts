export function calculateShardId(guildId: string, shardCount: number) {
	return Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
}
