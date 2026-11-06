import { EventEmitter } from 'node:events';
import process from 'node:process';
import type { Awaitable } from '@discordjs/util';
import {
	GatewayCloseCodes,
	GatewayDispatchEvents,
	GatewayOpcodes,
	type GatewayDispatchPayload,
	type GatewayIdentifyData,
	type GatewayReceivePayload,
	type GatewaySendPayload,
} from 'discord-api-types/v10';
import { wireCopy } from '../util.js';
import type { WorldEvent } from '../world/Bus.js';
import type { World } from '../world/World.js';
import { Session, type SessionTransport } from './Session.js';
import { SessionRegistry } from './SessionRegistry.js';
import { registerBuiltinHandlers } from './handlers.js';

// We're building for testing environments, which may or may not install fake timers for various reasons.
// By capturing a reference to setImmediate here (code that will run at import-time), we force the logic in this file
// to never use a mocked `setImmediate`. We rely on its real behavior.
const scheduleIo = setImmediate;

export interface FakeGatewayOptions {
	/**
	 * The heartbeat interval sent in HELLO, in milliseconds. Long enough by default that no client heartbeats during a
	 * test unless asked to with {@link Session.requestHeartbeat}.
	 *
	 * @defaultValue `41_250`
	 */
	heartbeatInterval?: number;
	/**
	 * How long a connection may go without identifying before it is closed, in milliseconds. `null` disables the
	 * timeout.
	 *
	 * @defaultValue `null`
	 */
	identifyTimeout?: number | null;
	/**
	 * How many dispatches each session keeps around to replay on resume
	 *
	 * @defaultValue `1_000`
	 */
	replayBufferSize?: number;
	/**
	 * The `resume_gateway_url` sent in READY to in-process sessions
	 *
	 * @defaultValue `'ws://127.0.0.1'`
	 */
	resumeGatewayUrl?: string;
}

export interface InProcessConnectOptions {
	/**
	 * The intents to identify with
	 */
	intents: number;
	/**
	 * The shards to connect
	 *
	 * @defaultValue Every shard
	 */
	shardIds?: number[];
	/**
	 * The token to identify with
	 *
	 * @defaultValue The world's token
	 */
	token?: string;
}

/**
 * Handles a payload a client sent with a given opcode. Handlers registered later run first; calling `next` runs the
 * one registered before, down to the built-in behavior. With no handler left, the connection closes with 4001.
 */
export type OpcodeHandler<Opcode extends GatewaySendPayload['op'] = GatewaySendPayload['op']> = (
	payload: Extract<GatewaySendPayload, { op: Opcode }>,
	session: Session,
	next: () => Promise<void>,
) => Awaitable<void>;

/**
 * The client half of an in-process connection: identifies on HELLO, answers heartbeat requests, and emits
 * dispatches.
 */
class InProcessClient implements SessionTransport {
	public session!: Session;

	public readonly ready: Promise<void>;

	#resolveReady!: () => void;

	#rejectReady!: (error: Error) => void;

	#lastSequence: number | null = null;

	public constructor(
		private readonly shardId: number,
		private readonly identify: GatewayIdentifyData,
		private readonly deliver: (task: () => void) => void,
		private readonly emit: (payload: GatewayDispatchPayload) => void,
	) {
		this.ready = new Promise((resolve, reject) => {
			this.#resolveReady = resolve;
			this.#rejectReady = reject;
		});
	}

	public send(payload: GatewayReceivePayload): void {
		const copy = wireCopy(payload);
		this.deliver(() => this.#onPayload(copy));
	}

	public close(code: number, reason: string): void {
		this.deliver(() => this.#rejectReady(new Error(`Shard ${this.shardId} was closed with ${code}: ${reason}`)));
	}

	public drop(): void {
		this.deliver(() => this.#rejectReady(new Error(`Shard ${this.shardId}'s connection was dropped`)));
	}

	#onPayload(payload: GatewayReceivePayload): void {
		switch (payload.op) {
			case GatewayOpcodes.Hello:
				// eslint-disable-next-line id-length
				void this.session.receive({ op: GatewayOpcodes.Identify, d: this.identify });
				break;
			case GatewayOpcodes.Heartbeat:
				// eslint-disable-next-line id-length
				void this.session.receive({ op: GatewayOpcodes.Heartbeat, d: this.#lastSequence });
				break;
			case GatewayOpcodes.Dispatch:
				this.#lastSequence = payload.s;
				this.emit(payload);
				if (payload.t === GatewayDispatchEvents.Ready) this.#resolveReady();
				break;
			case GatewayOpcodes.Reconnect:
			case GatewayOpcodes.InvalidSession:
			case GatewayOpcodes.HeartbeatAck:
				break;
		}
	}
}

/**
 * The fake gateway: it owns every session, fans world events out to them, and runs the opcode handlers for what
 * clients send.
 */
export class FakeGateway {
	public readonly options: Readonly<Required<FakeGatewayOptions>>;

	/**
	 * Every session opened, in-process or over the wire
	 */
	public readonly sessions = new SessionRegistry();

	readonly #handlers = new Map<number, OpcodeHandler<any>[]>();

	readonly #emitter = new EventEmitter();

	readonly #clients = new Map<number, InProcessClient>();

	readonly #deliveryQueue: (() => void)[] = [];

	#deliveryFlush: Promise<void> | null = null;

	public constructor(
		public readonly world: World,
		options: FakeGatewayOptions = {},
	) {
		this.options = {
			heartbeatInterval: options.heartbeatInterval ?? 41_250,
			identifyTimeout: options.identifyTimeout ?? null,
			replayBufferSize: options.replayBufferSize ?? 1_000,
			resumeGatewayUrl: options.resumeGatewayUrl ?? 'ws://127.0.0.1',
		};

		world.bus.subscribe((event) => this.#fanOut(event));
		registerBuiltinHandlers(this);
	}

	/**
	 * Registers a handler for an opcode clients send
	 *
	 * @returns A function that removes the handler again
	 */
	public handle<Opcode extends GatewaySendPayload['op']>(op: Opcode, handler: OpcodeHandler<Opcode>): () => void {
		let stack = this.#handlers.get(op);
		if (!stack) {
			stack = [];
			this.#handlers.set(op, stack);
		}

		stack.unshift(handler);
		return () => {
			const index = stack.indexOf(handler);
			if (index !== -1) stack.splice(index, 1);
		};
	}

	/**
	 * Runs the handler stack for a payload. Sessions call this for every payload they receive once it passed the
	 * protocol checks.
	 *
	 * @internal
	 */
	public async runHandlers(payload: GatewaySendPayload, session: Session): Promise<void> {
		const stack = [...(this.#handlers.get(payload.op) ?? [])];
		const run = async (index: number): Promise<void> => {
			const handler = stack[index];
			if (!handler) {
				session.close(GatewayCloseCodes.UnknownOpcode, 'Unknown opcode.');
				return;
			}

			await handler(payload, session, async () => run(index + 1));
		};

		await run(0);
	}

	/**
	 * Opens a session over a transport and sends HELLO
	 */
	public open(transport: SessionTransport, { resumeGatewayUrl }: { resumeGatewayUrl?: string } = {}): Session {
		const session = new Session(this, transport, resumeGatewayUrl ?? this.options.resumeGatewayUrl);
		this.sessions.add(session);
		return session;
	}

	/**
	 * Sends a raw dispatch to every live session, or to the sessions of one shard, regardless of intents.
	 * Essentially an escape hatch for events the world does not model yet.
	 */
	public dispatch(event: GatewayDispatchEvents, data: unknown, { shardId }: { shardId?: number } = {}): void {
		for (const session of this.sessions) {
			if (session.status !== 'ready' && session.status !== 'disconnected') continue;
			if (shardId === undefined || session.shardId === shardId) session.dispatch(event, data);
		}
	}

	/**
	 * Opens in-process sessions and identifies them, resolving once every shard has received READY and the GUILD_CREATEs
	 * that follow it have been emitted
	 */
	public async connect(options: InProcessConnectOptions): Promise<void> {
		const shardIds = options.shardIds ?? Array.from({ length: this.world.shardCount }, (_, index) => index);

		await Promise.all(
			shardIds.map(async (shardId) => {
				if (this.#clients.has(shardId)) throw new Error(`Shard ${shardId} is already connected in-process`);

				const client = new InProcessClient(
					shardId,
					{
						token: options.token ?? this.world.token,
						intents: options.intents,
						shard: [shardId, this.world.shardCount],
						properties: { os: process.platform, browser: '@discordjs/mock', device: '@discordjs/mock' },
					},
					(task) => this.#deliver(task),
					(payload) => this.#emitter.emit('dispatch', payload, shardId),
				);
				this.#clients.set(shardId, client);
				client.session = this.open(client);

				try {
					await client.ready;
				} catch (error) {
					this.#clients.delete(shardId);
					throw error;
				}
			}),
		);

		while (this.#deliveryFlush) await this.#deliveryFlush;
	}

	public disconnect(): void {
		for (const client of this.#clients.values()) client.session.transportClosed(1_000, 'Disconnected');
		this.#clients.clear();
	}

	public getShardCount(): number {
		return this.world.shardCount;
	}

	public on(event: 'dispatch', listener: (payload: GatewayDispatchPayload, shardId: number) => Awaitable<void>): this;
	public on(event: 'error', listener: (error: unknown) => void): this;
	public on(event: string, listener: (...args: any[]) => unknown): this {
		this.#emitter.on(event, listener);
		return this;
	}

	public off(event: 'dispatch' | 'error', listener: (...args: any[]) => unknown): this {
		this.#emitter.off(event, listener);
		return this;
	}

	/**
	 * Sends a payload from the in-process client of a shard
	 */
	public async send(shardId: number, payload: GatewaySendPayload): Promise<void> {
		const client = this.#clients.get(shardId);
		if (!client) throw new Error(`Shard ${shardId} is not connected in-process`);
		await client.session.receive(wireCopy(payload));
	}

	#fanOut(event: WorldEvent): void {
		for (const session of this.sessions) {
			if (session.admits(event)) session.dispatch(event.t, session.prepare(event.t, event.d));
		}
	}

	// In-process payloads are delivered in order, one I/O turn after they are sent, the way a socket would
	#deliver(task: () => void): void {
		this.#deliveryQueue.push(task);
		this.#deliveryFlush ??= new Promise((resolve) => {
			scheduleIo(() => {
				this.#deliveryFlush = null;
				for (const queued of this.#deliveryQueue.splice(0)) {
					try {
						queued();
					} catch (error) {
						if (this.#emitter.listenerCount('error')) {
							this.#emitter.emit('error', error);
						} else {
							// Surface it as uncaught without dropping the rest of the queue
							queueMicrotask(() => {
								throw error;
							});
						}
					}
				}

				resolve();
			});
		});
	}
}
