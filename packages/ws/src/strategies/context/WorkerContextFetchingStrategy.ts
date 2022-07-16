import { isMainThread, parentPort } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy';
import type { SessionInfo } from '../../ws/WebSocketManager';
import {
	WorkerRecievePayload,
	WorkerRecievePayloadOp,
	WorkerSendPayload,
	WorkerSendPayloadOp,
} from '../sharding/WorkerShardingStrategy';

export class WorkerContextFetchingStrategy implements IContextFetchingStrategy {
	private readonly sessionPromises = new Collection<number, (session: SessionInfo | null) => void>();

	public constructor(public readonly options: FetchingStrategyOptions) {
		if (isMainThread) {
			throw new Error('Cannot instantiate WorkerContextFetchingStrategy on the main thread');
		}

		parentPort!.on('message', (payload: WorkerSendPayload) => {
			if (payload.op === WorkerSendPayloadOp.sessionInfoResponse) {
				const resolve = this.sessionPromises.get(payload.nonce);
				resolve?.(payload.session);
				this.sessionPromises.delete(payload.nonce);
			}
		});
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		const nonce = Math.random();
		const payload: WorkerRecievePayload = {
			op: WorkerRecievePayloadOp.retrieveSessionInfo,
			shardId,
			nonce,
		};
		const promise = new Promise<SessionInfo | null>((resolve) => this.sessionPromises.set(nonce, resolve));
		parentPort!.postMessage(payload);
		return promise;
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		const payload: WorkerRecievePayload = {
			op: WorkerRecievePayloadOp.updateSessionInfo,
			shardId,
			session: sessionInfo,
		};
		parentPort!.postMessage(payload);
	}
}
