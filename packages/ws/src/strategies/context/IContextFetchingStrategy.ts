import type { Awaitable } from '@vladfrangu/async_event_emitter';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import type { SessionInfo, WebSocketManagerOptions } from '../../struct/WebSocketManager';

/**
 * Strategies responsible solely for making manager information accessible
 */
export interface IContextFetchingStrategy {
	readonly options: Omit<WebSocketManagerOptions, 'retrieveSessionInfo' | 'updateSessionInfo'>;
	fetchGatewayInformation: () => Awaitable<APIGatewayBotInfo>;
	getShardCount: () => Awaitable<number>;
	retrieveSessionInfo: (shardId: number) => Awaitable<SessionInfo | null>;
	updateSessionInfo: (sessionInfo: SessionInfo) => Awaitable<void>;
}
