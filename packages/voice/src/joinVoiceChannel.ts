import type { JoinConfig } from './DataStore';
import { createVoiceConnection } from './VoiceConnection.js';
import type { DiscordGatewayAdapterCreator } from './util/adapter';

/**
 * The options that can be given when creating a voice connection.
 */
export interface CreateVoiceConnectionOptions {
	adapterCreator: DiscordGatewayAdapterCreator;

	/**
	 * If true, debug messages will be enabled for the voice connection and its
	 * related components. Defaults to false.
	 */
	debug?: boolean | undefined;
}

/**
 * The options that can be given when joining a voice channel.
 */
export interface JoinVoiceChannelOptions {
	/**
	 * The id of the Discord voice channel to join.
	 */
	channelId: string;

	/**
	 * An optional group identifier for the voice connection.
	 */
	group?: string;

	/**
	 * The id of the guild that the voice channel belongs to.
	 */
	guildId: string;

	/**
	 * Whether to join the channel deafened (defaults to true)
	 */
	selfDeaf?: boolean;

	/**
	 * Whether to join the channel muted (defaults to true)
	 */
	selfMute?: boolean;
}

/**
 * Creates a VoiceConnection to a Discord voice channel.
 *
 * @param options - the options for joining the voice channel
 */
export function joinVoiceChannel(options: CreateVoiceConnectionOptions & JoinVoiceChannelOptions) {
	const joinConfig: JoinConfig = {
		selfDeaf: true,
		selfMute: false,
		group: 'default',
		...options,
	};

	return createVoiceConnection(joinConfig, {
		adapterCreator: options.adapterCreator,
		debug: options.debug,
	});
}
