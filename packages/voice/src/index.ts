export * from './joinVoiceChannel';
export * from './audio/index';
export * from './util/index';
export * from './receive/index';

export {
	VoiceConnection,
	type VoiceConnectionState,
	VoiceConnectionStatus,
	type VoiceConnectionConnectingState,
	type VoiceConnectionDestroyedState,
	type VoiceConnectionDisconnectedState,
	type VoiceConnectionDisconnectedBaseState,
	type VoiceConnectionDisconnectedOtherState,
	type VoiceConnectionDisconnectedWebSocketState,
	VoiceConnectionDisconnectReason,
	type VoiceConnectionReadyState,
	type VoiceConnectionSignallingState,
} from './VoiceConnection';

export { type JoinConfig, getVoiceConnection, getVoiceConnections, getGroups } from './DataStore';

/**
 * The [\@discordjs/voice](https://github.com/discordjs/discord.js/blob/main/packages/voice/#readme) version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{{inject}}[/VI]';
