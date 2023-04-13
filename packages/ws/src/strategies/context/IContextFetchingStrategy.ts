import type { Awaitable } from '@discordjs/util';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import type { SessionInfo, WebSocketManager, WebSocketManagerOptions } from '../../ws/WebSocketManager';

export interface FetchingStrategyOptions
	extends Omit<
		WebSocketManagerOptions,
		'buildStrategy' | 'rest' | 'retrieveSessionInfo' | 'shardCount' | 'shardIds' | 'updateSessionInfo'
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
	waitForIdentify(shardId: number): Promise<void>;
}

export async function managerToFetchingStrategyOptions(manager: WebSocketManager): Promise<FetchingStrategyOptions> {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { buildStrategy, retrieveSessionInfo, updateSessionInfo, shardCount, shardIds, rest, ...managerOptions } =
		manager.options;

	return {
		...managerOptions,
		gatewayInformation: await manager.fetchGatewayInformation(),
		shardCount: await manager.getShardCount(),
	};
}
