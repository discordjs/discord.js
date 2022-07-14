import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import { WorkerData, WorkerRecievePayload, WorkerSendPayload, WorkerSendPayloadOp } from './WorkerShardingStrategy';
import { WebSocketShard, WebSocketShardEvents } from '../../struct/WebSocketShard';

if (isMainThread) {
	throw new Error('Expected worker script to not be ran within the main thread');
}

const data = workerData as WorkerData;
const shards = new Collection<number, WebSocketShard>();

async function connect() {
	for (const shard of shards.values()) {
		await shard.connect();
	}
}

async function destroy() {
	for (const shard of shards.values()) {
		await shard.destroy();
	}
	shards.clear();
}

async function spawn() {
	await destroy();
	for (const shardId of data.shardIds) {
		const shard = new WebSocketShard({}, shardId);
		for (const event of Object.values(WebSocketShardEvents)) {
			// @ts-expect-error
			shard.on(event, (data) => {
				const payload: WorkerRecievePayload = {
					event,
					data,
					shardId,
				};
				parentPort!.postMessage(payload);
			});
		}
		shards.set(shardId, shard);
	}
}

// TODO(DD): Deal with other events
// eslint-disable-next-line @typescript-eslint/no-misused-promises
parentPort!.on('message', async (payload: WorkerSendPayload) => {
	switch (payload.op) {
		case WorkerSendPayloadOp.spawn: {
			await spawn();
			break;
		}

		case WorkerSendPayloadOp.connect: {
			await connect();
			break;
		}

		case WorkerSendPayloadOp.destroy: {
			await destroy();
			break;
		}

		case WorkerSendPayloadOp.send: {
			const shard = shards.get(payload.shardId);
			// TODO(DD): Figure out how to deal with the shard not being found; the upper strategy should throw in this case
			await shard?.send(payload.payload);
			break;
		}
	}
});
