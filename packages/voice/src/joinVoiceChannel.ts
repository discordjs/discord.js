import type { JoinConfig } from './DataStore';
import { createVoiceConnection } from './VoiceConnection';
import type { DiscordGatewayAdapterCreator } from './util/adapter';

/**
 * The options that can be given when creating a voice connection.
 */
export interface CreateVoiceConnectionOptions {
	/**
	 * If true, debug messages will be enabled for the voice connection and its
	 * related components. Defaults to false.
	 */
	debug?: boolean | undefined;

	adapterCreator: DiscordGatewayAdapterCreator;
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

	/**
	 * An optional group identifier for the voice connection.
	 */
	group?: string;
}

/**
 * Creates a VoiceConnection to a Discord voice channel.
 *
 * @param voiceChannel - the voice channel to connect to
 * @param options - the options for joining the voice channel
 */
export function joinVoiceChannel(options: JoinVoiceChannelOptions & CreateVoiceConnectionOptions) {
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
