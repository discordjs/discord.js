import { REST } from '@discordjs/rest';
import { APIVersion } from 'discord-api-types/v10';
import type { WebSocketManagerOptions } from '../struct/WebSocketManager';

/**
 * Default options used by the manager
 */
export const DefaultWebSocketManagerOptions: WebSocketManagerOptions = {
	shardCount: null,
	shardIds: null,
	get rest() {
		return new REST();
	},
	version: APIVersion,
	retrieveSessionInfo() {
		return null;
	},
	updateSessionInfo() {
		// eslint-disable-next-line no-useless-return
		return;
	},
};
