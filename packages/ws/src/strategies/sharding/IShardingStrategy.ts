import type { Awaitable } from '../../utils/utils';

/**
 * Strategies responsible for spawning, initializing connections, destroying shards, and relaying events
 */
export interface IShardingStrategy {
	/**
	 * Spawns all the shards
	 */
	spawn: (shardIds: number[]) => Awaitable<void>;
	/**
	 * Initializes all the shards
	 */
	connect: () => Promise<void>;
	/**
	 * Destroys all the shards
	 */
	destroy: () => Promise<void>;
}
