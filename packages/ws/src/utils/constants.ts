import { readFileSync } from 'fs';
import { join } from 'path';
import { Collection } from '@discordjs/collection';
import { REST } from '@discordjs/rest';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { lazy } from './utils';
import { Encoding, OptionalWebSocketManagerOptions, SessionInfo } from '../struct/WebSocketManager';

const packageJson = readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const Package = JSON.parse(packageJson);

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
export const DefaultDeviceProperty = `@discordjs/ws ${Package.version}`;

const getDefaultSessionStore = lazy(() => new Collection<number, SessionInfo | null>());

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions: OptionalWebSocketManagerOptions = {
	shardCount: null,
	shardIds: null,
	largeThreshold: null,
	initialPresence: null,
	identifyProperties: {
		browser: DefaultDeviceProperty,
		device: DefaultDeviceProperty,
		os: process.platform,
	},
	get rest() {
		return new REST();
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
	helloTimeout: 60_000,
	readyTimeout: 15_000,
};

export const ImportantGatewayOpcodes = new Set([
	GatewayOpcodes.Heartbeat,
	GatewayOpcodes.Identify,
	GatewayOpcodes.Resume,
]);
