import { once } from 'node:events';
import { setTimeout } from 'node:timers';
import { setTimeout as sleep } from 'node:timers/promises';
import { TextDecoder } from 'node:util';
import { AsyncQueue } from '@sapphire/async-queue';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { GatewayIdentifyData, GatewayOpcodes, GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types/v10';
import { RawData, WebSocket } from 'ws';
import type { Inflate } from 'zlib-sync';
import type { SessionInfo } from './WebSocketManager';
import type { IStrategy } from '../strategies/IStrategy';
import { ImportantGatewayOpcodes } from '../utils/constants';
import { lazy } from '../utils/utils';

const getZlibSync = lazy(() => import('zlib-sync').catch(() => null));

export enum WebSocketShardEvents {
	Hello = 'hello',
	Ready = 'ready',
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type WebSocketShardEventsMap = {
	[WebSocketShardEvents.Hello]: [];
	[WebSocketShardEvents.Ready]: [];
};

export class WebSocketShard extends AsyncEventEmitter<WebSocketShardEventsMap> {
	private connection: WebSocket | null = null;

	private readonly strategy: IStrategy;
	private readonly id: number;

	private useIdentifyCompress = false;

	private inflate: Inflate | null = null;
	private readonly textDecoder = new TextDecoder();

	private isReady = false;

	private sendRateLimitState = {
		remaining: 120,
		resetAt: Date.now(),
	};

	private readonly sendQueue = new AsyncQueue();

	public constructor(strategy: IStrategy, id: number) {
		super();
		this.strategy = strategy;
		this.id = id;
	}

	public async connect() {
		// TODO(DD): Deal with already being connected

		const data = await this.strategy.fetchGatewayInformation();

		const { version, encoding, compression } = this.strategy.options;
		const params = new URLSearchParams({ v: version, encoding });
		if (compression) {
			const zlib = await getZlibSync();
			if (zlib) {
				params.append('compress', compression);
				this.inflate = new zlib.Inflate({
					chunkSize: 65535,
					to: 'string',
				});
			} else {
				this.useIdentifyCompress = true;
				console.warn(
					'WebSocketShard: Compression is enabled but zlib-sync is not installed, falling back to identify compress',
				);
			}
		}

		this.isReady = false;

		const url = `${data.url}?${params.toString()}`;
		const connection = new WebSocket(url)
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			.on('message', this.onMessage.bind(this))
			.on('error', this.onError.bind(this))
			.on('close', this.onClose.bind(this));

		connection.binaryType = 'arraybuffer';
		this.connection = connection;

		// TODO(DD): Heartbeating
		await this.waitForEvent(WebSocketShardEvents.Hello, this.strategy.options.helloTimeout);

		const session = await this.strategy.retrieveSessionInfo(this.id);
		if (session?.shardCount === this.strategy.options.shardCount) {
			await this.resume(session);
		} else {
			await this.identify();
		}
	}

	private async waitForEvent(event: WebSocketShardEvents, timeoutDuration?: number | null) {
		const controller = new AbortController();
		const timeout = timeoutDuration ? setTimeout(() => controller.abort(), timeoutDuration).unref() : null;
		await once(this, event, { signal: controller.signal });
		if (timeout) {
			clearTimeout(timeout);
		}
	}

	private async send(payload: GatewaySendPayload) {
		if (!this.connection) {
			throw new Error("WebSocketShard wasn't connected");
		}

		if (!this.isReady && !ImportantGatewayOpcodes.has(payload.op)) {
			throw new Error('Tried to send a message before the shard was ready');
		}

		await this.sendQueue.wait();

		if (--this.sendRateLimitState.remaining <= 0) {
			if (this.sendRateLimitState.resetAt < Date.now()) {
				await sleep(Date.now() - this.sendRateLimitState.resetAt);
			}

			this.sendRateLimitState = {
				remaining: 119,
				resetAt: Date.now() + 60_000,
			};
		}

		this.sendQueue.shift();
		this.connection.send(JSON.stringify(payload));
	}

	private async identify() {
		const d: GatewayIdentifyData = {
			token: this.strategy.token,
			properties: this.strategy.options.identifyProperties,
			intents: this.strategy.options.intents,
			compress: this.useIdentifyCompress,
			shard: [this.id, await this.strategy.fetchShardCount()],
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
		this.isReady = true;
	}

	private resume(session: SessionInfo) {
		return this.send({
			op: GatewayOpcodes.Resume,
			d: {
				token: this.strategy.token,
				seq: session.sequence,
				session_id: session.sessionId,
			},
		});
	}

	private async unpackMessage(data: Buffer | ArrayBuffer, isBinary: boolean): Promise<GatewayReceivePayload | null> {
		const decompressable = new Uint8Array(data);

		// Deal with no compression
		if (!isBinary) {
			return JSON.parse(this.textDecoder.decode(decompressable)) as GatewayReceivePayload;
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

			const zlib = await getZlibSync();
			this.inflate.push(Buffer.from(decompressable), flush ? zlib!.Z_SYNC_FLUSH : zlib!.Z_NO_FLUSH);

			if (this.inflate.err) {
				this.emit('error', `${this.inflate.err}${this.inflate.msg ? `: ${this.inflate.msg}` : ''}`);
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

		// Deal with identify compression

		// TODO(DD): I have no clue how to implement this. I know of no gateway implementation that uses this
		return null;
	}

	private async onMessage(data: RawData, isBinary: boolean) {
		const payload = await this.unpackMessage(data as Buffer | ArrayBuffer, isBinary);
		if (!payload) {
			return;
		}

		switch (payload.op) {
			case GatewayOpcodes.Hello: {
				this.emit(WebSocketShardEvents.Hello);
				break;
			}
		}
	}

	private onError() {}

	private onClose() {}
}
