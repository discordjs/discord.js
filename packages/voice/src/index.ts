export * from './joinVoiceChannel.js';
export * from './audio/index.js';
export * from './util/index.js';
export * from './receive/index.js';

export {
	Networking,
	type ConnectionData,
	type ConnectionOptions,
	type NetworkingOptions,
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
	type BinaryWebSocketMessage,
	DAVESession,
	type SessionMethods,
	type DAVESessionOptions,
	type TransitionResult,
	type ProposalsResult,
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
} from './VoiceConnection.js';

export { type JoinConfig, getVoiceConnection, getVoiceConnections, getGroups } from './DataStore.js';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/voice#readme | @discordjs/voice} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
export const version = '[VI]{{inject}}[/VI]' as string;
