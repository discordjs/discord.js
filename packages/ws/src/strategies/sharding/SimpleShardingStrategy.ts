import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { WebSocketManager } from '../../ws/WebSocketManager.js';
import { WebSocketShard, WebSocketShardEvents, type WebSocketShardDestroyOptions } from '../../ws/WebSocketShard.js';
import { managerToFetchingStrategyOptions } from '../context/IContextFetchingStrategy.js';
import { SimpleContextFetchingStrategy } from '../context/SimpleContextFetchingStrategy.js';
import type { IShardingStrategy } from './IShardingStrategy.js';

/**
 * Simple strategy that just spawns shards in the current process
 */
export class SimpleShardingStrategy implements IShardingStrategy {
	private readonly manager: WebSocketManager;

	private readonly shards = new Collection<number, WebSocketShard>();

	public constructor(manager: WebSocketManager) {
		this.manager = manager;
	}

	/**
	 * {@inheritDoc IShardingStrategy.spawn}
	 */
	public async spawn(shardIds: number[]) {
		const strategyOptions = await managerToFetchingStrategyOptions(this.manager);

		for (const shardId of shardIds) {
			const strategy = new SimpleContextFetchingStrategy(this.manager, strategyOptions);
			const shard = new WebSocketShard(strategy, shardId);
			for (const event of Object.values(WebSocketShardEvents)) {
				// @ts-expect-error: Intentional
				shard.on(event, (payload) => this.manager.emit(event, { ...payload, shardId }));
			}

			this.shards.set(shardId, shard);
		}
	}

	/**
	 * {@inheritDoc IShardingStrategy.connect}
	 */
	public async connect() {
		const promises = [];

		for (const shard of this.shards.values()) {
			promises.push(shard.connect());
		}

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.destroy}
	 */
	public async destroy(options?: Omit<WebSocketShardDestroyOptions, 'recover'>) {
		const promises = [];

		for (const shard of this.shards.values()) {
			promises.push(shard.destroy(options));
		}

		await Promise.all(promises);
		this.shards.clear();
	}

	/**
	 * {@inheritDoc IShardingStrategy.send}
	 */
	public async send(shardId: number, payload: GatewaySendPayload) {
		const shard = this.shards.get(shardId);
		if (!shard) {
			throw new RangeError(`Shard ${shardId} not found`);
		}

		return shard.send(payload);
	}

	/**
	 * {@inheritDoc IShardingStrategy.fetchStatus}
	 */
	public async fetchStatus() {
		return this.shards.mapValues((shard) => shard.status);
	}
}
