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

	private readonly waitForIdentifyPromises = new Collection<
		number,
		{ reject(error: unknown): void; resolve(): void; signal: AbortSignal }
	>();

	public constructor(public readonly options: FetchingStrategyOptions) {
		if (isMainThread) {
			throw new Error('Cannot instantiate WorkerContextFetchingStrategy on the main thread');
		}

		parentPort!.on('message', (payload: WorkerSendPayload) => {
			if (payload.op === WorkerSendPayloadOp.SessionInfoResponse) {
				this.sessionPromises.get(payload.nonce)?.(payload.session);
				this.sessionPromises.delete(payload.nonce);
			}

			if (payload.op === WorkerSendPayloadOp.ShardIdentifyResponse) {
				const promise = this.waitForIdentifyPromises.get(payload.nonce);
				if (payload.ok) {
					promise?.resolve();
				} else {
					// We need to make sure we reject with an abort error
					promise?.reject(promise.signal.reason);
				}

				this.waitForIdentifyPromises.delete(payload.nonce);
			}
		});
	}

	public async retrieveSessionInfo(shardId: number): Promise<SessionInfo | null> {
		const nonce = Math.random();
		const payload: WorkerReceivePayload = {
			op: WorkerReceivePayloadOp.RetrieveSessionInfo,
			shardId,
			nonce,
		};
		// eslint-disable-next-line no-promise-executor-return
		const promise = new Promise<SessionInfo | null>((resolve) => this.sessionPromises.set(nonce, resolve));
		parentPort!.postMessage(payload);
		return promise;
	}

	public updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null) {
		const payload: WorkerReceivePayload = {
			op: WorkerReceivePayloadOp.UpdateSessionInfo,
			shardId,
			session: sessionInfo,
		};
		parentPort!.postMessage(payload);
	}

	public async waitForIdentify(shardId: number, signal: AbortSignal): Promise<void> {
		const nonce = Math.random();

		const payload: WorkerReceivePayload = {
			op: WorkerReceivePayloadOp.WaitForIdentify,
			nonce,
			shardId,
		};
		const promise = new Promise<void>((resolve, reject) =>
			// eslint-disable-next-line no-promise-executor-return
			this.waitForIdentifyPromises.set(nonce, { signal, resolve, reject }),
		);

		parentPort!.postMessage(payload);

		const listener = () => {
			const payload: WorkerReceivePayload = {
				op: WorkerReceivePayloadOp.CancelIdentify,
				nonce,
			};

			parentPort!.postMessage(payload);
		};

		signal.addEventListener('abort', listener);

		try {
			await promise;
		} finally {
			signal.removeEventListener('abort', listener);
		}
	}
}
