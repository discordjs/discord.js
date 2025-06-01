import process from 'node:process';
import { Collection } from '@discordjs/collection';
import { lazy } from '@discordjs/util';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { SimpleShardingStrategy } from '../strategies/sharding/SimpleShardingStrategy.js';
import { SimpleIdentifyThrottler } from '../throttling/SimpleIdentifyThrottler.js';
import type { SessionInfo, OptionalWebSocketManagerOptions, WebSocketManager } from '../ws/WebSocketManager.js';
import type { SendRateLimitState } from '../ws/WebSocketShard.js';

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
	ZlibNative,
	ZlibSync,
}

export const DefaultDeviceProperty = `@discordjs/ws [VI]{{inject}}[/VI]` as `@discordjs/ws ${string}`;

const getDefaultSessionStore = lazy(() => new Collection<number, SessionInfo | null>());

export const CompressionParameterMap = {
	[CompressionMethod.ZlibNative]: 'zlib-stream',
	[CompressionMethod.ZlibSync]: 'zlib-stream',
} as const satisfies Record<CompressionMethod, string>;

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions = {
	async buildIdentifyThrottler(manager: WebSocketManager) {
		const info = await manager.fetchGatewayInformation();
		return new SimpleIdentifyThrottler(info.session_start_limit.max_concurrency);
	},
	buildStrategy: (manager) => new SimpleShardingStrategy(manager),
	shardCount: null,
	shardIds: null,
	largeThreshold: null,
	initialPresence: null,
	identifyProperties: {
		browser: DefaultDeviceProperty,
		device: DefaultDeviceProperty,
		os: process.platform,
	},
	version: APIVersion,
	encoding: Encoding.JSON,
	compression: null,
	useIdentifyCompression: false,
	retrieveSessionInfo(shardId) {
		const store = getDefaultSessionStore();
		return store.get(shardId) ?? null;
	},
	updateSessionInfo(shardId: number, info: SessionInfo | null) {
		const store = getDefaultSessionStore();
		if (info) {
			store.set(shardId, info);
		} else {
			store.delete(shardId);
		}
	},
	handshakeTimeout: 30_000,
	helloTimeout: 60_000,
	readyTimeout: 15_000,
} as const satisfies Omit<OptionalWebSocketManagerOptions, 'fetchGatewayInformation' | 'token'>;

export const ImportantGatewayOpcodes = new Set([
	GatewayOpcodes.Heartbeat,
	GatewayOpcodes.Identify,
	GatewayOpcodes.Resume,
]);

export function getInitialSendRateLimitState(): SendRateLimitState {
	return {
		sent: 0,
		resetAt: Date.now() + 60_000,
	};
}
