/* eslint-disable id-length */

import { randomBytes } from 'node:crypto';
import { calculateShardId } from '@discordjs/util';
import { GatewayCloseCodes, GatewayIntentBits, GatewayOpcodes, GatewayDispatchEvents } from 'discord-api-types/v10';
import type {
	GatewaySendPayload,
	GatewayDispatchPayload,
	GatewayGuildCreateDispatchData,
	GatewayIdentifyData,
	GatewayMessageCreateDispatchData,
	GatewayReadyDispatchData,
	GatewayReceivePayload,
	Snowflake,
} from 'discord-api-types/v10';
import type { WorldEvent } from '../world/Bus.js';
import type { FakeGateway } from './FakeGateway.js';

/**
 * The connection a session talks through. The in-process gateway and the WebSocket server each provide one.
 */
export interface SessionTransport {
	/**
	 * Closes the connection
	 */
	close(code: number, reason: string): void;
	/**
	 * Severs the connection without a close frame
	 */
	drop(): void;
	/**
	 * Sends a payload to the client
	 */
	send(payload: GatewayReceivePayload): void;
}

/**
 * How a session's connection ended
 */
export interface CloseInfo {
	code: number;
	/**
	 * Which side ended the connection
	 */
	initiator: 'client' | 'server';
	reason: string;
}

/**
 * Where a session is in its lifecycle
 *
 * @remarks
 * - `awaiting-identify`: connected, waiting for IDENTIFY or RESUME
 * - `ready`: identified (or resumed) and receiving dispatches
 * - `disconnected`: the connection is gone but the session can be resumed; dispatches keep going into its replay
 * buffer
 * - `invalidated`: the session can never be resumed
 */
export type SessionStatus = 'awaiting-identify' | 'disconnected' | 'invalidated' | 'ready';

const nonResumableServerCloses = new Set<number>([
	GatewayCloseCodes.AuthenticationFailed,
	GatewayCloseCodes.InvalidSeq,
	GatewayCloseCodes.SessionTimedOut,
	GatewayCloseCodes.InvalidShard,
	GatewayCloseCodes.ShardingRequired,
	GatewayCloseCodes.InvalidAPIVersion,
	GatewayCloseCodes.InvalidIntents,
	GatewayCloseCodes.DisallowedIntents,
]);

// Discord invalidates a session when the client closes normally
const nonResumableClientCloses = new Set([1_000, 1_001]);

const preIdentifyOpcodes = new Set<number>([GatewayOpcodes.Identify, GatewayOpcodes.Resume, GatewayOpcodes.Heartbeat]);

/**
 * The server side of one gateway connection: a state machine that reacts to what the client sends and to what the
 * test calls on it.
 */
export class Session {
	/**
	 * The session id handed out in READY, once the session has identified or resumed
	 */
	public id: string | null = null;

	/**
	 * The shard this session identified as
	 */
	public shardId: number | null = null;

	/**
	 * The intents this session identified with
	 */
	public intents = 0;

	/**
	 * The sequence number of the last dispatch
	 */
	public sequence = 0;

	/**
	 * Where the session is in its lifecycle
	 */
	public status: SessionStatus = 'awaiting-identify';

	/**
	 * The IDENTIFY payload the session was created with, or the one of the session it resumed
	 */
	public identifyData: GatewayIdentifyData | null = null;

	/**
	 * The sequence number the client sent with its last heartbeat. `undefined` until the first heartbeat.
	 */
	public lastHeartbeatSequence: number | null | undefined = undefined;

	#transport: SessionTransport | null;

	#replay: GatewayDispatchPayload[] = [];

	#acking = true;

	#closeInfo: CloseInfo | null = null;

	readonly #closeWaiters: ((info: CloseInfo) => void)[] = [];

	#inbox: Promise<void> = Promise.resolve();

	#identifyTimeout: NodeJS.Timeout | null = null;

	public constructor(
		public readonly gateway: FakeGateway,
		transport: SessionTransport,
		public readonly resumeGatewayUrl: string,
	) {
		this.#transport = transport;
		this.#send({
			op: GatewayOpcodes.Hello,
			d: { heartbeat_interval: gateway.options.heartbeatInterval },
			s: null,
			t: null,
		});

		if (gateway.options.identifyTimeout !== null) {
			this.#identifyTimeout = setTimeout(() => {
				this.close(GatewayCloseCodes.SessionTimedOut, 'Session timed out.');
			}, gateway.options.identifyTimeout).unref();
		}
	}

	/**
	 * Whether the session still has a connection
	 */
	public get connected(): boolean {
		return this.#transport !== null;
	}

	/**
	 * How the session's connection ended, if it has
	 */
	public get closeInfo(): CloseInfo | null {
		return this.#closeInfo;
	}

	/**
	 * Feeds a payload the client sent into the session. Payloads are handled one at a time, in order.
	 */
	public async receive(data: unknown): Promise<void> {
		const handle = async () => {
			if (!this.connected) return;

			if (typeof data !== 'object' || data === null || typeof (data as { op?: unknown }).op !== 'number') {
				this.close(GatewayCloseCodes.DecodeError, 'Error while decoding payload.');
				return;
			}

			const payload = data as GatewaySendPayload;
			if (this.status === 'awaiting-identify' && !preIdentifyOpcodes.has(payload.op)) {
				this.close(GatewayCloseCodes.NotAuthenticated, 'Not authenticated.');
				return;
			}

			if (
				this.status !== 'awaiting-identify' &&
				(payload.op === GatewayOpcodes.Identify || payload.op === GatewayOpcodes.Resume)
			) {
				this.close(GatewayCloseCodes.AlreadyAuthenticated, 'Already authenticated.');
				return;
			}

			try {
				await this.gateway.runHandlers(payload, this);
			} catch (error) {
				this.close(GatewayCloseCodes.UnknownError, 'Unknown error.');
				throw error;
			}
		};

		// eslint-disable-next-line promise/prefer-await-to-then
		const result = this.#inbox.then(handle);
		// eslint-disable-next-line promise/prefer-await-to-then
		this.#inbox = result.catch(() => {});
		return result;
	}

	/**
	 * Tells the session its connection was closed by the client, or lost
	 */
	public transportClosed(code: number, reason = ''): void {
		this.#closed({ code, reason, initiator: 'client' });
	}

	/**
	 * Completes an IDENTIFY: sends READY, then a GUILD_CREATE for every guild the shard owns
	 */
	public ready(identify: GatewayIdentifyData): void {
		const { world } = this.gateway;
		this.#clearIdentifyTimeout();
		this.id = randomBytes(16).toString('hex');
		this.shardId = identify.shard?.[0] ?? 0;
		this.intents = identify.intents;
		this.identifyData = identify;
		this.status = 'ready';

		const guilds = world.guilds().filter((guild) => this.owns(guild.id));
		const application = world.application;
		this.dispatch(GatewayDispatchEvents.Ready, {
			v: 10,
			user: world.botUser.data,
			guilds: guilds.map((guild) => ({ id: guild.id, unavailable: true })),
			session_id: this.id!,
			resume_gateway_url: this.resumeGatewayUrl,
			shard: [this.shardId, world.shardCount],
			application: { id: application.id, flags: application.flags, flags_new: application.flags_new },
		} satisfies GatewayReadyDispatchData);

		if (this.intents & GatewayIntentBits.Guilds) {
			for (const guild of guilds) {
				this.dispatch(
					GatewayDispatchEvents.GuildCreate,
					this.prepare(GatewayDispatchEvents.GuildCreate, world.guildCreatePayload(guild.id)),
				);
			}
		}
	}

	/**
	 * Whether a RESUME carrying this sequence number can pick this session back up
	 */
	public canResume(sequence: number): boolean {
		if (this.status === 'invalidated' || this.status === 'awaiting-identify' || sequence > this.sequence) return false;
		if (sequence === this.sequence) return true;

		const oldest = this.#replay[0];
		return oldest !== undefined && oldest.s <= sequence + 1;
	}

	public resume(previous: Session, sequence: number): void {
		this.#clearIdentifyTimeout();
		this.id = previous.id;
		this.shardId = previous.shardId;
		this.intents = previous.intents;
		this.identifyData = previous.identifyData;
		this.sequence = previous.sequence;
		this.#replay = previous.#replay;
		this.status = 'ready';
		previous.#supersede();

		for (const payload of this.#replay) {
			if (payload.s > sequence) this.#send(payload);
		}

		this.dispatch(GatewayDispatchEvents.Resumed, undefined);
	}

	/**
	 * Records a heartbeat and acknowledges it, unless {@link Session.stopAcking} was called
	 */
	public heartbeat(sequence: number | null): void {
		this.lastHeartbeatSequence = sequence;
		if (this.#acking) this.#send({ op: GatewayOpcodes.HeartbeatAck, s: null, t: null } as GatewayReceivePayload);
	}

	/**
	 * Whether the session's shard "owns" something (i.e. the guildId of the event matches to said shard, or for
	 * guild-less events the shard is 0)
	 */
	public owns(guildId: Snowflake | null): boolean {
		if (this.shardId === null) return false;
		return guildId ? calculateShardId(guildId, this.gateway.world.shardCount) === this.shardId : this.shardId === 0;
	}

	/**
	 * Whether a world event reaches this session, given its status, shard and intents
	 */
	public admits(event: WorldEvent): boolean {
		if (this.status !== 'ready' && this.status !== 'disconnected') return false;
		if (!this.owns(event.guildId)) return false;
		return event.intent === null || (this.intents & event.intent) === event.intent;
	}

	/**
	 * Shapes an event's data the way Discord would for this session's intents: no message content without the
	 * message content intent, no member list without the guild members intent
	 */
	public prepare<Data>(event: GatewayDispatchEvents, data: Data): Data {
		const botId = this.gateway.world.botUserId;

		if (
			(event === GatewayDispatchEvents.MessageCreate || event === GatewayDispatchEvents.MessageUpdate) &&
			!(this.intents & GatewayIntentBits.MessageContent)
		) {
			const message = data as GatewayMessageCreateDispatchData;
			const exempt =
				!message.guild_id || message.author?.id === botId || message.mentions?.some((user) => user.id === botId);
			if (!exempt) {
				const { poll: _poll, ...rest } = message;
				return { ...rest, content: '', embeds: [], attachments: [], components: [] } as Data;
			}
		}

		if (event === GatewayDispatchEvents.GuildCreate) {
			const guild = data as GatewayGuildCreateDispatchData;
			return {
				...guild,
				members:
					this.intents & GatewayIntentBits.GuildMembers
						? guild.members
						: guild.members.filter((member) => member.user.id === botId),
				presences: this.intents & GatewayIntentBits.GuildPresences ? guild.presences : [],
			} as Data;
		}

		return data;
	}

	/**
	 * Sends a dispatch as-is, with the next sequence number. While the session is disconnected, the dispatch only goes
	 * into the replay buffer.
	 */
	public dispatch(event: GatewayDispatchEvents, data: unknown): void {
		const payload = { op: GatewayOpcodes.Dispatch, t: event, s: ++this.sequence, d: data } as GatewayDispatchPayload;

		this.#replay.push(payload);
		if (this.#replay.length > this.gateway.options.replayBufferSize) this.#replay.shift();

		if (this.status === 'ready') this.#send(payload);
	}

	public reconnect(): void {
		this.#send({ op: GatewayOpcodes.Reconnect, d: null, s: null, t: null } as unknown as GatewayReceivePayload);
	}

	public invalidate({ resumable = false }: { resumable?: boolean } = {}): void {
		this.#send({ op: GatewayOpcodes.InvalidSession, d: resumable, s: null, t: null });
		if (!resumable && this.status !== 'awaiting-identify') this.status = 'invalidated';
	}

	public close(code: number = GatewayCloseCodes.UnknownError, reason = ''): void {
		// Held in a local because #closed clears #transport, and the session must already count as closed by the time
		// the transport reacts, so #closed has to run first
		const transport = this.#transport;
		if (!transport) return;

		this.#closed({ code, reason, initiator: 'server' });
		transport.close(code, reason);
	}

	/**
	 * Severs the connection with no close frame, like a network failure. The session can be resumed.
	 */
	public drop(): void {
		// See close() for why this is a local
		const transport = this.#transport;
		if (!transport) return;

		this.#closed({ code: 1_006, reason: '', initiator: 'server' });
		transport.drop();
	}

	/**
	 * Stops acknowledging heartbeats, so the client's zombie connection detection kicks in
	 */
	public stopAcking(): void {
		this.#acking = false;
	}

	/**
	 * Goes back to acknowledging heartbeats
	 */
	public startAcking(): void {
		this.#acking = true;
	}

	/**
	 * Asks the client for an immediate heartbeat (opcode 1)
	 */
	public requestHeartbeat(): void {
		this.#send({ op: GatewayOpcodes.Heartbeat, d: null, s: null, t: null } as unknown as GatewayReceivePayload);
	}

	/**
	 * Resolves once the connection has closed, whether that already happened or not
	 *
	 * @param code - The close code to expect. The promise rejects if the connection closes with a different one.
	 */
	public async expectClose(code?: number): Promise<CloseInfo> {
		const info =
			this.#closeInfo ??
			(await new Promise<CloseInfo>((resolve) => {
				this.#closeWaiters.push(resolve);
			}));

		if (code !== undefined && info.code !== code) {
			throw new Error(
				`Expected the session to close with ${code}, but the ${info.initiator} closed it with ${info.code}${info.reason ? ` (${info.reason})` : ''}`,
			);
		}

		return info;
	}

	#send(payload: GatewayReceivePayload): void {
		this.#transport?.send(payload);
	}

	#closed(info: CloseInfo): void {
		if (this.#closeInfo) return;

		this.#closeInfo = info;
		this.#transport = null;
		this.#clearIdentifyTimeout();

		const nonResumable = info.initiator === 'server' ? nonResumableServerCloses : nonResumableClientCloses;
		if (this.id === null || this.status === 'invalidated' || nonResumable.has(info.code)) {
			this.status = 'invalidated';
		} else {
			this.status = 'disconnected';
		}

		for (const resolve of this.#closeWaiters.splice(0)) resolve(info);
	}

	#supersede(): void {
		this.status = 'invalidated';
		this.drop();
	}

	#clearIdentifyTimeout(): void {
		if (this.#identifyTimeout) clearTimeout(this.#identifyTimeout);
		this.#identifyTimeout = null;
	}
}
