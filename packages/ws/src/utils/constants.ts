import { REST } from '@discordjs/rest';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { Encoding, OptionalWebSocketManagerOptions } from '../struct/WebSocketManager';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const Package = require('../../package.json');

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
export const DefaultDeviceProperty = `@discordjs/ws ${Package.version}`;

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
	retrieveSessionInfo() {
		return null;
	},
	updateSessionInfo() {
		// eslint-disable-next-line no-useless-return
		return;
	},
	helloTimeout: 60_000,
	readyTimeout: 15_000,
};

export const ImportantGatewayOpcodes = new Set([
	GatewayOpcodes.Heartbeat,
	GatewayOpcodes.Identify,
	GatewayOpcodes.Resume,
]);
