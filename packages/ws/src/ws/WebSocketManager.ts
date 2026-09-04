import type { Collection } from '@discordjs/collection';
import { range, type Awaitable } from '@discordjs/util';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type {
	GatewayIdentifyProperties,
	GatewayPresenceUpdateData,
	RESTGetAPIGatewayBotResult,
	GatewayIntentBits,
	GatewaySendPayload,
	GatewayDispatchPayload,
	GatewayReadyDispatchData,
} from 'discord-api-types/v10';
import type { IShardingStrategy } from '../strategies/sharding/IShardingStrategy.js';
import type { IIdentifyThrottler } from '../throttling/IIdentifyThrottler.js';
import { DefaultWebSocketManagerOptions, type CompressionMethod, type Encoding } from '../utils/constants.js';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents, WebSocketShardStatus } from './WebSocketShard.js';

/**
 * Represents a range of shard ids
 */
export interface ShardRange {
	end: number;
	start: number;
}

/**
 * Session information for a given shard, used to resume a session
 */
export interface SessionInfo {
	/**
	 * URL to use when resuming
	 */
	resumeURL: string;
	/**
	 * The sequence number of the last message sent by the shard
	 */
	sequence: number;
	/**
	 * Session id for this shard
	 */
	sessionId: string;
	/**
	 * The total number of shards at the time of this shard identifying
	 */
	shardCount: number;
	/**
	 * The id of the shard
	 */
	shardId: number;
}

/**
 * Required options for the WebSocketManager
 */
export interface RequiredWebSocketManagerOptions {
	/**
	 * The intents to request
	 */
	intents: GatewayIntentBits | 0;
}

/**
 * Optional additional configuration for the WebSocketManager
 */
export interface OptionalWebSocketManagerOptions {
	/**
	 * Builds an identify throttler to use for this manager's shards
	 */
	buildIdentifyThrottler(manager: WebSocketManager): Awaitable<IIdentifyThrottler>;
	/**
	 * Builds the strategy to use for sharding
	 *
	 * @example
	 * ```ts
	 * const manager = new WebSocketManager({
	 *  token: process.env.DISCORD_TOKEN,
	 *  intents: 0, // for no intents
	 *  buildStrategy: (manager) => new WorkerShardingStrategy(manager, { shardsPerWorker: 2 }),
	 * });
	 * ```
	 */
	buildStrategy(manager: WebSocketManager): IShardingStrategy;
	/**
	 * The transport compression method to use - mutually exclusive with `useIdentifyCompression`
	 *
	 * @defaultValue `null` (no transport compression)
	 */
	compression: CompressionMethod | null;
	/**
	 * The encoding to use
	 *
	 * @defaultValue `'json'`
	 */
	encoding: Encoding;
	/**
	 * How long to wait for a shard to connect before giving up
	 */
	handshakeTimeout: number | null;
	/**
	 * How long to wait for a shard's HELLO packet before giving up
	 */
	helloTimeout: number | null;
	/**
	 * Properties to send to the gateway when identifying
	 */
	identifyProperties: GatewayIdentifyProperties;
	/**
	 * Initial presence data to send to the gateway when identifying
	 */
	initialPresence: GatewayPresenceUpdateData | null;
	/**
	 * Value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list
	 */
	largeThreshold: number | null;
	/**
	 * How long to wait for a shard's READY packet before giving up
	 */
	readyTimeout: number | null;
	/**
	 * Function used to retrieve session information (and attempt to resume) for a given shard
	 *
	 * @example
	 * ```ts
	 * const manager = new WebSocketManager({
	 *   async retrieveSessionInfo(shardId): Awaitable<SessionInfo | null> {
	 *     // Fetch this info from redis or similar
	 *     return { sessionId: string, sequence: number };
	 *     // Return null if no information is found
	 *   },
	 * });
	 * ```
	 */
	retrieveSessionInfo(shardId: number): Awaitable<SessionInfo | null>;
	/**
	 * The total number of shards across all WebsocketManagers you intend to instantiate.
	 * Use `null` to use Discord's recommended shard count
	 */
	shardCount: number | null;
	/**
	 * The ids of the shards this WebSocketManager should manage.
	 * Use `null` to simply spawn 0 through `shardCount - 1`
	 *
	 * @example
	 * ```ts
	 * const manager = new WebSocketManager({
	 *   shardIds: [1, 3, 7], // spawns shard 1, 3, and 7, nothing else
	 * });
	 * ```
	 * @example
	 * ```ts
	 * const manager = new WebSocketManager({
	 *   shardIds: {
	 *     start: 3,
	 *     end: 6,
	 *   }, // spawns shards 3, 4, 5, and 6
	 * });
	 * ```
	 */
	shardIds: number[] | ShardRange | null;
	/**
	 * The token to use for identifying with the gateway
	 *
	 * If not provided, the token must be set using {@link WebSocketManager.setToken}
	 */
	token: string;
	/**
	 * Function used to store session information for a given shard
	 */
	updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null): Awaitable<void>;
	/**
	 * Whether to use the `compress` option when identifying
	 *
	 * @defaultValue `false`
	 */
	useIdentifyCompression: boolean;
	/**
	 * The gateway version to use
	 *
	 * @defaultValue `'10'`
	 */
	version: string;
}

export interface WebSocketManagerOptions extends OptionalWebSocketManagerOptions, RequiredWebSocketManagerOptions {}

export interface CreateWebSocketManagerOptions
	extends Partial<OptionalWebSocketManagerOptions>, RequiredWebSocketManagerOptions {}

/**
 * Options for {@link WebSocketManager.connect}
 */
export interface WebSocketManagerConnectOptions {
	/**
	 * Information retrieved from the `/gateway/bot` endpoint, used as-is.
	 * We recommend using a REST client that respects Discord's rate limits, such as `@discordjs/rest`,
	 * and fetching this information right before connecting, as the session start limits it reports go stale.
	 *
	 * @example
	 * ```ts
	 * const rest = new REST().setToken(process.env.DISCORD_TOKEN);
	 * await manager.connect({
	 *  gatewayInformation: (await rest.get(Routes.gatewayBot())) as RESTGetAPIGatewayBotResult,
	 * });
	 * ```
	 */
	gatewayInformation: RESTGetAPIGatewayBotResult;
}

export interface ManagerShardEventsMap {
	[WebSocketShardEvents.Closed]: [code: number, shardId: number];
	[WebSocketShardEvents.Debug]: [message: string, shardId: number];
	[WebSocketShardEvents.Dispatch]: [payload: GatewayDispatchPayload, shardId: number];
	[WebSocketShardEvents.Error]: [error: Error, shardId: number];
	[WebSocketShardEvents.Hello]: [shardId: number];
	[WebSocketShardEvents.Ready]: [data: GatewayReadyDispatchData, shardId: number];
	[WebSocketShardEvents.Resumed]: [shardId: number];
	[WebSocketShardEvents.HeartbeatComplete]: [
		stats: { ackAt: number; heartbeatAt: number; latency: number },
		shardId: number,
	];
	[WebSocketShardEvents.SocketError]: [error: Error, shardId: number];
}

export class WebSocketManager extends AsyncEventEmitter<ManagerShardEventsMap> implements AsyncDisposable {
	#token: string | null = null;

	#gatewayInformation: RESTGetAPIGatewayBotResult | null = null;

	/**
	 * The options being used by this manager
	 */
	public readonly options: Omit<WebSocketManagerOptions, 'token'>;

	/**
	 * Strategy used to manage shards
	 *
	 * @defaultValue `SimpleShardingStrategy`
	 */
	private readonly strategy: IShardingStrategy;

	/**
	 * Gets the token set for this manager. If no token is set, an error is thrown.
	 * To set the token, use {@link WebSocketManager.setToken} or pass it in the options.
	 *
	 * @remarks
	 * This getter is mostly used to pass the token to the sharding strategy internally, there's not much reason to use it.
	 */
	public get token(): string {
		if (!this.#token) {
			throw new Error('Token has not been set');
		}

		return this.#token;
	}

	public constructor(options: CreateWebSocketManagerOptions) {
		super();
		this.options = {
			...DefaultWebSocketManagerOptions,
			...options,
		};
		this.strategy = this.options.buildStrategy(this);
		this.#token = options.token ?? null;
	}

	/**
	 * The `/gateway/bot` information provided to {@link WebSocketManager.connect}.
	 * Throws if the method has not been invoked yet.
	 */
	public getGatewayInformation(): RESTGetAPIGatewayBotResult {
		if (!this.#gatewayInformation) {
			throw new Error('Gateway information has not been set. Invoke `connect()` first.');
		}

		return this.#gatewayInformation;
	}

	/**
	 * Updates your total shard count on-the-fly, re-spawning all shards to the new amount
	 *
	 * @param shardCount - The new shard count to use
	 */
	public async updateShardCount(shardCount: number | null) {
		await this.strategy.destroy({ reason: 'User is adjusting their shards' });
		this.options.shardCount = shardCount;

		const shardIds = this.getShardIds();
		await this.strategy.spawn(shardIds);

		return this;
	}

	/**
	 * Yields the total number of shards across for your bot, accounting for Discord recommendations
	 *
	 * @remarks
	 * Throws if {@link WebSocketManager.connect} has not been invoked yet.
	 */
	public getShardCount(): number {
		if (this.options.shardCount) {
			return this.options.shardCount;
		}

		const shardIds = this.getShardIds();
		return Math.max(...shardIds) + 1;
	}

	/**
	 * Yields the ids of the shards this manager should manage
	 *
	 * @remarks
	 * Throws if {@link WebSocketManager.connect} has not been invoked yet.
	 */
	public getShardIds(): number[] {
		let shardIds: number[];
		if (this.options.shardIds) {
			if (Array.isArray(this.options.shardIds)) {
				shardIds = this.options.shardIds;
			} else {
				const { start, end } = this.options.shardIds;
				shardIds = [...range({ start, end: end + 1 })];
			}
		} else {
			shardIds = [...range(this.options.shardCount ?? this.getGatewayInformation().shards)];
		}

		return shardIds;
	}

	public async connect(options: WebSocketManagerConnectOptions) {
		if (!options?.gatewayInformation) {
			throw new TypeError('gatewayInformation is required');
		}

		this.#gatewayInformation = options.gatewayInformation;
		const shardIds = this.getShardIds();
		if (options.gatewayInformation.session_start_limit.remaining < shardIds.length) {
			this.#gatewayInformation = null;
			throw new Error(
				`Not enough sessions remaining to spawn ${shardIds.length} shards; only ${
					options.gatewayInformation.session_start_limit.remaining
				} remaining; resets at ${new Date(Date.now() + options.gatewayInformation.session_start_limit.reset_after).toISOString()}`,
			);
		}

		// Spawn shards and adjust internal state
		await this.updateShardCount(this.getShardCount());

		await this.strategy.connect();
	}

	public setToken(token: string): void {
		if (this.#token) {
			throw new Error('Token has already been set');
		}

		this.#token = token;
	}

	public async destroy(options?: Omit<WebSocketShardDestroyOptions, 'recover'>) {
		await this.strategy.destroy(options);
		this.#gatewayInformation = null;
	}

	public send(shardId: number, payload: GatewaySendPayload) {
		return this.strategy.send(shardId, payload);
	}

	public fetchStatus(): Awaitable<Collection<number, WebSocketShardStatus>> {
		return this.strategy.fetchStatus();
	}

	public async [Symbol.asyncDispose]() {
		await this.destroy();
	}
}
