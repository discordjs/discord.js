import { isMainThread, parentPort, workerData } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { Awaitable } from '@discordjs/util';
import { InternalEvents } from '../Events.js';
import { WorkerContextFetchingStrategy } from '../strategies/context/WorkerContextFetchingStrategy.js';
import {
	ShardEvents,
	WorkerReceivePayloadOp,
	WorkerSendPayloadOp,
	type WorkerData,
	type WorkerReceivePayload,
	type WorkerSendPayload,
} from '../strategies/sharding/WorkerShardingStrategy.js';
import type { WebSocketShardDestroyOptions } from '../ws/WebSocketShard.js';
import { WebSocketShard } from '../ws/WebSocketShard.js';

/**
 * Options for bootstrapping the worker
 */
export interface BootstrapOptions {
	/**
	 * Shard events to just arbitrarily forward to the parent thread for the manager to emit
	 * Note: By default, this will include ALL events
	 * you most likely want to handle dispatch within the worker itself
	 */
	forwardEvents?: ShardEvents[];
	/**
	 * Function to call when a shard is created for additional setup
	 */
	shardCallback?(shard: WebSocketShard): Awaitable<void>;
}

/**
 * Utility class for bootstraping a worker thread to be used for sharding
 */
export class WorkerBootstrapper {
	/**
	 * The data passed to the worker thread
	 */
	protected readonly data = workerData as WorkerData;

	/**
	 * The shards that are managed by this worker
	 */
	protected readonly shards = new Collection<number, WebSocketShard>();

	public constructor() {
		if (isMainThread) {
			throw new Error('Expected WorkerBootstrap to not be used within the main thread');
		}
	}

	/**
	 * Helper method to initiate a shard's connection process
	 */
	protected async connect(shardId: number): Promise<void> {
		const shard = this.shards.get(shardId);
		if (!shard) {
			throw new RangeError(`Shard ${shardId} does not exist`);
		}

		await shard.connect();
	}

	/**
	 * Helper method to destroy a shard
	 */
	protected async destroy(shardId: number, options?: WebSocketShardDestroyOptions): Promise<void> {
		const shard = this.shards.get(shardId);
		if (!shard) {
			throw new RangeError(`Shard ${shardId} does not exist`);
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
						const response: WorkerReceivePayload = {
							op: WorkerReceivePayloadOp.Connected,
							shardId: payload.shardId,
						};
						parentPort!.postMessage(response);
						break;
					}

					case WorkerSendPayloadOp.Destroy: {
						await this.destroy(payload.shardId, payload.options);
						const response: WorkerReceivePayload = {
							op: WorkerReceivePayloadOp.Destroyed,
							shardId: payload.shardId,
						};

						parentPort!.postMessage(response);
						break;
					}

					case WorkerSendPayloadOp.Send: {
						const shard = this.shards.get(payload.shardId);
						if (!shard) {
							throw new RangeError(`Shard ${payload.shardId} does not exist`);
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
							op: WorkerReceivePayloadOp.FetchStatusResponse,
							status: shard.status,
							nonce: payload.nonce,
						} satisfies WorkerReceivePayload;

						parentPort!.postMessage(response);
						break;
					}
				}
			});
	}

	/**
	 * Bootstraps the worker thread with the provided options
	 */
	public async bootstrap(options: Readonly<BootstrapOptions> = {}): Promise<void> {
		// Start by initializing the shards
		for (const shardId of this.data.shardIds) {
			const shard = new WebSocketShard(new WorkerContextFetchingStrategy(this.data), shardId);

			// Any additional setup the user might want to do
			await options.shardCallback?.(shard);
			this.shards.set(shardId, shard);
		}

		// Event proxying
		for (const event of options.forwardEvents ?? Object.values(ShardEvents)) {
			const evt = InternalEvents[event];
			evt.attach((data) => {
				const payload = {
					op: WorkerReceivePayloadOp.Event,
					event,
					data,
				} satisfies WorkerReceivePayload;
				parentPort!.postMessage(payload);
			});
		}

		// Lastly, start listening to messages from the parent thread
		this.setupThreadEvents();

		const message = {
			op: WorkerReceivePayloadOp.WorkerReady,
		} satisfies WorkerReceivePayload;
		parentPort!.postMessage(message);
	}
}
