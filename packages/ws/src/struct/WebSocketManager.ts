import type { REST } from '@discordjs/rest';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
	APIGatewayBotInfo,
	GatewayIdentifyProperties,
	GatewayPresenceUpdateData,
	RESTGetAPIGatewayBotResult,
	Routes,
} from 'discord-api-types/v10';
import type { WebSocketShardDestroyOptions, WebSocketShardEventsMap } from './WebSocketShard';
import type { IShardingStrategy } from '../strategies/sharding/IShardingStrategy';
import { SimpleShardingStrategy } from '../strategies/sharding/SimpleShardingStrategy';
import { DefaultWebSocketManagerOptions } from '../utils/constants';
import { Awaitable, range } from '../utils/utils';

/**
 * Represents a range of shard ids
 */
export interface ShardRange {
	start: number;
	end: number;
}

/**
 * Session information for a given shard, used to resume a session
 */
export interface SessionInfo {
	/**
	 * Session id for this shard
	 */
	sessionId: string;
	/**
	 * The sequence number of the last message sent by the shard
	 */
	sequence: number;
	/**
	 * The id of the shard
	 */
	shardId: number;
	/**
	 * The total number of shards at the time of this shard identifying
	 */
	shardCount: number;
}

/**
 * Valid encoding types
 */
export enum Encoding {
	JSON = 'json',
}

/**
 * Valid compression methods
 */
export enum CompressionMethod {
	ZlibStream = 'zlib-stream',
}

/**
 * Required options for the WebSocketManager
 */
export interface RequiredWebsSocketManagerOptions {
	/**
	 * The token to use for identifying with the gateway
	 */
	token: string;
	/**
	 * The intents to request
	 */
	// Wonder if there's a better abstraction that could be done here?
	intents: number;
}

/**
 * Optional additional configuration for the WebSocketManager
 */
export interface OptionalWebSocketManagerOptions {
	/**
	 * The total number of shards across all WebsocketManagers you intend to instantiate.
	 * Use `null` to use Discord's recommended shard count
	 */
	shardCount: number | null;
	/**
	 * The IDs of the shards this WebSocketManager should manage.
	 * Use `null` to simply spawn 0 through `shardCount - 1`
	 * @example
	 * const manager = new WebSocketManager({
	 *   shardIds: [1, 3, 7], // spawns shard 1, 3, and 7, nothing else
	 * });
	 * @example
	 * const manager = new WebSocketManager({
	 *   shardIds: {
	 *     start: 3,
	 *     end: 6,
	 *   }, // spawns shards 3, 4, 5, and 6
	 * });
	 */
	shardIds: number[] | ShardRange | null;
	/**
	 * Value between 50 and 250, total number of members where the gateway will stop sending offline members in the guild member list
	 */
	largeThreshold: number | null;
	/**
	 * Initial presence data to send to the gateway when identifying
	 */
	initialPresence: GatewayPresenceUpdateData | null;
	/**
	 * Properties to send to the gateway when identifying
	 */
	identifyProperties: GatewayIdentifyProperties;
	/**
	 * The REST instance to use for fetching gateway information
	 */
	rest: REST;
	/**
	 * The gateway version to use
	 * @default '10'
	 */
	version: string;
	/**
	 * The encoding to use
	 * @default 'json'
	 */
	encoding: Encoding;
	/**
	 * The compression method to use
	 * @default null (no compression)
	 */
	compression: CompressionMethod | null;
	/**
	 * Function used to retrieve session information (and attempt to resume) for a given shard
	 * @example
	 * const manager = new WebSocketManager({
	 *   async retrieveSessionInfo(shardId): Awaitable<SessionInfo | null> {
	 *     // Fetch this info from redis or similar
	 *     return { sessionId: string, sequence: number };
	 *     // Return null if no information is found
	 *   },
	 * });
	 */
	retrieveSessionInfo: (shardId: number) => Awaitable<SessionInfo | null>;
	/**
	 * Function used to store session information for a given shard
	 */
	updateSessionInfo: (shardId: number, sessionInfo: SessionInfo | null) => Awaitable<void>;
	/**
	 * How long to wait for a shard's HELLO packet before giving up
	 */
	helloTimeout: number | null;
	/**
	 * How long to wait for a shard's READY packet before giving up
	 */
	readyTimeout: number | null;
}

export type WebSocketManagerOptions = RequiredWebsSocketManagerOptions & OptionalWebSocketManagerOptions;

export type ManagerShardEventsMap = {
	[K in keyof WebSocketShardEventsMap]: [
		WebSocketShardEventsMap[K] extends [] ? { shardId: number } : WebSocketShardEventsMap[K][0] & { shardId: number },
	];
};

export class WebSocketManager extends AsyncEventEmitter<ManagerShardEventsMap> {
	/**
	 * The options being used by this manager
	 */
	public readonly options: WebSocketManagerOptions;

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
	 * @default SimpleManagerToShardStrategy
	 */
	private strategy: IShardingStrategy = new SimpleShardingStrategy(this);

	public constructor(options: RequiredWebsSocketManagerOptions & Partial<OptionalWebSocketManagerOptions>) {
		super();
		this.options = { ...DefaultWebSocketManagerOptions, ...options };
		this.options.rest.setToken(this.options.token);
	}

	public setStrategy(strategy: IShardingStrategy) {
		this.strategy = strategy;
		return this;
	}

	/**
	 * Fetches the gateway information from Discord - or returns it from cache if available
	 * @param force Whether to ignore the cache and force a fresh fetch
	 */
	public async fetchGatewayInformation(force = false) {
		if (this.gatewayInformation) {
			if (this.gatewayInformation.expiresAt <= Date.now()) {
				this.gatewayInformation = null;
			} else if (!force) {
				return this.gatewayInformation.data;
			}
		}

		const data = (await this.options.rest.get(Routes.gatewayBot())) as RESTGetAPIGatewayBotResult;

		this.gatewayInformation = { data, expiresAt: Date.now() + data.session_start_limit.reset_after };
		return this.gatewayInformation.data;
	}

	/**
	 * Updates your total shard count on-the-fly, spawning shards as needed
	 * @param shardCount The new shard count to use
	 */
	public async updateShardCount(shardCount: number | null) {
		await this.strategy.destroy();

		const shardIds = await this.getShardIds(true);
		await this.strategy.spawn(shardIds);

		this.options.shardCount = shardCount;
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
		return shardIds.length;
	}

	/**
	 * Yields the IDs of the shards this manager should manage
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
				shardIds = range(this.options.shardIds);
			}
		}

		const data = await this.fetchGatewayInformation();
		shardIds ??= range({ start: 0, end: (this.options.shardCount ?? data.shards) - 1 });

		this.shardIds = shardIds;
		return shardIds;
	}

	public async connect() {
		const shardCount = await this.getShardCount();
		// First, make sure all our shards are spawned
		await this.updateShardCount(shardCount);
		await this.strategy.connect();
	}

	public destroy(options?: WebSocketShardDestroyOptions) {
		return this.strategy.destroy(options);
	}
}
