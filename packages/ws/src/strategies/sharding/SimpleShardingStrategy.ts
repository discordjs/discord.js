import { Collection } from '@discordjs/collection';
import type { IShardingStrategy } from './IShardingStrategy';
import type { WebSocketManager } from '../../struct/WebSocketManager';
import { WebSocketShard } from '../../struct/WebSocketShard';
import { bindShardEvents } from '../../utils/utils';

/**
 * Simple strategy that just spawns shards in the current process
 */
export class SimpleShardingStrategy implements IShardingStrategy {
	private readonly manager: WebSocketManager;
	private readonly shards = new Collection<number, WebSocketShard>();

	public constructor(manager: WebSocketManager) {
		this.manager = manager;
	}

	public spawn(shardIds: number[]) {
		for (const shardId of shardIds) {
			// the manager is purposefully assignable to IContextFetchingStrategy to avoid another class here
			const shard = new WebSocketShard(this.manager, shardId);
			bindShardEvents(this.manager, shard, shardId);
			this.shards.set(shardId, shard);
		}
	}

	public async connect() {
		for (const shard of this.shards.values()) {
			await shard.connect();
		}
	}

	public async destroy() {
		for (const shard of this.shards.values()) {
			await shard.destroy();
		}
		this.shards.clear();
	}
}
