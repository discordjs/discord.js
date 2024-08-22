import type { Collection } from '@discordjs/collection';
import type { Awaitable } from '@discordjs/util';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { WebSocketShardDestroyOptions, WebSocketShardStatus } from '../../ws/WebSocketShard.js';

/**
 * Strategies responsible for spawning, initializing connections, destroying shards, and relaying events
 */
export interface IShardingStrategy {
	/**
	 * Initializes all the shards
	 */
	connect(): Awaitable<void>;
	/**
	 * Destroys all the shards
	 */
	destroy(options?: Omit<WebSocketShardDestroyOptions, 'recover'>): Awaitable<void>;
	/**
	 * Fetches the status of all the shards
	 */
	fetchStatus(): Awaitable<Collection<number, WebSocketShardStatus>>;
	/**
	 * Sends a payload to a shard
	 */
	send(shardId: number, payload: GatewaySendPayload): Awaitable<void>;
	/**
	 * Spawns all the shards
	 */
	spawn(shardIds: number[]): Awaitable<void>;
}
