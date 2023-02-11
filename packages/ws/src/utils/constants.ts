import process from 'node:process';
import { Collection } from '@discordjs/collection';
import { lazy } from '@discordjs/util';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { SimpleShardingStrategy } from '../strategies/sharding/SimpleShardingStrategy.js';
import type { SessionInfo, OptionalWebSocketManagerOptions } from '../ws/WebSocketManager.js';
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
	ZlibStream = 'zlib-stream',
}

export const DefaultDeviceProperty = `@discordjs/ws [VI]{{inject}}[/VI]` as `@discordjs/ws ${string}`;

const getDefaultSessionStore = lazy(() => new Collection<number, SessionInfo | null>());

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions = {
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
} as const satisfies OptionalWebSocketManagerOptions;

export const ImportantGatewayOpcodes = new Set([
	GatewayOpcodes.Heartbeat,
	GatewayOpcodes.Identify,
	GatewayOpcodes.Resume,
]);

export function getInitialSendRateLimitState(): SendRateLimitState {
	return {
		remaining: 120,
		resetAt: Date.now() + 60_000,
	};
}
