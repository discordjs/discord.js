import { Worker } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { IShardingStrategy } from './IShardingStrategy';
import type { WebSocketManager } from '../../struct/WebSocketManager';

/**
 * Options for a {@link WorkerShardingStrategy}
 */
export interface WorkerShardingStrategyOptions {
	/**
	 * Dictates how many shards should be spawned per worker thread.
	 */
	shardsPerWorker: number | 'all';
}

/**
 * Strategy used to spawn threads in worker_threads
 */
export class WorkerShardingStrategy implements IShardingStrategy {
	private readonly manager: WebSocketManager;
	private readonly options: WorkerShardingStrategyOptions;

	private readonly workers = new Collection<number, Worker>();

	public constructor(manager: WebSocketManager, options: WorkerShardingStrategyOptions) {
		this.manager = manager;
		this.options = options;
	}

	public spawn(shardIds: number[]) {
		const shardsPerWorker = this.options.shardsPerWorker === 'all' ? shardIds.length : this.options.shardsPerWorker;

		let shards = 0;
		while (shards !== shardIds.length) {
			const slice = shardIds.slice(shards, shardsPerWorker + shards);
			// TODO(DD)
			const worker = new Worker('abc');

			for (const shardId of slice) {
				this.workers.set(shardId, worker);
			}

			shards += slice.length;
		}
	}

	public async connect() {
		for (const worker of this.workers.values()) {
		}
	}

	public async destroy() {
		for (const worker of this.workers.values()) {
		}
		this.workers.clear();
	}
}
