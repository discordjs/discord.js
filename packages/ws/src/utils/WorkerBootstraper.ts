import { isMainThread, parentPort, workerData } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { Awaitable } from '@discordjs/util';
import { WorkerContextFetchingStrategy } from '../strategies/context/WorkerContextFetchingStrategy.js';
import {
	WorkerRecievePayloadOp,
	WorkerSendPayloadOp,
	type WorkerData,
	type WorkerRecievePayload,
	type WorkerSendPayload,
} from '../strategies/sharding/WorkerShardingStrategy.js';
import type { WebSocketShardDestroyOptions } from '../ws/WebSocketShard.js';
import { WebSocketShardEvents, WebSocketShard } from '../ws/WebSocketShard.js';

/**
 * Options for bootstrapping the worker
 */
export interface BootstrapOptions {
	/**
	 * Shard events to just arbitrarily forward to the parent thread for the manager to emit
	 * Note: By default, this will include ALL events
	 * you most likely want to handle dispatch within the worker itself
	 */
	forwardEvents?: WebSocketShardEvents[];
	/**
	 * Function to call when a shard is created for additional setup
	 */
	shardCallback?(shardId: number, shard: WebSocketShard): Awaitable<void>;
}

/**
 * Utility class for bootstraping a worker thread to be used for sharding
 */
export class WorkerBootstraper {
	/**
	 * The data passed to the worker thread
	 */
	protected readonly data = workerData as WorkerData;

	/**
	 * The shards that are managed by this worker
	 */
	protected readonly shards = new Collection<number, WebSocketShard>();

	/**
	 * Helper method to initiate a shard's connection process
	 */
	protected async connect(shardId: number): Promise<void> {
		const shard = this.shards.get(shardId);
		if (!shard) {
			throw new Error(`Shard ${shardId} does not exist`);
		}

		await shard.connect();
	}

	/**
	 * Helper method to destroy a shard
	 */
	protected async destroy(shardId: number, options?: WebSocketShardDestroyOptions): Promise<void> {
		const shard = this.shards.get(shardId);
		if (!shard) {
			throw new Error(`Shard ${shardId} does not exist`);
		}

		await shard.destroy(options);
	}

	/**
	 * Helper method to attach event listeners to the parentPort
	 */
	protected setupThreadEvents(): void {
		parentPort!
			.on('messageerror', (err) => {
				throw err;
			})
			.on('message', async (payload: WorkerSendPayload) => {
				switch (payload.op) {
					case WorkerSendPayloadOp.Connect: {
						await this.connect(payload.shardId);
						const response: WorkerRecievePayload = {
							op: WorkerRecievePayloadOp.Connected,
							shardId: payload.shardId,
						};
						parentPort!.postMessage(response);
						break;
					}

					case WorkerSendPayloadOp.Destroy: {
						await this.destroy(payload.shardId, payload.options);
						const response: WorkerRecievePayload = {
							op: WorkerRecievePayloadOp.Destroyed,
							shardId: payload.shardId,
						};

						parentPort!.postMessage(response);
						break;
					}

					case WorkerSendPayloadOp.Send: {
						const shard = this.shards.get(payload.shardId);
						if (!shard) {
							throw new Error(`Shard ${payload.shardId} does not exist`);
						}

						await shard.send(payload.payload);
						break;
					}

					case WorkerSendPayloadOp.SessionInfoResponse: {
						break;
					}

					case WorkerSendPayloadOp.ShardCanIdentify: {
						break;
					}

					case WorkerSendPayloadOp.FetchStatus: {
						const shard = this.shards.get(payload.shardId);
						if (!shard) {
							throw new Error(`Shard ${payload.shardId} does not exist`);
						}

						const response = {
							op: WorkerRecievePayloadOp.FetchStatusResponse,
							status: shard.status,
							nonce: payload.nonce,
						} satisfies WorkerRecievePayload;

						parentPort!.postMessage(response);
						break;
					}
				}
			});
	}

	/**
	 * Bootstraps the worker thread with the provided options
	 */
	public async bootstrap(options: BootstrapOptions = {}): Promise<void> {
		options.forwardEvents ??= Object.values(WebSocketShardEvents);

		if (isMainThread) {
			throw new Error('Expected WorkerBootstrap to not be used within the main thread');
		}

		// Start by initializing the shards
		for (const shardId of this.data.shardIds) {
			const shard = new WebSocketShard(new WorkerContextFetchingStrategy(this.data), shardId);
			for (const event of options.forwardEvents) {
				// @ts-expect-error: Event types incompatible
				shard.on(event, (data) => {
					const payload = {
						op: WorkerRecievePayloadOp.Event,
						event,
						data,
						shardId,
					} satisfies WorkerRecievePayload;
					parentPort!.postMessage(payload);
				});
			}

			// Any additional setup the user might want to do
			await options.shardCallback?.(shardId, shard);
			this.shards.set(shardId, shard);
		}

		// Lastly, start listening to messages from the parent thread
		this.setupThreadEvents();

		const message = {
			op: WorkerRecievePayloadOp.WorkerReady,
		} satisfies WorkerRecievePayload;
		parentPort!.postMessage(message);
	}
}
