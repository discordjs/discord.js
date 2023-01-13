import { isMainThread, parentPort } from 'node:worker_threads';
import { Collection } from '@discordjs/collection';
import type { SessionInfo } from '../../ws/WebSocketManager.js';
import {
	WorkerReceivePayloadOp,
	WorkerSendPayloadOp,
	type WorkerReceivePayload,
	type WorkerSendPayload,
} from '../sharding/WorkerShardingStrategy.js';
import type { FetchingStrategyOptions, IContextFetchingStrategy } from './IContextFetchingStrategy.js';

export class WorkerContextFetchingStrategy implements IContextFetchingStrategy {
	private readonly sessionPromises = new Collection<number, (session: SessionInfo | null) => void>();

	private readonly waitForIdentifyPromises = new Collection<number, () => void>();

	public constructor(public readonly options: FetchingStrategyOptions) {
		if (isMainThread) {
			throw new Error('Cannot instantiate WorkerContextFetchingStrategy on the main thread');
		}

		parentPort!.on('message', (payload: WorkerSendPayload) => {
			if (payload.op === WorkerSendPayloadOp.SessionInfoResponse) {
				this.sessionPromises.get(payload.nonce)?.(payload.session);
				this.sessionPromises.delete(payload.nonce);
			}

			if (payload.op === WorkerSendPayloadOp.ShardCanIdentify) {
				this.waitForIdentifyPromises.get(payload.nonce)?.();
				this.waitForIdentifyPromises.delete(payload.nonce);
			}
		});
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		const nonce = Math.random();
		const payload = {
			op: WorkerReceivePayloadOp.RetrieveSessionInfo,
			shardId,
			nonce,
		} satisfies WorkerReceivePayload;
		// eslint-disable-next-line no-promise-executor-return
		const promise = new Promise<SessionInfo | null>((resolve) => this.sessionPromises.set(nonce, resolve));
		parentPort!.postMessage(payload);
		return promise;
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		const payload = {
			op: WorkerReceivePayloadOp.UpdateSessionInfo,
			shardId,
			session: sessionInfo,
		} satisfies WorkerReceivePayload;
		parentPort!.postMessage(payload);
	}

	public async waitForIdentify(): Promise<void> {
		const nonce = Math.random();
		const payload = {
			op: WorkerReceivePayloadOp.WaitForIdentify,
			nonce,
		} satisfies WorkerReceivePayload;
		// eslint-disable-next-line no-promise-executor-return
		const promise = new Promise<void>((resolve) => this.waitForIdentifyPromises.set(nonce, resolve));
		parentPort!.postMessage(payload);
		return promise;
	}
}
