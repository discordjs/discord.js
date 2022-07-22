import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { Awaitable } from '../../utils/utils';
import type { WebSocketShardDestroyOptions } from '../../ws/WebSocketShard';

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
	connect: () => Awaitable<void>;
	/**
	 * Destroys all the shards
	 */
	destroy: (options?: Omit<WebSocketShardDestroyOptions, 'recover'>) => Awaitable<void>;
	/**
	 * Sends a payload to a shard
	 */
	send: (shardId: number, payload: GatewaySendPayload) => Awaitable<void>;
}
