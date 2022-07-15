import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { IShardingStrategy } from './IShardingStrategy';
import type { WebSocketManager } from '../../struct/WebSocketManager';
import { WebSocketShard, WebSocketShardDestroyOptions } from '../../struct/WebSocketShard';
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

	public async spawn(shardIds: number[]) {
		await this.destroy({ reason: 'User is adjusting their shards' });
		for (const shardId of shardIds) {
			// the manager purposefully implements IContextFetchingStrategy to avoid another class here
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

	public async destroy(options?: WebSocketShardDestroyOptions) {
		for (const shard of this.shards.values()) {
			await shard.destroy(options);
		}
		this.shards.clear();
	}

	public send(shardId: number, payload: GatewaySendPayload) {
		const shard = this.shards.get(shardId);
		if (!shard) throw new Error(`Shard ${shardId} not found`);
		return shard.send(payload);
	}
}
