import { test, vi, expect } from 'vitest';
import {
	managerToFetchingStrategyOptions,
	WorkerContextFetchingStrategy,
	WebSocketManager,
	WorkerSendPayloadOp,
	WorkerReceivePayloadOp,
	type WorkerReceivePayload,
	type WorkerSendPayload,
	type SessionInfo,
} from '../../src/index.js';
import { mockGatewayInformation } from '../gateway.mock.js';

const session: SessionInfo = {
	shardId: 0,
	shardCount: 1,
	sequence: 123,
	sessionId: 'abc',
	resumeURL: 'wss://resume.url/',
};

vi.mock('node:worker_threads', async () => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { EventEmitter }: typeof import('node:events') = await vi.importActual('node:events');
	class MockParentPort extends EventEmitter {
		public postMessage(message: WorkerReceivePayload) {
			if (message.op === WorkerReceivePayloadOp.RetrieveSessionInfo) {
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.SessionInfoResponse,
					nonce: message.nonce,
					session,
				};
				this.emit('message', response);
			}
		}
	}

	return {
		parentPort: new MockParentPort(),
		isMainThread: false,
		workerData: {},
	};
});

test('session info', async () => {
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		async fetchGatewayInformation() {
			return mockGatewayInformation;
		},
	});

	const strategy = new WorkerContextFetchingStrategy(await managerToFetchingStrategyOptions(manager));

	strategy.updateSessionInfo(0, session);
	expect(await strategy.retrieveSessionInfo(0)).toEqual(session);
});
