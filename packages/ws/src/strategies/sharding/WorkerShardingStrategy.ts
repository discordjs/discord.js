import { once } from 'node:events';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { IShardingStrategy } from './IShardingStrategy';
import type { SessionInfo, WebSocketManager } from '../../struct/WebSocketManager';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents } from '../../struct/WebSocketShard';
import { IdentifyThrottler } from '../../utils/IdentifyThrottler';
import { FetchingStrategyOptions, managerToFetchingStrategyOptions } from '../context/IContextFetchingStrategy';

export interface WorkerData extends FetchingStrategyOptions {
	shardIds: number[];
}

export enum WorkerSendPayloadOp {
	connect,
	destroy,
	send,
	sessionInfoResponse,
}

export type WorkerSendPayload =
	| { op: WorkerSendPayloadOp.connect; shardId: number }
	| { op: WorkerSendPayloadOp.destroy; shardId: number; options?: WebSocketShardDestroyOptions }
	| { op: WorkerSendPayloadOp.send; shardId: number; payload: GatewaySendPayload }
	| { op: WorkerSendPayloadOp.sessionInfoResponse; nonce: number; session: SessionInfo | null };

export enum WorkerRecievePayloadOp {
	connected,
	destroyed,
	event,
	retrieveSessionInfo,
	updateSessionInfo,
}

export type WorkerRecievePayload =
	| { op: WorkerRecievePayloadOp.connected; shardId: number }
	| { op: WorkerRecievePayloadOp.destroyed; shardId: number }
	// Can't seem to get a type-safe union based off of the event, so I'm sadly leaving data as any for now
	| { op: WorkerRecievePayloadOp.event; shardId: number; event: WebSocketShardEvents; data: any }
	| { op: WorkerRecievePayloadOp.retrieveSessionInfo; shardId: number; nonce: number }
	| { op: WorkerRecievePayloadOp.updateSessionInfo; shardId: number; session: SessionInfo | null };

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

	private workers: Worker[] = [];
	private readonly workerByShardId = new Collection<number, Worker>();

	private readonly connectPromises = new Collection<number, () => void>();
	private readonly destroyPromises = new Collection<number, () => void>();

	private readonly throttler: IdentifyThrottler;

	public constructor(manager: WebSocketManager, options: WorkerShardingStrategyOptions) {
		this.manager = manager;
		this.throttler = new IdentifyThrottler(manager);
		this.options = options;
	}

	public async spawn(shardIds: number[]) {
		await this.destroy({ reason: 'User is adjusting their shards' });
		const shardsPerWorker = this.options.shardsPerWorker === 'all' ? shardIds.length : this.options.shardsPerWorker;

		let shards = 0;
		while (shards !== shardIds.length) {
			const slice = shardIds.slice(shards, shardsPerWorker + shards);
			const workerData: WorkerData = {
				...(await managerToFetchingStrategyOptions(this.manager)),
				shardIds: slice,
			};

			const worker = new Worker(join(__dirname, 'worker'), { workerData });
			await once(worker, 'online');
			worker
				.on('error', (err) => {
					throw err;
				})
				.on('messageerror', (err) => {
					throw err;
				})
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				.on('message', (payload: WorkerRecievePayload) => this.onMessage(worker, payload));

			this.workers.push(worker);
			for (const shardId of slice) {
				this.workerByShardId.set(shardId, worker);
			}

			shards += slice.length;
		}
	}

	public async connect() {
		const promises = [];

		for (const [shardId, worker] of this.workerByShardId.entries()) {
			await this.throttler.waitForIdentify();

			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.connect,
				shardId,
			};

			const promise = new Promise<void>((resolve) => this.connectPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);
		}

		await Promise.all(promises);
	}

	public async destroy(options: WebSocketShardDestroyOptions = {}) {
		const promises = [];

		for (const [shardId, worker] of this.workerByShardId.entries()) {
			if (options.recover !== undefined) {
				await this.throttler.waitForIdentify();
			}

			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.destroy,
				shardId,
				options,
			};

			const promise = new Promise<void>((resolve) => this.destroyPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);

			if (options.recover === undefined) {
				await worker.terminate();
			}
		}

		if (options.recover === undefined) {
			this.workers = [];
			this.workerByShardId.clear();
		}

		await Promise.all(promises);
	}

	public send(shardId: number, data: GatewaySendPayload) {
		const worker = this.workerByShardId.get(shardId);
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

	private async onMessage(worker: Worker, payload: WorkerRecievePayload) {
		switch (payload.op) {
			case WorkerRecievePayloadOp.connected: {
				const resolve = this.connectPromises.get(payload.shardId);
				if (!resolve) {
					throw new Error(`No connect promise found for shard ${payload.shardId}`);
				}

				resolve();
				this.connectPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.destroyed: {
				const resolve = this.destroyPromises.get(payload.shardId);
				if (!resolve) {
					throw new Error(`No destroy promise found for shard ${payload.shardId}`);
				}

				resolve();
				this.destroyPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.event: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				this.manager.emit(payload.event, { ...payload.data, shardId: payload.shardId });
				break;
			}

			case WorkerRecievePayloadOp.retrieveSessionInfo: {
				const session = await this.manager.options.retrieveSessionInfo(payload.shardId);
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.sessionInfoResponse,
					nonce: payload.nonce,
					session,
				};
				worker.postMessage(response);
				break;
			}

			case WorkerRecievePayloadOp.updateSessionInfo: {
				await this.manager.options.updateSessionInfo(payload.shardId, payload.session);
				break;
			}
		}
	}
}
