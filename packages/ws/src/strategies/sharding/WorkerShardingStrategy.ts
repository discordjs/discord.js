import { once } from 'node:events';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { GatewaySendPayload } from 'discord-api-types/v10';
import { IdentifyThrottler } from '../../utils/IdentifyThrottler.js';
import type { SessionInfo, WebSocketManager } from '../../ws/WebSocketManager';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents } from '../../ws/WebSocketShard';
import { managerToFetchingStrategyOptions, type FetchingStrategyOptions } from '../context/IContextFetchingStrategy.js';
import type { IShardingStrategy } from './IShardingStrategy.js';

export interface WorkerData extends FetchingStrategyOptions {
	shardIds: number[];
}

export enum WorkerSendPayloadOp {
	Connect,
	Destroy,
	Send,
	SessionInfoResponse,
	ShardCanIdentify,
}

export type WorkerSendPayload =
	| { nonce: number; op: WorkerSendPayloadOp.SessionInfoResponse; session: SessionInfo | null }
	| { nonce: number; op: WorkerSendPayloadOp.ShardCanIdentify }
	| { op: WorkerSendPayloadOp.Connect; shardId: number }
	| { op: WorkerSendPayloadOp.Destroy; options?: WebSocketShardDestroyOptions; shardId: number }
	| { op: WorkerSendPayloadOp.Send; payload: GatewaySendPayload; shardId: number };

export enum WorkerRecievePayloadOp {
	Connected,
	Destroyed,
	Event,
	RetrieveSessionInfo,
	UpdateSessionInfo,
	WaitForIdentify,
}

export type WorkerRecievePayload =
	// Can't seem to get a type-safe union based off of the event, so I'm sadly leaving data as any for now
	| { data: any; event: WebSocketShardEvents; op: WorkerRecievePayloadOp.Event; shardId: number }
	| { nonce: number; op: WorkerRecievePayloadOp.RetrieveSessionInfo; shardId: number }
	| { nonce: number; op: WorkerRecievePayloadOp.WaitForIdentify }
	| { op: WorkerRecievePayloadOp.Connected; shardId: number }
	| { op: WorkerRecievePayloadOp.Destroyed; shardId: number }
	| { op: WorkerRecievePayloadOp.UpdateSessionInfo; session: SessionInfo | null; shardId: number };

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

	#workers: Worker[] = [];

	readonly #workerByShardId = new Collection<number, Worker>();

	private readonly connectPromises = new Collection<number, () => void>();

	private readonly destroyPromises = new Collection<number, () => void>();

	private readonly throttler: IdentifyThrottler;

	public constructor(manager: WebSocketManager, options: WorkerShardingStrategyOptions) {
		this.manager = manager;
		this.throttler = new IdentifyThrottler(manager);
		this.options = options;
	}

	/**
	 * {@inheritDoc IShardingStrategy.spawn}
	 */
	public async spawn(shardIds: number[]) {
		const shardsPerWorker = this.options.shardsPerWorker === 'all' ? shardIds.length : this.options.shardsPerWorker;
		const strategyOptions = await managerToFetchingStrategyOptions(this.manager);

		let shards = 0;
		while (shards !== shardIds.length) {
			const slice = shardIds.slice(shards, shardsPerWorker + shards);
			const workerData: WorkerData = {
				...strategyOptions,
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
				.on('message', async (payload: WorkerRecievePayload) => this.onMessage(worker, payload));

			this.#workers.push(worker);
			for (const shardId of slice) {
				this.#workerByShardId.set(shardId, worker);
			}

			shards += slice.length;
		}
	}

	/**
	 * {@inheritDoc IShardingStrategy.connect}
	 */
	public async connect() {
		const promises = [];

		for (const [shardId, worker] of this.#workerByShardId.entries()) {
			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.Connect,
				shardId,
			};

			// eslint-disable-next-line no-promise-executor-return
			const promise = new Promise<void>((resolve) => this.connectPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);
		}

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.destroy}
	 */
	public async destroy(options: Omit<WebSocketShardDestroyOptions, 'recover'> = {}) {
		const promises = [];

		for (const [shardId, worker] of this.#workerByShardId.entries()) {
			const payload: WorkerSendPayload = {
				op: WorkerSendPayloadOp.Destroy,
				shardId,
				options,
			};

			promises.push(
				// eslint-disable-next-line no-promise-executor-return, promise/prefer-await-to-then
				new Promise<void>((resolve) => this.destroyPromises.set(shardId, resolve)).then(async () => worker.terminate()),
			);
			worker.postMessage(payload);
		}

		this.#workers = [];
		this.#workerByShardId.clear();

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.send}
	 */
	public send(shardId: number, data: GatewaySendPayload) {
		const worker = this.#workerByShardId.get(shardId);
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
				const resolve = this.connectPromises.get(payload.shardId)!;
				resolve();
				this.connectPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.Destroyed: {
				const resolve = this.destroyPromises.get(payload.shardId)!;
				resolve();
				this.destroyPromises.delete(payload.shardId);
				break;
			}

			case WorkerRecievePayloadOp.Event: {
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

			case WorkerRecievePayloadOp.WaitForIdentify: {
				await this.throttler.waitForIdentify();
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.ShardCanIdentify,
					nonce: payload.nonce,
				};
				worker.postMessage(response);
				break;
			}
		}
	}
}
