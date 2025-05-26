export * from './joinVoiceChannel';
export * from './audio/index';
export * from './util/index';
export * from './receive/index';

export {
	Networking,
	type ConnectionData,
	type ConnectionOptions,
	type NetworkingState,
	type NetworkingResumingState,
	type NetworkingSelectingProtocolState,
	type NetworkingUdpHandshakingState,
	type NetworkingClosedState,
	type NetworkingIdentifyingState,
	type NetworkingOpeningWsState,
	type NetworkingReadyState,
	NetworkingStatusCode,
	VoiceUDPSocket,
	VoiceWebSocket,
	type SocketConfig,
} from './networking/index.js';

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
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/voice#readme | @discordjs/voice} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
export const version = '[VI]{{inject}}[/VI]' as string;
