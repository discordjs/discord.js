import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import type { SessionInfo, WebSocketManagerOptions } from '../struct/WebSocketManager';
import type { Awaitable } from '../utils/utils';

export interface IStrategy {
	readonly token: string;
	readonly options: Omit<WebSocketManagerOptions, 'retrieveSessionInfo' | 'updateSessionInfo'>;
	connect: () => Promise<void>;
	destroy: () => void;
	fetchGatewayInformation: () => Awaitable<APIGatewayBotInfo>;
	fetchShardCount: () => Awaitable<number>;
	retrieveSessionInfo: (shardId: number) => Awaitable<SessionInfo | null>;
	updateSessionInfo: (sessionInfo: SessionInfo) => Awaitable<void>;
}
