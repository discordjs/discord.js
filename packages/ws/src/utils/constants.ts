import { Collection } from '@discordjs/collection';
import { lazy } from '@discordjs/util';
import { SuperProperties, type SuperPropertiesData } from '@discordjs/rest';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { SimpleShardingStrategy } from '../strategies/sharding/SimpleShardingStrategy.js';
import { SimpleIdentifyThrottler } from '../throttling/SimpleIdentifyThrottler.js';
import { DefaultCapabilities } from './capabilities.js';
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
	ZstdNative,
}

export const DefaultDeviceProperty = `@discordjs/ws [VI]{{inject}}[/VI]` as `@discordjs/ws ${string}`;

const getDefaultSessionStore = lazy(() => new Collection<number, SessionInfo | null>());

/** Default super properties instance for gateway IDENTIFY */
const defaultSuperProps = new SuperProperties();

export const CompressionParameterMap = {
	[CompressionMethod.ZlibNative]: 'zlib-stream',
	[CompressionMethod.ZlibSync]: 'zlib-stream',
	[CompressionMethod.ZstdNative]: 'zstd-stream',
} as const satisfies Record<CompressionMethod, string>;

/** Presence data for the user-style IDENTIFY payload */
export interface UserPresenceData {
	status: string;
	activities: unknown[];
	afk: boolean;
	since: number;
}

/** User-style IDENTIFY payload (replaces bot GatewayIdentifyData) */
export interface UserIdentifyData {
	token: string;
	capabilities: number;
	properties: SuperPropertiesData;
	presence: UserPresenceData;
	compress: boolean;
	client_state: { guild_versions: Record<string, never> };
	large_threshold?: number;
}

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions = {
	async buildIdentifyThrottler(_manager: WebSocketManager) {
		// User accounts don't need identify throttling (single shard)
		return new SimpleIdentifyThrottler(1);
	},
	buildStrategy: (manager) => new SimpleShardingStrategy(manager),
	shardCount: null,
	shardIds: null,
	largeThreshold: null,
	initialPresence: {
		status: 'online' as const,
		activities: [] as unknown[],
		afk: false,
		since: 0,
	},
	identifyProperties: defaultSuperProps.properties,
	capabilities: DefaultCapabilities,
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
