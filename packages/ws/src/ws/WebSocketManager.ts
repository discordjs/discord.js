import type { REST } from '@discordjs/rest';
import { range, type Awaitable } from '@discordjs/util';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
	Routes,
	type APIGatewayBotInfo,
	type GatewayIdentifyProperties,
	type GatewayPresenceUpdateData,
	type RESTGetAPIGatewayBotResult,
	type GatewayIntentBits,
	type GatewaySendPayload,
	type GatewayDispatchPayload,
	type GatewayReadyDispatchData,
} from 'discord-api-types/v10';
import type { IShardingStrategy } from '../strategies/sharding/IShardingStrategy.js';
import type { IIdentifyThrottler } from '../throttling/IIdentifyThrottler.js';
import { DefaultWebSocketManagerOptions, type CompressionMethod, type Encoding } from '../utils/constants.js';
import type { WebSocketShardDestroyOptions, WebSocketShardEvents } from './WebSocketShard.js';

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
	 *  rest,
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
	 * Fetches the initial gateway URL used to connect to Discord. When missing, this will default to the gateway URL
	 * that Discord returns from the `/gateway/bot` route.
	 *
	 * @example
	 * ```ts
	 * const manager = new WebSocketManager({
	 *  token: process.env.DISCORD_TOKEN,
	 *  fetchGatewayInformation() {
	 *    return rest.get(Routes.gatewayBot());
	 *  },
	 * })
	 * ```
	 */
	fetchGatewayInformation(): Awaitable<RESTGetAPIGatewayBotResult>;
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
	 * The REST instance to use for fetching gateway information
	 *
	 * @deprecated Providing a REST instance is deprecated. Provide the `fetchGatewayInformation` function instead.
	 */
	rest?: REST;
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
	extends Partial<OptionalWebSocketManagerOptions>,
		RequiredWebSocketManagerOptions {}

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

	/**
	 * The options being used by this manager
	 */
	public readonly options: Omit<WebSocketManagerOptions, 'token'>;

	/**
	 * Internal cache for a GET /gateway/bot result
	 */
	private gatewayInformation: {
		data: APIGatewayBotInfo;
		expiresAt: number;
	} | null = null;

	/**
	 * Internal cache for the shard ids
	 */
	private shardIds: number[] | null = null;

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
		if (!options.rest && !options.fetchGatewayInformation) {
			throw new RangeError('Either a REST instance or a fetchGatewayInformation function must be provided');
		}

		super();
		this.options = {
			...DefaultWebSocketManagerOptions,
			fetchGatewayInformation:
				options.fetchGatewayInformation ??
				(async () => {
					if (!options.rest) {
						throw new RangeError('A REST instance must be provided if no fetchGatewayInformation function is provided');
					}

					return options.rest.get(Routes.gatewayBot()) as Promise<RESTGetAPIGatewayBotResult>;
				}),
			...options,
		};
		this.strategy = this.options.buildStrategy(this);
		this.#token = options.token ?? null;
	}

	/**
	 * Fetches the gateway information from Discord - or returns it from cache if available
	 *
	 * @param force - Whether to ignore the cache and force a fresh fetch
	 */
	public async fetchGatewayInformation(force = false) {
		if (this.gatewayInformation) {
			if (this.gatewayInformation.expiresAt <= Date.now()) {
				this.gatewayInformation = null;
			} else if (!force) {
				return this.gatewayInformation.data;
			}
		}

		const data = await this.options.fetchGatewayInformation();

		// For single sharded bots session_start_limit.reset_after will be 0, use 5 seconds as a minimum expiration time
		this.gatewayInformation = { data, expiresAt: Date.now() + (data.session_start_limit.reset_after || 5_000) };
		return this.gatewayInformation.data;
	}

	/**
	 * Updates your total shard count on-the-fly, spawning shards as needed
	 *
	 * @param shardCount - The new shard count to use
	 */
	public async updateShardCount(shardCount: number | null) {
		await this.strategy.destroy({ reason: 'User is adjusting their shards' });
		this.options.shardCount = shardCount;

		const shardIds = await this.getShardIds(true);
		await this.strategy.spawn(shardIds);

		return this;
	}

	/**
	 * Yields the total number of shards across for your bot, accounting for Discord recommendations
	 */
	public async getShardCount(): Promise<number> {
		if (this.options.shardCount) {
			return this.options.shardCount;
		}

		const shardIds = await this.getShardIds();
		return Math.max(...shardIds) + 1;
	}

	/**
	 * Yields the ids of the shards this manager should manage
	 */
	public async getShardIds(force = false): Promise<number[]> {
		if (this.shardIds && !force) {
			return this.shardIds;
		}

		let shardIds: number[];
		if (this.options.shardIds) {
			if (Array.isArray(this.options.shardIds)) {
				shardIds = this.options.shardIds;
			} else {
				const { start, end } = this.options.shardIds;
				shardIds = [...range({ start, end: end + 1 })];
			}
		} else {
			const data = await this.fetchGatewayInformation();
			shardIds = [...range(this.options.shardCount ?? data.shards)];
		}

		this.shardIds = shardIds;
		return shardIds;
	}

	public async connect() {
		const shardCount = await this.getShardCount();
		// Spawn shards and adjust internal state
		await this.updateShardCount(shardCount);

		const shardIds = await this.getShardIds();
		const data = await this.fetchGatewayInformation();

		if (data.session_start_limit.remaining < shardIds.length) {
			throw new Error(
				`Not enough sessions remaining to spawn ${shardIds.length} shards; only ${
					data.session_start_limit.remaining
				} remaining; resets at ${new Date(Date.now() + data.session_start_limit.reset_after).toISOString()}`,
			);
		}

		await this.strategy.connect();
	}

	public setToken(token: string): void {
		if (this.#token) {
			throw new Error('Token has already been set');
		}

		this.#token = token;
	}

	public destroy(options?: Omit<WebSocketShardDestroyOptions, 'recover'>) {
		return this.strategy.destroy(options);
	}

	public send(shardId: number, payload: GatewaySendPayload) {
		return this.strategy.send(shardId, payload);
	}

	public fetchStatus() {
		return this.strategy.fetchStatus();
	}

	public async [Symbol.asyncDispose]() {
		await this.destroy();
	}
}
