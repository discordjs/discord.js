import { Collection } from '@discordjs/collection';
import type { REST } from '@discordjs/rest';
import { APIGatewayBotInfo, RESTGetAPIGatewayBotResult, Routes } from 'discord-api-types/v10';
import { WebSocketShard } from './WebSocketShard';
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
	 * The REST instance to use for fetching gateway information
	 */
	rest: REST;
	/**
	 * The gateway version to use
	 * @default '10'
	 */
	version: string;
	/**
	 * Function used to retrieve session information (and resume) for a given shard
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

	private readonly shards = new Collection<number, WebSocketShard>();

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
				return this.gatewayInformation;
			}
		}

		if (this.gatewayInformation && !force) {
			return this.gatewayInformation;
		}

		const data = (await this.options.rest.get(Routes.gatewayBot())) as RESTGetAPIGatewayBotResult;

		this.gatewayInformation = { data, expiresAt: Date.now() + data.session_start_limit.reset_after };
		return this.gatewayInformation;
	}

	public getToken(): string | null {
		return this.#token;
	}

	/**
	 * Updates your total shard count on-the-fly.
	 * @param shardCount The new shard count to use
	 */
	public async updateShardCount(shardCount: number | null) {
		// TODO(DD): Destroy current shards before clearing the collection

		this.shards.clear();

		const shardIds = await this.getShardIds();
		for (const shardId of shardIds) {
			// TODO(DD): Connect...?
			this.shards.set(shardId, new WebSocketShard());
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

		const info = await this.fetchGatewayInformation();
		return info.data.shards;
	}

	/**
	 * Yields the IDs of the shards this manager should manage
	 */
	public async getShardIds(): Promise<number[]> {
		if (this.options.shardIds) {
			if (Array.isArray(this.options.shardIds)) {
				return this.options.shardIds;
			}
			return range(this.options.shardIds);
		}

		const info = await this.fetchGatewayInformation();
		return range({ start: 0, end: info.data.shards });
	}
}
