import { once } from 'node:events';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import type { IShardingStrategy } from './IShardingStrategy';
import { IdentifyThrottler } from '../../utils/IdentifyThrottler';
import type { SessionInfo, WebSocketManager } from '../../ws/WebSocketManager';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents } from '../../ws/WebSocketShard';
import { FetchingStrategyOptions, managerToFetchingStrategyOptions } from '../context/IContextFetchingStrategy';

export interface WorkerData extends FetchingStrategyOptions {
	shardIds: number[];
}

export enum WorkerSendPayloadOp {
	Connect,
	Destroy,
	Send,
	SessionInfoResponse,
}

export type WorkerSendPayload =
	| { op: WorkerSendPayloadOp.Connect; shardId: number }
	| { op: WorkerSendPayloadOp.Destroy; shardId: number; options?: WebSocketShardDestroyOptions }
	| { op: WorkerSendPayloadOp.Send; shardId: number; payload: GatewaySendPayload }
	| { op: WorkerSendPayloadOp.SessionInfoResponse; nonce: number; session: SessionInfo | null };

export enum WorkerRecievePayloadOp {
	Connected,
	Destroyed,
	Event,
	RetrieveSessionInfo,
	UpdateSessionInfo,
}

export type WorkerRecievePayload =
	| { op: WorkerRecievePayloadOp.Connected; shardId: number }
	| { op: WorkerRecievePayloadOp.Destroyed; shardId: number }
	// Can't seem to get a type-safe union based off of the event, so I'm sadly leaving data as any for now
	| { op: WorkerRecievePayloadOp.Event; shardId: number; event: WebSocketShardEvents; data: any }
	| { op: WorkerRecievePayloadOp.RetrieveSessionInfo; shardId: number; nonce: number }
	| { op: WorkerRecievePayloadOp.UpdateSessionInfo; shardId: number; session: SessionInfo | null };

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
		const shardsPerWorker = this.options.shardsPerWorker === 'all' ? shardIds.length : this.options.shardsPerWorker;

		let shards = 0;
		while (shards !== shardIds.length) {
			const slice = shardIds.slice(shards, shardsPerWorker + shards);
			const workerData: WorkerData = {
				...(await managerToFetchingStrategyOptions(this.manager)),
				shardIds: slice,
			};

			const worker = new Worker(join(__dirname, 'worker.js'), { workerData });
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
				op: WorkerSendPayloadOp.Connect,
				shardId,
			};

			const promise = new Promise<void>((resolve) => this.connectPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);
		}

		await Promise.all(promises);
	}

	public async destroy(options: Omit<WebSocketShardDestroyOptions, 'recover'> = {}) {
		const promises = [];

		for (const [shardId, worker] of this.workerByShardId.entries()) {
			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.Destroy,
				shardId,
				options,
			};

			const promise = new Promise<void>((resolve) => this.destroyPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);

			await worker.terminate();
		}

		this.workers = [];
		this.workerByShardId.clear();

		await Promise.all(promises);
	}

	public send(shardId: number, data: GatewaySendPayload) {
		const worker = this.workerByShardId.get(shardId);
		if (!worker) {
			throw new Error(`No worker found for shard ${shardId}`);
		}

		const payload: WorkerSendPayload = {
			op: WorkerSendPayloadOp.Send,
			shardId,
			payload: data,
		};
		worker.postMessage(payload);
	}

	private async onMessage(worker: Worker, payload: WorkerRecievePayload) {
		switch (payload.op) {
			case WorkerRecievePayloadOp.Connected: {
				const resolve = this.connectPromises.get(payload.shardId);
				if (!resolve) {
					throw new Error(`No connect promise found for shard ${payload.shardId}`);
				}

				resolve();
				this.connectPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.Destroyed: {
				const resolve = this.destroyPromises.get(payload.shardId);
				if (!resolve) {
					throw new Error(`No destroy promise found for shard ${payload.shardId}`);
				}

				resolve();
				this.destroyPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.Event: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				this.manager.emit(payload.event, { ...payload.data, shardId: payload.shardId });
				break;
			}

			case WorkerRecievePayloadOp.RetrieveSessionInfo: {
				const session = await this.manager.options.retrieveSessionInfo(payload.shardId);
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.SessionInfoResponse,
					nonce: payload.nonce,
					session,
				};
				worker.postMessage(response);
				break;
			}

			case WorkerRecievePayloadOp.UpdateSessionInfo: {
				await this.manager.options.updateSessionInfo(payload.shardId, payload.session);
				break;
			}
		}
	}
}
