/* eslint-disable id-length */
import { setImmediate } from 'node:timers';
import { REST } from '@discordjs/rest';
import {
	GatewayDispatchEvents,
	GatewayOpcodes,
	type GatewayDispatchPayload,
	type GatewaySendPayload,
} from 'discord-api-types/v10';
import { MockAgent, type Interceptable } from 'undici';
import { beforeEach, test, vi, expect, afterEach } from 'vitest';
import {
	WebSocketManager,
	WorkerSendPayloadOp,
	WorkerReceivePayloadOp,
	WorkerShardingStrategy,
	WebSocketShardEvents,
	type WorkerReceivePayload,
	type WorkerSendPayload,
	type SessionInfo,
} from '../../src/index.js';

let mockAgent: MockAgent;
let mockPool: Interceptable;

const mockConstructor = vi.fn();
const mockSend = vi.fn();
const mockTerminate = vi.fn();

const memberChunkData = {
	op: GatewayOpcodes.Dispatch,
	s: 123,
	t: GatewayDispatchEvents.GuildMembersChunk,
	d: {
		guild_id: '123',
		members: [],
	},
} as unknown as GatewayDispatchPayload;

const sessionInfo: SessionInfo = {
	shardId: 0,
	shardCount: 2,
	sequence: 123,
	sessionId: 'abc',
	resumeURL: 'wss://ehehe.gg',
};

vi.mock('node:worker_threads', async () => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { EventEmitter }: typeof import('node:events') = await vi.importActual('node:events');
	class MockWorker extends EventEmitter {
		public constructor(...args: any[]) {
			super();
			mockConstructor(...args);
			// need to delay this by an event loop cycle to allow the strategy to attach a listener
			setImmediate(() => {
				this.emit('online');
				// same deal here
				setImmediate(() => {
					const message: WorkerReceivePayload = {
						op: WorkerReceivePayloadOp.WorkerReady,
					};
					this.emit('message', message);
				});
			});
		}

		public postMessage(message: WorkerSendPayload) {
			switch (message.op) {
				case WorkerSendPayloadOp.Connect: {
					const response: WorkerReceivePayload = {
						op: WorkerReceivePayloadOp.Connected,
						shardId: message.shardId,
					};
					this.emit('message', response);
					break;
				}

				case WorkerSendPayloadOp.Destroy: {
					const response: WorkerReceivePayload = {
						op: WorkerReceivePayloadOp.Destroyed,
						shardId: message.shardId,
					};
					this.emit('message', response);
					break;
				}

				case WorkerSendPayloadOp.Send: {
					if (message.payload.op === GatewayOpcodes.RequestGuildMembers) {
						const response: WorkerReceivePayload = {
							op: WorkerReceivePayloadOp.Event,
							shardId: message.shardId,
							event: WebSocketShardEvents.Dispatch,
							data: memberChunkData,
						};
						this.emit('message', response);

						// Fetch session info
						const sessionFetch: WorkerReceivePayload = {
							op: WorkerReceivePayloadOp.RetrieveSessionInfo,
							shardId: message.shardId,
							nonce: Math.random(),
						};
						this.emit('message', sessionFetch);
					}

					mockSend(message.shardId, message.payload);
					break;
				}

				case WorkerSendPayloadOp.SessionInfoResponse: {
					message.session ??= sessionInfo;

					const session: WorkerReceivePayload = {
						op: WorkerReceivePayloadOp.UpdateSessionInfo,
						shardId: message.session.shardId,
						session: { ...message.session, sequence: message.session.sequence + 1 },
					};
					this.emit('message', session);
					break;
				}

				case WorkerSendPayloadOp.ShardIdentifyResponse: {
					break;
				}

				case WorkerSendPayloadOp.FetchStatus: {
					break;
				}
			}
		}

		public terminate = mockTerminate;
	}

	return {
		Worker: MockWorker,
		workerData: {},
	};
});

beforeEach(() => {
	mockAgent = new MockAgent();
	mockAgent.disableNetConnect();
	mockPool = mockAgent.get('https://discord.com');
});

afterEach(() => {
	mockConstructor.mockRestore();
	mockSend.mockRestore();
	mockTerminate.mockRestore();
});

test('spawn, connect, send a message, session info, and destroy', async () => {
	const rest = new REST().setAgent(mockAgent).setToken('A-Very-Fake-Token');

	const mockRetrieveSessionInfo = vi.fn();
	const mockUpdateSessionInfo = vi.fn();
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		rest,
		shardIds: [0, 1],
		retrieveSessionInfo: mockRetrieveSessionInfo,
		updateSessionInfo: mockUpdateSessionInfo,
		buildStrategy: (manager) => new WorkerShardingStrategy(manager, { shardsPerWorker: 'all' }),
	});

	const managerEmitSpy = vi.spyOn(manager, 'emit');

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

	await manager.connect();
	expect(mockConstructor).toHaveBeenCalledWith(
		expect.stringContaining('defaultWorker.js'),
		expect.objectContaining({ workerData: expect.objectContaining({ shardIds: [0, 1] }) }),
	);

	const payload: GatewaySendPayload = {
		op: GatewayOpcodes.RequestGuildMembers,
		d: { guild_id: '123', limit: 0, query: '' },
	};
	await manager.send(0, payload);
	expect(mockSend).toHaveBeenCalledWith(0, payload);
	expect(managerEmitSpy).toHaveBeenCalledWith(WebSocketShardEvents.Dispatch, {
		...memberChunkData,
		shardId: 0,
	});
	expect(mockRetrieveSessionInfo).toHaveBeenCalledWith(0);
	expect(mockUpdateSessionInfo).toHaveBeenCalledWith(0, { ...sessionInfo, sequence: sessionInfo.sequence + 1 });

	await manager.destroy({ reason: 'souji is a soft boi :3' });
	expect(mockTerminate).toHaveBeenCalled();
});
