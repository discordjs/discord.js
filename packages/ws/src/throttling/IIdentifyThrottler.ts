/**
 * IdentifyThrottlers are responsible for dictating when a shard is allowed to identify.
 *
 * See https://discord.com/developers/docs/topics/gateway#sharding-max-concurrency
 */
export interface IIdentifyThrottler {
	/**
	 * Resolves once the given shard should be allowed to identify.
	 */
	waitForIdentify(shardId: number): Promise<void>;
}
