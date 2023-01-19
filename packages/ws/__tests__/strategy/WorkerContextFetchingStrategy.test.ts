/* eslint-disable @typescript-eslint/consistent-type-imports */
import { REST } from '@discordjs/rest';
import { MockAgent, type Interceptable } from 'undici';
import { beforeEach, test, vi, expect } from 'vitest';
import {
	managerToFetchingStrategyOptions,
	WorkerContextFetchingStrategy,
	WebSocketManager,
	WorkerSendPayloadOp,
	WorkerReceivePayloadOp,
	type WorkerReceivePayload,
	type WorkerSendPayload,
} from '../../src/index.js';

let mockAgent: MockAgent;
let mockPool: Interceptable;

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	mockPool = mockAgent.get('https://discord.com');
});

const session = {
	shardId: 0,
	shardCount: 1,
	sequence: 123,
	sessionId: 'abc',
};

vi.mock('node:worker_threads', async () => {
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
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');
	const manager = new WebSocketManager({ token: 'A-Very-Fake-Token', intents: 0, rest });

	mockPool
		.intercept({
			path: '/api/v10/gateway/bot',
			method: 'GET',
		})
		.reply(() => ({
			data: {
				shards: 1,
				session_start_limit: {
					max_concurrency: 3,
					reset_after: 60,
					remaining: 3,
					total: 3,
				},
				url: 'wss://gateway.discord.gg',
			},
			statusCode: 200,
			responseOptions: {
				headers: {
					'content-type': 'application/json',
				},
			},
		}));

	const strategy = new WorkerContextFetchingStrategy(await managerToFetchingStrategyOptions(manager));

	strategy.updateSessionInfo(0, session);
	expect(await strategy.retrieveSessionInfo(0)).toEqual(session);
});
