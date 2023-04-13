/* eslint-disable id-length */
import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'node:timers';
import { setTimeout as sleep } from 'node:timers/promises';
import { URLSearchParams } from 'node:url';
import { TextDecoder } from 'node:util';
import { inflate } from 'node:zlib';
import { Collection } from '@discordjs/collection';
import { lazy } from '@discordjs/util';
import { AsyncQueue } from '@sapphire/async-queue';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
	GatewayCloseCodes,
	GatewayDispatchEvents,
	GatewayOpcodes,
	type GatewayDispatchPayload,
	type GatewayIdentifyData,
	type GatewayReadyDispatchData,
	type GatewayReceivePayload,
	type GatewaySendPayload,
} from 'discord-api-types/v10';
import { WebSocket, type RawData } from 'ws';
import type { Inflate } from 'zlib-sync';
import type { IContextFetchingStrategy } from '../strategies/context/IContextFetchingStrategy';
import { ImportantGatewayOpcodes, getInitialSendRateLimitState } from '../utils/constants.js';
import type { SessionInfo } from './WebSocketManager.js';

// eslint-disable-next-line promise/prefer-await-to-then
const getZlibSync = lazy(async () => import('zlib-sync').then((mod) => mod.default).catch(() => null));

export enum WebSocketShardEvents {
	Closed = 'closed',
	Debug = 'debug',
	Dispatch = 'dispatch',
	Error = 'error',
	HeartbeatComplete = 'heartbeat',
	Hello = 'hello',
	Ready = 'ready',
	Resumed = 'resumed',
}

export enum WebSocketShardStatus {
	Idle,
	Connecting,
	Resuming,
	Ready,
}

export enum WebSocketShardDestroyRecovery {
	Reconnect,
	Resume,
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type WebSocketShardEventsMap = {
	[WebSocketShardEvents.Closed]: [{ code: number }];
	[WebSocketShardEvents.Debug]: [payload: { message: string }];
	[WebSocketShardEvents.Dispatch]: [payload: { data: GatewayDispatchPayload }];
	[WebSocketShardEvents.Error]: [payload: { error: Error }];
	[WebSocketShardEvents.Hello]: [];
	[WebSocketShardEvents.Ready]: [payload: { data: GatewayReadyDispatchData }];
	[WebSocketShardEvents.Resumed]: [];
	[WebSocketShardEvents.HeartbeatComplete]: [payload: { ackAt: number; heartbeatAt: number; latency: number }];
};

export interface WebSocketShardDestroyOptions {
	code?: number;
	reason?: string;
	recover?: WebSocketShardDestroyRecovery;
}

export enum CloseCodes {
	Normal = 1_000,
	Resuming = 4_200,
}

export interface SendRateLimitState {
	remaining: number;
	resetAt: number;
}

export class WebSocketShard extends AsyncEventEmitter<WebSocketShardEventsMap> {
	private connection: WebSocket | null = null;

	private useIdentifyCompress = false;

	private inflate: Inflate | null = null;

	private readonly textDecoder = new TextDecoder();

	private replayedEvents = 0;

	private isAck = true;

	private sendRateLimitState: SendRateLimitState = getInitialSendRateLimitState();

	private initialHeartbeatTimeoutController: AbortController | null = null;

	private heartbeatInterval: NodeJS.Timer | null = null;

	private lastHeartbeatAt = -1;

	// Indicates whether the shard has already resolved its original connect() call
	private initialConnectResolved = false;

	// Indicates if we failed to connect to the ws url (ECONNREFUSED/ECONNRESET)
	private failedToConnectDueToNetworkError = false;

	private readonly sendQueue = new AsyncQueue();

	private readonly timeoutAbortControllers = new Collection<WebSocketShardEvents, AbortController>();

	private readonly strategy: IContextFetchingStrategy;

	public readonly id: number;

	#status: WebSocketShardStatus = WebSocketShardStatus.Idle;

	public get status(): WebSocketShardStatus {
		return this.#status;
	}

	public constructor(strategy: IContextFetchingStrategy, id: number) {
		super();
		this.strategy = strategy;
		this.id = id;
	}

	public async connect() {
		const promise = this.initialConnectResolved ? Promise.resolve() : once(this, WebSocketShardEvents.Ready);
		void this.internalConnect();

		await promise;
		this.initialConnectResolved = true;
	}

	private async internalConnect() {
		if (this.#status !== WebSocketShardStatus.Idle) {
			throw new Error("Tried to connect a shard that wasn't idle");
		}

		const { version, encoding, compression } = this.strategy.options;
		const params = new URLSearchParams({ v: version, encoding });
		if (compression) {
			const zlib = await getZlibSync();
			if (zlib) {
				params.append('compress', compression);
				this.inflate = new zlib.Inflate({
					chunkSize: 65_535,
					to: 'string',
				});
			} else if (!this.useIdentifyCompress) {
				this.useIdentifyCompress = true;
				console.warn(
					'WebSocketShard: Compression is enabled but zlib-sync is not installed, falling back to identify compress',
				);
			}
		}

		const session = await this.strategy.retrieveSessionInfo(this.id);

		const url = `${session?.resumeURL ?? this.strategy.options.gatewayInformation.url}?${params.toString()}`;
		this.debug([`Connecting to ${url}`]);
		const connection = new WebSocket(url, { handshakeTimeout: this.strategy.options.handshakeTimeout ?? undefined })
			.on('message', this.onMessage.bind(this))
			.on('error', this.onError.bind(this))
			.on('close', this.onClose.bind(this));

		connection.binaryType = 'arraybuffer';
		this.connection = connection;

		this.#status = WebSocketShardStatus.Connecting;

		this.sendRateLimitState = getInitialSendRateLimitState();

		const { ok } = await this.waitForEvent(WebSocketShardEvents.Hello, this.strategy.options.helloTimeout);
		if (!ok) {
			return;
		}

		if (session?.shardCount === this.strategy.options.shardCount) {
			await this.resume(session);
		} else {
			await this.identify();
		}
	}

	public async destroy(options: WebSocketShardDestroyOptions = {}) {
		if (this.#status === WebSocketShardStatus.Idle) {
			this.debug(['Tried to destroy a shard that was idle']);
			return;
		}

		if (!options.code) {
			options.code = options.recover === WebSocketShardDestroyRecovery.Resume ? CloseCodes.Resuming : CloseCodes.Normal;
		}

		this.debug([
			'Destroying shard',
			`Reason: ${options.reason ?? 'none'}`,
			`Code: ${options.code}`,
			`Recover: ${options.recover === undefined ? 'none' : WebSocketShardDestroyRecovery[options.recover]!}`,
		]);

		// Reset state
		this.isAck = true;
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
		}

		if (this.initialHeartbeatTimeoutController) {
			this.initialHeartbeatTimeoutController.abort();
			this.initialHeartbeatTimeoutController = null;
		}

		this.lastHeartbeatAt = -1;

		for (const controller of this.timeoutAbortControllers.values()) {
			controller.abort();
		}

		this.timeoutAbortControllers.clear();

		this.failedToConnectDueToNetworkError = false;

		// Clear session state if applicable
		if (options.recover !== WebSocketShardDestroyRecovery.Resume) {
			await this.strategy.updateSessionInfo(this.id, null);
		}

		if (this.connection) {
			// No longer need to listen to messages
			this.connection.removeAllListeners('message');
			// Prevent a reconnection loop by unbinding the main close event
			this.connection.removeAllListeners('close');

			const shouldClose = this.connection.readyState === WebSocket.OPEN;

			this.debug([
				'Connection status during destroy',
				`Needs closing: ${shouldClose}`,
				`Ready state: ${this.connection.readyState}`,
			]);

			if (shouldClose) {
				this.connection.close(options.code, options.reason);
				await once(this.connection, 'close');
				this.emit(WebSocketShardEvents.Closed, { code: options.code });
			}

			// Lastly, remove the error event.
			// Doing this earlier would cause a hard crash in case an error event fired on our `close` call
			this.connection.removeAllListeners('error');
		} else {
			this.debug(['Destroying a shard that has no connection; please open an issue on GitHub']);
		}

		this.#status = WebSocketShardStatus.Idle;

		if (options.recover !== undefined) {
			return this.internalConnect();
		}
	}

	private async waitForEvent(event: WebSocketShardEvents, timeoutDuration?: number | null): Promise<{ ok: boolean }> {
		this.debug([`Waiting for event ${event} ${timeoutDuration ? `for ${timeoutDuration}ms` : 'indefinitely'}`]);
		const timeoutController = new AbortController();
		const timeout = timeoutDuration ? setTimeout(() => timeoutController.abort(), timeoutDuration).unref() : null;

		this.timeoutAbortControllers.set(event, timeoutController);

		const closeController = new AbortController();

		try {
			// If the first promise resolves, all is well. If the 2nd promise resolves,
			// the shard has meanwhile closed. In that case, a destroy is already ongoing, so we just need to
			// return false. Meanwhile, if something rejects (error event) or the first controller is aborted,
			// we enter the catch block and trigger a destroy there.
			const closed = await Promise.race<boolean>([
				once(this, event, { signal: timeoutController.signal }).then(() => false),
				once(this, WebSocketShardEvents.Closed, { signal: closeController.signal }).then(() => true),
			]);

			return { ok: !closed };
		} catch {
			// If we're here because of other reasons, we need to destroy the shard
			void this.destroy({
				code: CloseCodes.Normal,
				reason: 'Something timed out or went wrong while waiting for an event',
				recover: WebSocketShardDestroyRecovery.Reconnect,
			});

			return { ok: false };
		} finally {
			if (timeout) {
				clearTimeout(timeout);
			}

			this.timeoutAbortControllers.delete(event);

			// Clean up the close listener to not leak memory
			if (!closeController.signal.aborted) {
				closeController.abort();
			}
		}
	}

	public async send(payload: GatewaySendPayload): Promise<void> {
		if (!this.connection) {
			throw new Error("WebSocketShard wasn't connected");
		}

		if (this.#status !== WebSocketShardStatus.Ready && !ImportantGatewayOpcodes.has(payload.op)) {
			this.debug(['Tried to send a non-crucial payload before the shard was ready, waiting']);
			// This will throw if the shard throws an error event in the meantime, just requeue the payload
			try {
				await once(this, WebSocketShardEvents.Ready);
			} catch {
				return this.send(payload);
			}
		}

		await this.sendQueue.wait();

		if (--this.sendRateLimitState.remaining <= 0) {
			const now = Date.now();

			if (this.sendRateLimitState.resetAt > now) {
				const sleepFor = this.sendRateLimitState.resetAt - now;

				this.debug([`Was about to hit the send rate limit, sleeping for ${sleepFor}ms`]);
				const controller = new AbortController();

				// Sleep for the remaining time, but if the connection closes in the meantime, we shouldn't wait the remainder to avoid blocking the new conn
				const interrupted = await Promise.race([
					sleep(sleepFor).then(() => false),
					once(this, WebSocketShardEvents.Closed, { signal: controller.signal }).then(() => true),
				]);

				if (interrupted) {
					this.debug(['Connection closed while waiting for the send rate limit to reset, re-queueing payload']);
					this.sendQueue.shift();
					return this.send(payload);
				}

				// This is so the listener from the `once` call is removed
				controller.abort();
			}

			this.sendRateLimitState = getInitialSendRateLimitState();
		}

		this.sendQueue.shift();
		this.connection.send(JSON.stringify(payload));
	}

	private async identify() {
		this.debug(['Waiting for identify throttle']);

		const controller = new AbortController();
		const closeHandler = () => {
			controller.abort();
		};

		this.on(WebSocketShardEvents.Closed, closeHandler);

		try {
			await this.strategy.waitForIdentify(this.id, controller.signal);
		} catch {
			this.debug(['Was waiting for an identify, but the shard closed in the meantime']);
			return;
		} finally {
			this.off(WebSocketShardEvents.Closed, closeHandler);
		}

		// clean up the once listener
		controller.abort();

		this.debug([
			'Identifying',
			`shard id: ${this.id.toString()}`,
			`shard count: ${this.strategy.options.shardCount}`,
			`intents: ${this.strategy.options.intents}`,
			`compression: ${this.inflate ? 'zlib-stream' : this.useIdentifyCompress ? 'identify' : 'none'}`,
		]);

		const d: GatewayIdentifyData = {
			token: this.strategy.options.token,
			properties: this.strategy.options.identifyProperties,
			intents: this.strategy.options.intents,
			compress: this.useIdentifyCompress,
			shard: [this.id, this.strategy.options.shardCount],
		};

		if (this.strategy.options.largeThreshold) {
			d.large_threshold = this.strategy.options.largeThreshold;
		}

		if (this.strategy.options.initialPresence) {
			d.presence = this.strategy.options.initialPresence;
		}

		await this.send({
			op: GatewayOpcodes.Identify,
			d,
		});

		await this.waitForEvent(WebSocketShardEvents.Ready, this.strategy.options.readyTimeout);
	}

	private async resume(session: SessionInfo) {
		this.debug([
			'Resuming session',
			`resume url: ${session.resumeURL}`,
			`sequence: ${session.sequence}`,
			`shard id: ${this.id.toString()}`,
		]);

		this.#status = WebSocketShardStatus.Resuming;
		this.replayedEvents = 0;
		return this.send({
			op: GatewayOpcodes.Resume,
			d: {
				token: this.strategy.options.token,
				seq: session.sequence,
				session_id: session.sessionId,
			},
		});
	}

	private async heartbeat(requested = false) {
		if (!this.isAck && !requested) {
			return this.destroy({ reason: 'Zombie connection', recover: WebSocketShardDestroyRecovery.Resume });
		}

		const session = await this.strategy.retrieveSessionInfo(this.id);

		await this.send({
			op: GatewayOpcodes.Heartbeat,
			d: session?.sequence ?? null,
		});

		this.lastHeartbeatAt = Date.now();
		this.isAck = false;
	}

	private async unpackMessage(data: ArrayBuffer | Buffer, isBinary: boolean): Promise<GatewayReceivePayload | null> {
		const decompressable = new Uint8Array(data);

		// Deal with no compression
		if (!isBinary) {
			return JSON.parse(this.textDecoder.decode(decompressable)) as GatewayReceivePayload;
		}

		// Deal with identify compress
		if (this.useIdentifyCompress) {
			return new Promise((resolve, reject) => {
				inflate(decompressable, { chunkSize: 65_535 }, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(JSON.parse(this.textDecoder.decode(result)) as GatewayReceivePayload);
				});
			});
		}

		// Deal with gw wide zlib-stream compression
		if (this.inflate) {
			const l = decompressable.length;
			const flush =
				l >= 4 &&
				decompressable[l - 4] === 0x00 &&
				decompressable[l - 3] === 0x00 &&
				decompressable[l - 2] === 0xff &&
				decompressable[l - 1] === 0xff;

			const zlib = (await getZlibSync())!;
			this.inflate.push(Buffer.from(decompressable), flush ? zlib.Z_SYNC_FLUSH : zlib.Z_NO_FLUSH);

			if (this.inflate.err) {
				this.emit(WebSocketShardEvents.Error, {
					error: new Error(`${this.inflate.err}${this.inflate.msg ? `: ${this.inflate.msg}` : ''}`),
				});
			}

			if (!flush) {
				return null;
			}

			const { result } = this.inflate;
			if (!result) {
				return null;
			}

			return JSON.parse(typeof result === 'string' ? result : this.textDecoder.decode(result)) as GatewayReceivePayload;
		}

		this.debug([
			'Received a message we were unable to decompress',
			`isBinary: ${isBinary.toString()}`,
			`useIdentifyCompress: ${this.useIdentifyCompress.toString()}`,
			`inflate: ${Boolean(this.inflate).toString()}`,
		]);

		return null;
	}

	private async onMessage(data: RawData, isBinary: boolean) {
		const payload = await this.unpackMessage(data as ArrayBuffer | Buffer, isBinary);
		if (!payload) {
			return;
		}

		switch (payload.op) {
			case GatewayOpcodes.Dispatch: {
				if (this.#status === WebSocketShardStatus.Resuming) {
					this.replayedEvents++;
				}

				// eslint-disable-next-line sonarjs/no-nested-switch
				switch (payload.t) {
					case GatewayDispatchEvents.Ready: {
						this.#status = WebSocketShardStatus.Ready;

						const session = {
							sequence: payload.s,
							sessionId: payload.d.session_id,
							shardId: this.id,
							shardCount: this.strategy.options.shardCount,
							resumeURL: payload.d.resume_gateway_url,
						};

						await this.strategy.updateSessionInfo(this.id, session);

						this.emit(WebSocketShardEvents.Ready, { data: payload.d });
						break;
					}

					case GatewayDispatchEvents.Resumed: {
						this.#status = WebSocketShardStatus.Ready;
						this.debug([`Resumed and replayed ${this.replayedEvents} events`]);
						this.emit(WebSocketShardEvents.Resumed);
						break;
					}

					default: {
						break;
					}
				}

				const session = await this.strategy.retrieveSessionInfo(this.id);
				if (session) {
					if (payload.s > session.sequence) {
						await this.strategy.updateSessionInfo(this.id, { ...session, sequence: payload.s });
					}
				} else {
					this.debug([
						`Received a ${payload.t} event but no session is available. Session information cannot be re-constructed in this state without a full reconnect`,
					]);
				}

				this.emit(WebSocketShardEvents.Dispatch, { data: payload });

				break;
			}

			case GatewayOpcodes.Heartbeat: {
				await this.heartbeat(true);
				break;
			}

			case GatewayOpcodes.Reconnect: {
				await this.destroy({
					reason: 'Told to reconnect by Discord',
					recover: WebSocketShardDestroyRecovery.Resume,
				});
				break;
			}

			case GatewayOpcodes.InvalidSession: {
				this.debug([`Invalid session; will attempt to resume: ${payload.d.toString()}`]);
				const session = await this.strategy.retrieveSessionInfo(this.id);
				if (payload.d && session) {
					await this.resume(session);
				} else {
					await this.destroy({
						reason: 'Invalid session',
						recover: WebSocketShardDestroyRecovery.Reconnect,
					});
				}

				break;
			}

			case GatewayOpcodes.Hello: {
				this.emit(WebSocketShardEvents.Hello);
				const jitter = Math.random();
				const firstWait = Math.floor(payload.d.heartbeat_interval * jitter);
				this.debug([`Preparing first heartbeat of the connection with a jitter of ${jitter}; waiting ${firstWait}ms`]);

				try {
					const controller = new AbortController();
					this.initialHeartbeatTimeoutController = controller;
					await sleep(firstWait, undefined, { signal: controller.signal });
				} catch {
					this.debug(['Cancelled initial heartbeat due to #destroy being called']);
					return;
				} finally {
					this.initialHeartbeatTimeoutController = null;
				}

				await this.heartbeat();

				this.debug([`First heartbeat sent, starting to beat every ${payload.d.heartbeat_interval}ms`]);
				this.heartbeatInterval = setInterval(() => void this.heartbeat(), payload.d.heartbeat_interval);
				break;
			}

			case GatewayOpcodes.HeartbeatAck: {
				this.isAck = true;

				const ackAt = Date.now();
				this.emit(WebSocketShardEvents.HeartbeatComplete, {
					ackAt,
					heartbeatAt: this.lastHeartbeatAt,
					latency: ackAt - this.lastHeartbeatAt,
				});

				break;
			}
		}
	}

	private onError(error: Error) {
		if ('code' in error && ['ECONNRESET', 'ECONNREFUSED'].includes(error.code as string)) {
			this.debug(['Failed to connect to the gateway URL specified due to a network error']);
			this.failedToConnectDueToNetworkError = true;
			return;
		}

		this.emit(WebSocketShardEvents.Error, { error });
	}

	private async onClose(code: number) {
		this.emit(WebSocketShardEvents.Closed, { code });

		switch (code) {
			case CloseCodes.Normal: {
				return this.destroy({
					code,
					reason: 'Got disconnected by Discord',
					recover: WebSocketShardDestroyRecovery.Reconnect,
				});
			}

			case CloseCodes.Resuming: {
				break;
			}

			case GatewayCloseCodes.UnknownError: {
				this.debug([`An unknown error occurred: ${code}`]);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Resume });
			}

			case GatewayCloseCodes.UnknownOpcode: {
				this.debug(['An invalid opcode was sent to Discord.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Resume });
			}

			case GatewayCloseCodes.DecodeError: {
				this.debug(['An invalid payload was sent to Discord.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Resume });
			}

			case GatewayCloseCodes.NotAuthenticated: {
				this.debug(['A request was somehow sent before the identify/resume payload.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Reconnect });
			}

			case GatewayCloseCodes.AuthenticationFailed: {
				throw new Error('Authentication failed');
			}

			case GatewayCloseCodes.AlreadyAuthenticated: {
				this.debug(['More than one auth payload was sent.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Reconnect });
			}

			case GatewayCloseCodes.InvalidSeq: {
				this.debug(['An invalid sequence was sent.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Reconnect });
			}

			case GatewayCloseCodes.RateLimited: {
				this.debug(['The WebSocket rate limit has been hit, this should never happen']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Reconnect });
			}

			case GatewayCloseCodes.SessionTimedOut: {
				this.debug(['Session timed out.']);
				return this.destroy({ code, recover: WebSocketShardDestroyRecovery.Resume });
			}

			case GatewayCloseCodes.InvalidShard: {
				throw new Error('Invalid shard');
			}

			case GatewayCloseCodes.ShardingRequired: {
				throw new Error('Sharding is required');
			}

			case GatewayCloseCodes.InvalidAPIVersion: {
				throw new Error('Used an invalid API version');
			}

			case GatewayCloseCodes.InvalidIntents: {
				throw new Error('Used invalid intents');
			}

			case GatewayCloseCodes.DisallowedIntents: {
				throw new Error('Used disallowed intents');
			}

			default: {
				this.debug([
					`The gateway closed with an unexpected code ${code}, attempting to ${
						this.failedToConnectDueToNetworkError ? 'reconnect' : 'resume'
					}.`,
				]);
				return this.destroy({
					code,
					recover: this.failedToConnectDueToNetworkError
						? WebSocketShardDestroyRecovery.Reconnect
						: WebSocketShardDestroyRecovery.Resume,
				});
			}
		}
	}

	private debug(messages: [string, ...string[]]) {
		const message = `${messages[0]}${
			messages.length > 1
				? `\n${messages
						.slice(1)
						.map((m) => `	${m}`)
						.join('\n')}`
				: ''
		}`;

		this.emit(WebSocketShardEvents.Debug, { message });
	}
}
