import type { Awaitable } from '@discordjs/util';
import type { APIGatewayBotInfo } from 'discord-api-types/v10';
import type { SessionInfo, WebSocketManager, WebSocketManagerOptions } from '../../ws/WebSocketManager.js';

export interface FetchingStrategyOptions
	extends Pick<
		WebSocketManagerOptions,
		| 'compression'
		| 'encoding'
		| 'handshakeTimeout'
		| 'helloTimeout'
		| 'identifyProperties'
		| 'initialPresence'
		| 'intents'
		| 'largeThreshold'
		| 'readyTimeout'
		| 'token'
		| 'useIdentifyCompression'
		| 'version'
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
	 * Resolves once the given shard should be allowed to identify
	 * This should correctly handle the signal and reject with an abort error if the operation is aborted.
	 * Other errors will cause the shard to reconnect.
	 */
	waitForIdentify(shardId: number, signal: AbortSignal): Promise<void>;
}

export async function managerToFetchingStrategyOptions(manager: WebSocketManager): Promise<FetchingStrategyOptions> {
	return {
		compression: manager.options.compression,
		encoding: manager.options.encoding,
		handshakeTimeout: manager.options.handshakeTimeout,
		helloTimeout: manager.options.helloTimeout,
		identifyProperties: manager.options.identifyProperties,
		initialPresence: manager.options.initialPresence,
		intents: manager.options.intents,
		largeThreshold: manager.options.largeThreshold,
		readyTimeout: manager.options.readyTimeout,
		token: manager.token,
		useIdentifyCompression: manager.options.useIdentifyCompression,
		version: manager.options.version,

		gatewayInformation: await manager.fetchGatewayInformation(),
		shardCount: await manager.getShardCount(),
	};
}
