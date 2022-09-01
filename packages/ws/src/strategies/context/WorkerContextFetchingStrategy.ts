/* eslint-disable unicorn/require-post-message-target-origin */
import { isMainThread, parentPort } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { SessionInfo } from '../../ws/WebSocketManager.js';
import {
	WorkerRecievePayloadOp,
	WorkerSendPayloadOp,
	type WorkerRecievePayload,
	type WorkerSendPayload,
} from '../sharding/WorkerShardingStrategy.js';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy.js';

export class WorkerContextFetchingStrategy implements IContextFetchingStrategy {
	private readonly sessionPromises = new Collection<number, (session: SessionInfo | null) => void>();

	public constructor(public readonly options: FetchingStrategyOptions) {
		if (isMainThread) {
			throw new Error('Cannot instantiate WorkerContextFetchingStrategy on the main thread');
		}

		parentPort!.on('message', (payload: WorkerSendPayload) => {
			if (payload.op === WorkerSendPayloadOp.SessionInfoResponse) {
				const resolve = this.sessionPromises.get(payload.nonce);
				resolve?.(payload.session);
				this.sessionPromises.delete(payload.nonce);
			}
		});
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		const nonce = Math.random();
		const payload: WorkerRecievePayload = {
			op: WorkerRecievePayloadOp.RetrieveSessionInfo,
			shardId,
			nonce,
		};
		// eslint-disable-next-line no-promise-executor-return
		const promise = new Promise<SessionInfo | null>((resolve) => this.sessionPromises.set(nonce, resolve));
		parentPort!.postMessage(payload);
		return promise;
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		const payload: WorkerRecievePayload = {
			op: WorkerRecievePayloadOp.UpdateSessionInfo,
			shardId,
			session: sessionInfo,
		};
		parentPort!.postMessage(payload);
	}
}
