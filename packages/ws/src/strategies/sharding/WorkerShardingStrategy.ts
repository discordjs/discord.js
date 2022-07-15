import { Worker } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { IShardingStrategy } from './IShardingStrategy';
import type { WebSocketManager } from '../../struct/WebSocketManager';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents } from '../../struct/WebSocketShard';

export interface WorkerData {
	token: string;
	shardIds: number[];
}

export enum WorkerSendPayloadOp {
	spawn,
	connect,
	destroy,
	send,
}

export type WorkerSendPayload =
	| { op: WorkerSendPayloadOp.spawn }
	| { op: WorkerSendPayloadOp.connect }
	| { op: WorkerSendPayloadOp.destroy; options?: WebSocketShardDestroyOptions }
	| { op: WorkerSendPayloadOp.send; shardId: number; payload: GatewaySendPayload };

// Can't seem to get a type-safe union based off of the event, so I'm sadly leaving data as any for now
export interface WorkerRecievePayload {
	shardId: number;
	event: WebSocketShardEvents;
	data: any;
}

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
		this.destroy({ reason: 'User is adjusting their shards' });
		const shardsPerWorker = this.options.shardsPerWorker === 'all' ? shardIds.length : this.options.shardsPerWorker;

		let shards = 0;
		while (shards !== shardIds.length) {
			const slice = shardIds.slice(shards, shardsPerWorker + shards);
			const workerData: WorkerData = {
				token: this.manager.options.token,
				shardIds: slice,
			};
			// TODO(DD): Deal with events other than message
			const worker = new Worker('./worker', { workerData });
			worker.on('message', (payload: WorkerRecievePayload) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				this.manager.emit(payload.event, { ...payload.data, shardId: payload.shardId });
			});

			for (const shardId of slice) {
				this.workers.set(shardId, worker);
			}

			shards += slice.length;
		}
	}

	public connect() {
		for (const worker of this.workers.values()) {
			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.connect,
			};
			worker.postMessage(payload);
		}
	}

	public destroy(options: WebSocketShardDestroyOptions = {}) {
		for (const worker of this.workers.values()) {
			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.destroy,
				options,
			};
			worker.postMessage(payload);
		}
		this.workers.clear();
	}

	public send(shardId: number, data: GatewaySendPayload) {
		const worker = this.workers.get(shardId);
		if (!worker) {
			throw new Error(`No worker found for shard ${shardId}`);
		}

		const payload: WorkerSendPayload = {
			op: WorkerSendPayloadOp.send,
			shardId,
			payload: data,
		};
		worker.postMessage(payload);
	}
}
