import { REST } from '@discordjs/rest';
import { APIVersion, GatewayOpcodes } from 'discord-api-types/v10';
import { Encoding, WebSocketManagerOptions } from '../struct/WebSocketManager';

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions: WebSocketManagerOptions = {
	shardCount: null,
	shardIds: null,
	intents: 0,
	largeThreshold: null,
	initialPresence: null,
	identifyProperties: {
		browser: '@discordjs/ws',
		device: '@discordjs/ws',
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
