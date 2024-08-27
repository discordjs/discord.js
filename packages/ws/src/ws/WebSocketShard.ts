import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'node:timers';
import { setTimeout as sleep } from 'node:timers/promises';
import { URLSearchParams } from 'node:url';
import { TextDecoder } from 'node:util';
import type * as nativeZlib from 'node:zlib';
import { Collection } from '@discordjs/collection';
import { lazy, shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
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
import { WebSocket, type Data } from 'ws';
import type * as ZlibSync from 'zlib-sync';
import type { IContextFetchingStrategy } from '../strategies/context/IContextFetchingStrategy';
import {
	CompressionMethod,
	CompressionParameterMap,
	ImportantGatewayOpcodes,
	getInitialSendRateLimitState,
} from '../utils/constants.js';
import type { SessionInfo } from './WebSocketManager.js';

/* eslint-disable promise/prefer-await-to-then */
const getZlibSync = lazy(async () => import('zlib-sync').then((mod) => mod.default).catch(() => null));
const getNativeZlib = lazy(async () => import('node:zlib').then((mod) => mod).catch(() => null));
/* eslint-enable promise/prefer-await-to-then */

export enum WebSocketShardEvents {
	Closed = 'closed',
	Debug = 'debug',
	Dispatch = 'dispatch',
	Error = 'error',
	HeartbeatComplete = 'heartbeat',
	Hello = 'hello',
	Ready = 'ready',
	Resumed = 'resumed',
	SocketError = 'socketError',
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

export interface WebSocketShardEventsMap {
	[WebSocketShardEvents.Closed]: [code: number];
	[WebSocketShardEvents.Debug]: [message: string];
	[WebSocketShardEvents.Dispatch]: [payload: GatewayDispatchPayload];
	[WebSocketShardEvents.Error]: [error: Error];
	[WebSocketShardEvents.Hello]: [];
	[WebSocketShardEvents.Ready]: [payload: GatewayReadyDispatchData];
	[WebSocketShardEvents.Resumed]: [];
	[WebSocketShardEvents.HeartbeatComplete]: [stats: { ackAt: number; heartbeatAt: number; latency: number }];
	[WebSocketShardEvents.SocketError]: [error: Error];
}

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
	resetAt: number;
	sent: number;
}

const WebSocketConstructor: typeof WebSocket = shouldUseGlobalFetchAndWebSocket()
	? (globalThis as any).WebSocket
	: WebSocket;

export class WebSocketShard extends AsyncEventEmitter<WebSocketShardEventsMap> {
	private connection: WebSocket | null = null;

	private nativeInflate: nativeZlib.Inflate | null = null;

	private zLibSyncInflate: ZlibSync.Inflate | null = null;

	/**
	 * @privateRemarks
	 *
	 * Used only for native zlib inflate, zlib-sync buffering is handled by the library itself.
	 */
	private inflateBuffer: Buffer[] = [];

	private readonly textDecoder = new TextDecoder();

	private replayedEvents = 0;

	private isAck = true;

	private sendRateLimitState: SendRateLimitState = getInitialSendRateLimitState();

	private initialHeartbeatTimeoutController: AbortController | null = null;

	private heartbeatInterval: NodeJS.Timeout | null = null;

	private lastHeartbeatAt = -1;

	// Indicates whether the shard has already resolved its original connect() call
	private initialConnectResolved = false;

	// Indicates if we failed to connect to the ws url
	private failedToConnectDueToNetworkError = false;

	private readonly sendQueue = new AsyncQueue();

	private readonly timeoutAbortControllers = new Collection<WebSocketShardEvents, AbortController>();

	private readonly strategy: IContextFetchingStrategy;

	public readonly id: number;

	#status: WebSocketShardStatus = WebSocketShardStatus.Idle;

	private identifyCompressionEnabled = false;

	/**
	 * @privateRemarks
	 *
	 * This is needed because `this.strategy.options.compression` is not an actual reflection of the compression method
	 * used, but rather the compression method that the user wants to use. This is because the libraries could just be missing.
	 */
	private get transportCompressionEnabled() {
		return this.strategy.options.compression !== null && (this.nativeInflate ?? this.zLibSyncInflate) !== null;
	}

	public get status(): WebSocketShardStatus {
		return this.#status;
	}

	public constructor(strategy: IContextFetchingStrategy, id: number) {
		super();
		this.strategy = strategy;
		this.id = id;
	}

	public async connect() {
		const controller = new AbortController();
		let promise;

		if (!this.initialConnectResolved) {
			// Sleep for the remaining time, but if the connection closes in the meantime, we shouldn't wait the remainder to avoid blocking the new conn
			promise = Promise.race([
				once(this, WebSocketShardEvents.Ready, { signal: controller.signal }),
				once(this, WebSocketShardEvents.Resumed, { signal: controller.signal }),
			]);
		}

		void this.internalConnect();

		try {
			await promise;
		} catch ({ error }: any) {
			throw error;
		} finally {
			// cleanup hanging listeners
			controller.abort();
		}

		this.initialConnectResolved = true;
	}

	private async internalConnect() {
		if (this.#status !== WebSocketShardStatus.Idle) {
			throw new Error("Tried to connect a shard that wasn't idle");
		}

		const { version, encoding, compression, useIdentifyCompression } = this.strategy.options;
		this.identifyCompressionEnabled = useIdentifyCompression;

		// eslint-disable-next-line id-length
		const params = new URLSearchParams({ v: version, encoding });
		if (compression !== null) {
			if (useIdentifyCompression) {
				console.warn('WebSocketShard: transport compression is enabled, disabling identify compression');
				this.identifyCompressionEnabled = false;
			}

			params.append('compress', CompressionParameterMap[compression]);

			switch (compression) {
				case CompressionMethod.ZlibNative: {
					const zlib = await getNativeZlib();
					if (zlib) {
						this.inflateBuffer = [];

						const inflate = zlib.createInflate({
							chunkSize: 65_535,
							flush: zlib.constants.Z_SYNC_FLUSH,
						});

						inflate.on('data', (chunk) => {
							this.inflateBuffer.push(chunk);
						});

						inflate.on('error', (error) => {
							this.emit(WebSocketShardEvents.Error, error);
						});

						this.nativeInflate = inflate;
					} else {
						console.warn('WebSocketShard: Compression is set to native but node:zlib is not available.');
						params.delete('compress');
					}

					break;
				}

				case CompressionMethod.ZlibSync: {
					const zlib = await getZlibSync();
					if (zlib) {
						this.zLibSyncInflate = new zlib.Inflate({
							chunkSize: 65_535,
							to: 'string',
						});
					} else {
						console.warn('WebSocketShard: Compression is set to zlib-sync, but it is not installed.');
						params.delete('compress');
					}

					break;
				}
			}
		}

		if (this.identifyCompressionEnabled) {
			const zlib = await getNativeZlib();
			if (!zlib) {
				console.warn('WebSocketShard: Identify compression is enabled, but node:zlib is not available.');
				this.identifyCompressionEnabled = false;
			}
		}

		const session = await this.strategy.retrieveSessionInfo(this.id);

		const url = `${session?.resumeURL ?? this.strategy.options.gatewayInformation.url}?${params.toString()}`;

		this.debug([`Connecting to ${url}`]);

		const connection = new WebSocketConstructor(url, [], {
			handshakeTimeout: this.strategy.options.handshakeTimeout ?? undefined,
		});

		connection.binaryType = 'arraybuffer';

		connection.onmessage = (event) => {
			void this.onMessage(event.data, event.data instanceof ArrayBuffer);
		};

		connection.onerror = (event) => {
			this.onError(event.error);
		};

		connection.onclose = (event) => {
			void this.onClose(event.code);
		};

		connection.onopen = () => {
			this.sendRateLimitState = getInitialSendRateLimitState();
		};

		this.connection = connection;

		this.#status = WebSocketShardStatus.Connecting;

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
			this.connection.onmessage = null;
			// Prevent a reconnection loop by unbinding the main close event
			this.connection.onclose = null;

			const shouldClose = this.connection.readyState === WebSocket.OPEN;

			this.debug([
				'Connection status during destroy',
				`Needs closing: ${shouldClose}`,
				`Ready state: ${this.connection.readyState}`,
			]);

			if (shouldClose) {
				let outerResolve: () => void;
				const promise = new Promise<void>((resolve) => {
					outerResolve = resolve;
				});

				this.connection.onclose = outerResolve!;

				this.connection.close(options.code, options.reason);

				await promise;
				this.emit(WebSocketShardEvents.Closed, options.code);
			}

			// Lastly, remove the error event.
			// Doing this earlier would cause a hard crash in case an error event fired on our `close` call
			this.connection.onerror = null;
		} else {
			this.debug(['Destroying a shard that has no connection; please open an issue on GitHub']);
		}

		this.#status = WebSocketShardStatus.Idle;

		if (options.recover !== undefined) {
			// There's cases (like no internet connection) where we immediately fail to connect,
			// causing a very fast and draining reconnection loop.
			await sleep(500);
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

		// Generally, the way we treat payloads is 115/60 seconds. The actual limit is 120/60, so we have a bit of leeway.
		// We use that leeway for those special payloads that we just fire with no checking, since there's no shot we ever
		// send more than 5 of those in a 60 second interval. This way we can avoid more complex queueing logic.

		if (ImportantGatewayOpcodes.has(payload.op)) {
			this.connection.send(JSON.stringify(payload));
			return;
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

		const now = Date.now();
		if (now >= this.sendRateLimitState.resetAt) {
			this.sendRateLimitState = getInitialSendRateLimitState();
		}

		if (this.sendRateLimitState.sent + 1 >= 115) {
			// Sprinkle in a little randomness just in case.
			const sleepFor = this.sendRateLimitState.resetAt - now + Math.random() * 1_500;

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

		this.sendRateLimitState.sent++;

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
			if (controller.signal.aborted) {
				this.debug(['Was waiting for an identify, but the shard closed in the meantime']);
				return;
			}

			this.debug([
				'IContextFetchingStrategy#waitForIdentify threw an unknown error.',
				"If you're using a custom strategy, this is probably nothing to worry about.",
				"If you're not, please open an issue on GitHub.",
			]);

			await this.destroy({
				reason: 'Identify throttling logic failed',
				recover: WebSocketShardDestroyRecovery.Resume,
			});
		} finally {
			this.off(WebSocketShardEvents.Closed, closeHandler);
		}

		this.debug([
			'Identifying',
			`shard id: ${this.id.toString()}`,
			`shard count: ${this.strategy.options.shardCount}`,
			`intents: ${this.strategy.options.intents}`,
			`compression: ${this.transportCompressionEnabled ? CompressionParameterMap[this.strategy.options.compression!] : this.identifyCompressionEnabled ? 'identify' : 'none'}`,
		]);

		const data: GatewayIdentifyData = {
			token: this.strategy.options.token,
			properties: this.strategy.options.identifyProperties,
			intents: this.strategy.options.intents,
			compress: this.identifyCompressionEnabled,
			shard: [this.id, this.strategy.options.shardCount],
		};

		if (this.strategy.options.largeThreshold) {
			data.large_threshold = this.strategy.options.largeThreshold;
		}

		if (this.strategy.options.initialPresence) {
			data.presence = this.strategy.options.initialPresence;
		}

		await this.send({
			op: GatewayOpcodes.Identify,
			// eslint-disable-next-line id-length
			d: data,
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
			// eslint-disable-next-line id-length
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
			// eslint-disable-next-line id-length
			d: session?.sequence ?? null,
		});

		this.lastHeartbeatAt = Date.now();
		this.isAck = false;
	}

	private parseInflateResult(result: any): GatewayReceivePayload | null {
		if (!result) {
			return null;
		}

		return JSON.parse(typeof result === 'string' ? result : this.textDecoder.decode(result)) as GatewayReceivePayload;
	}

	private async unpackMessage(data: Data, isBinary: boolean): Promise<GatewayReceivePayload | null> {
		// Deal with no compression
		if (!isBinary) {
			try {
				return JSON.parse(data as string) as GatewayReceivePayload;
			} catch {
				// This is a non-JSON payload / (at the time of writing this comment) emitted by bun wrongly interpreting custom close codes https://github.com/oven-sh/bun/issues/3392
				return null;
			}
		}

		const decompressable = new Uint8Array(data as ArrayBuffer);

		// Deal with identify compress
		if (this.identifyCompressionEnabled) {
			// eslint-disable-next-line no-async-promise-executor
			return new Promise(async (resolve, reject) => {
				const zlib = (await getNativeZlib())!;
				// eslint-disable-next-line promise/prefer-await-to-callbacks
				zlib.inflate(decompressable, { chunkSize: 65_535 }, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(JSON.parse(this.textDecoder.decode(result)) as GatewayReceivePayload);
				});
			});
		}

		// Deal with transport compression
		if (this.transportCompressionEnabled) {
			const flush =
				decompressable.length >= 4 &&
				decompressable.at(-4) === 0x00 &&
				decompressable.at(-3) === 0x00 &&
				decompressable.at(-2) === 0xff &&
				decompressable.at(-1) === 0xff;

			if (this.nativeInflate) {
				const doneWriting = new Promise<void>((resolve) => {
					// eslint-disable-next-line promise/prefer-await-to-callbacks
					this.nativeInflate!.write(decompressable, 'binary', (error) => {
						if (error) {
							this.emit(WebSocketShardEvents.Error, error);
						}

						resolve();
					});
				});

				if (!flush) {
					return null;
				}

				// This way we're ensuring the latest write has flushed and our buffer is ready
				await doneWriting;

				const result = this.parseInflateResult(Buffer.concat(this.inflateBuffer));
				this.inflateBuffer = [];

				return result;
			} else if (this.zLibSyncInflate) {
				const zLibSync = (await getZlibSync())!;
				this.zLibSyncInflate.push(Buffer.from(decompressable), flush ? zLibSync.Z_SYNC_FLUSH : zLibSync.Z_NO_FLUSH);

				if (this.zLibSyncInflate.err) {
					this.emit(
						WebSocketShardEvents.Error,
						new Error(`${this.zLibSyncInflate.err}${this.zLibSyncInflate.msg ? `: ${this.zLibSyncInflate.msg}` : ''}`),
					);
				}

				if (!flush) {
					return null;
				}

				const { result } = this.zLibSyncInflate;
				return this.parseInflateResult(result);
			}
		}

		this.debug([
			'Received a message we were unable to decompress',
			`isBinary: ${isBinary.toString()}`,
			`identifyCompressionEnabled: ${this.identifyCompressionEnabled.toString()}`,
			`inflate: ${this.transportCompressionEnabled ? CompressionMethod[this.strategy.options.compression!] : 'none'}`,
		]);

		return null;
	}

	private async onMessage(data: Data, isBinary: boolean) {
		const payload = await this.unpackMessage(data, isBinary);
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

						this.emit(WebSocketShardEvents.Ready, payload.d);
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

				this.emit(WebSocketShardEvents.Dispatch, payload);

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
		this.emit(WebSocketShardEvents.SocketError, error);
		this.failedToConnectDueToNetworkError = true;
	}

	private async onClose(code: number) {
		this.emit(WebSocketShardEvents.Closed, code);

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
				this.emit(
					WebSocketShardEvents.Error,

					new Error('Authentication failed'),
				);
				return this.destroy({ code });
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
				this.emit(WebSocketShardEvents.Error, new Error('Invalid shard'));
				return this.destroy({ code });
			}

			case GatewayCloseCodes.ShardingRequired: {
				this.emit(
					WebSocketShardEvents.Error,

					new Error('Sharding is required'),
				);
				return this.destroy({ code });
			}

			case GatewayCloseCodes.InvalidAPIVersion: {
				this.emit(
					WebSocketShardEvents.Error,

					new Error('Used an invalid API version'),
				);
				return this.destroy({ code });
			}

			case GatewayCloseCodes.InvalidIntents: {
				this.emit(
					WebSocketShardEvents.Error,

					new Error('Used invalid intents'),
				);
				return this.destroy({ code });
			}

			case GatewayCloseCodes.DisallowedIntents: {
				this.emit(
					WebSocketShardEvents.Error,

					new Error('Used disallowed intents'),
				);
				return this.destroy({ code });
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
		this.emit(WebSocketShardEvents.Debug, messages.join('\n\t'));
	}
}
