import type { REST } from '@discordjs/rest';
import {
	APIGatewayBotInfo,
	GatewayIdentifyProperties,
	GatewayPresenceUpdateData,
	RESTGetAPIGatewayBotResult,
	Routes,
} from 'discord-api-types/v10';
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
 * Options for the WebSocketManager
 */
export interface WebSocketManagerOptions {
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
	 * The intents to request
	 */
	// Wonder if there's a better abstraction that could be done here?
	// TOOD(DD): Make intents required
	intents: number;
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
	updateSessionInfo: (sessionInfo: SessionInfo) => Awaitable<void>;
	/**
	 * How long to wait for a shard's HELLO packet before giving up
	 */
	helloTimeout: number | null;
	/**
	 * How long to wait for a shard's READY packet before giving up
	 */
	readyTimeout: number | null;
}

export class WebSocketManager {
	/**
	 * The options being used by this manager
	 */
	public readonly options: WebSocketManagerOptions;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#token: string | null = null;

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

	public constructor(options?: Partial<WebSocketManagerOptions>) {
		this.options = { ...DefaultWebSocketManagerOptions, ...options };
	}

	/**
	 * Sets the token this manager should use
	 */
	public setToken(token: string) {
		this.#token = token;
		this.options.rest.setToken(token);
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
	 * Updates your total shard count on-the-fly.
	 * @param shardCount The new shard count to use
	 */
	public async updateShardCount(shardCount: number | null) {
		// TODO(DD)

		const shardIds = await this.getShardIds(true);
		for (const shardId of shardIds) {
		}

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

		const data = await this.fetchGatewayInformation();
		return data.shards;
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
		shardIds = range({ start: 0, end: data.shards });

		this.shardIds = shardIds;
		return shardIds;
	}
}
