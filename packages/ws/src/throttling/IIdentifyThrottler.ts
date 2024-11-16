/**
 * IdentifyThrottlers are responsible for dictating when a shard is allowed to identify.
 *
 * @see {@link https://discord.com/developers/docs/topics/gateway#sharding-max-concurrency}
 */
export interface IIdentifyThrottler {
	/**
	 * Resolves once the given shard should be allowed to identify, or rejects if the operation was aborted.
	 */
	waitForIdentify(shardId: number, signal: AbortSignal): Promise<void>;
}
