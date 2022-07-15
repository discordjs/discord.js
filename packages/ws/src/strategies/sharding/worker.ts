import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import {
	WorkerData,
	WorkerRecievePayload,
	WorkerRecievePayloadOp,
	WorkerSendPayload,
	WorkerSendPayloadOp,
} from './WorkerShardingStrategy';
import { WebSocketShard, WebSocketShardDestroyOptions, WebSocketShardEvents } from '../../struct/WebSocketShard';
import { WorkerContextFetchingStrategy } from '../context/WorkerContextFetchingStrategy';

if (isMainThread) {
	throw new Error('Expected worker script to not be ran within the main thread');
}

const data = workerData as WorkerData;
const shards = new Collection<number, WebSocketShard>();

async function connect(shardId: number) {
	const shard = shards.get(shardId);
	if (!shard) {
		throw new Error(`Shard ${shardId} does not exist`);
	}
	await shard.connect();
}

async function destroy(shardId: number, options?: WebSocketShardDestroyOptions) {
	const shard = shards.get(shardId);
	if (!shard) {
		throw new Error(`Shard ${shardId} does not exist`);
	}
	await shard.destroy(options);
}

for (const shardId of data.shardIds) {
	const shard = new WebSocketShard(new WorkerContextFetchingStrategy(data), shardId);
	for (const event of Object.values(WebSocketShardEvents)) {
		// @ts-expect-error
		shard.on(event, (data) => {
			const payload: WorkerRecievePayload = {
				op: WorkerRecievePayloadOp.event,
				event,
				data,
				shardId,
			};
			parentPort!.postMessage(payload);
		});
	}
	shards.set(shardId, shard);
}

parentPort!
	.on('messageerror', (err) => {
		throw err;
	})
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	.on('message', async (payload: WorkerSendPayload) => {
		switch (payload.op) {
			case WorkerSendPayloadOp.connect: {
				await connect(payload.shardId);
				const response: WorkerRecievePayload = {
					op: WorkerRecievePayloadOp.connected,
					shardId: payload.shardId,
				};
				parentPort!.postMessage(response);
				break;
			}

			case WorkerSendPayloadOp.destroy: {
				await destroy(payload.shardId, payload.options);
				const response: WorkerRecievePayload = {
					op: WorkerRecievePayloadOp.destroyed,
					shardId: payload.shardId,
				};
				parentPort!.postMessage(response);
				break;
			}

			case WorkerSendPayloadOp.send: {
				const shard = shards.get(payload.shardId);
				if (!shard) {
					throw new Error(`Shard ${payload.shardId} does not exist`);
				}
				await shard.send(payload.payload);
				break;
			}

			case WorkerSendPayloadOp.sessionInfoResponse: {
				break;
			}
		}
	});
