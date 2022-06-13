import type { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types/v10';

/**
 * Methods that are provided by the \@discordjs/voice library to implementations of
 * Discord gateway DiscordGatewayAdapters.
 */
export interface DiscordGatewayAdapterLibraryMethods {
	/**
	 * Call this when you receive a VOICE_SERVER_UPDATE payload that is relevant to the adapter.
	 *
	 * @param data - The inner data of the VOICE_SERVER_UPDATE payload
	 */
	onVoiceServerUpdate: (data: GatewayVoiceServerUpdateDispatchData) => void;
	/**
	 * Call this when you receive a VOICE_STATE_UPDATE payload that is relevant to the adapter.
	 *
	 * @param data - The inner data of the VOICE_STATE_UPDATE payload
	 */
	onVoiceStateUpdate: (data: GatewayVoiceStateUpdateDispatchData) => void;
	/**
	 * Call this when the adapter can no longer be used (e.g. due to a disconnect from the main gateway)
	 */
	destroy: () => void;
}

/**
 * Methods that are provided by the implementer of a Discord gateway DiscordGatewayAdapter.
 */
export interface DiscordGatewayAdapterImplementerMethods {
	/**
	 * Implement this method such that the given payload is sent to the main Discord gateway connection.
	 *
	 * @param payload - The payload to send to the main Discord gateway connection
	 *
	 * @returns `false` if the payload definitely failed to send - in this case, the voice connection disconnects
	 */
	sendPayload: (payload: any) => boolean;
	/**
	 * This will be called by \@discordjs/voice when the adapter can safely be destroyed as it will no
	 * longer be used.
	 */
	destroy: () => void;
}

/**
 * A function used to build adapters. It accepts a methods parameter that contains functions that
 * can be called by the implementer when new data is received on its gateway connection. In return,
 * the implementer will return some methods that the library can call - e.g. to send messages on
 * the gateway, or to signal that the adapter can be removed.
 */
export type DiscordGatewayAdapterCreator = (
	methods: DiscordGatewayAdapterLibraryMethods,
) => DiscordGatewayAdapterImplementerMethods;
