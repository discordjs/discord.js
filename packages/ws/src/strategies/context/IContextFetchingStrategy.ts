import type { Awaitable } from '@discordjs/util';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import type { SessionInfo, WebSocketManager, WebSocketManagerOptions } from '../../ws/WebSocketManager';

export interface FetchingStrategyOptions
	extends Omit<
		WebSocketManagerOptions,
		| 'buildIdentifyThrottler'
		| 'buildStrategy'
		| 'rest'
		| 'retrieveSessionInfo'
		| 'shardCount'
		| 'shardIds'
		| 'updateSessionInfo'
	> {
	readonly gatewayInformation: APIGatewayBotInfo;
	readonly shardCount: number;
}

/**
 * Strategies responsible solely for making manager information accessible
 */
export interface IContextFetchingStrategy {
	readonly options: FetchingStrategyOptions;
	retrieveSessionInfo(shardId: number): Awaitable<SessionInfo | null>;
	updateSessionInfo(shardId: number, sessionInfo: SessionInfo | null): Awaitable<void>;
	/**
	 * Resolves once the given shard should be allowed to identify, or rejects if the operation was aborted
	 */
	waitForIdentify(shardId: number, signal: AbortSignal): Promise<void>;
}

export async function managerToFetchingStrategyOptions(manager: WebSocketManager): Promise<FetchingStrategyOptions> {
	/* eslint-disable @typescript-eslint/unbound-method */
	const {
		buildIdentifyThrottler,
		buildStrategy,
		retrieveSessionInfo,
		updateSessionInfo,
		shardCount,
		shardIds,
		rest,
		...managerOptions
	} = manager.options;
	/* eslint-enable @typescript-eslint/unbound-method */

	return {
		...managerOptions,
		gatewayInformation: await manager.fetchGatewayInformation(),
		shardCount: await manager.getShardCount(),
	};
}
