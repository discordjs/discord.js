import type { APIVoiceState } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kData, kRequestToSpeakTimestamp } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any voice state on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `GuildMember` which needs to be instantiated and stored by an extending class using it
 */
export class VoiceState<Omitted extends keyof APIVoiceState | '' = 'request_to_speak_timestamp'> extends Structure<
	APIVoiceState,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each voice state
	 */
	public static override readonly DataTemplate: Partial<APIVoiceState> = {
		set request_to_speak_timestamp(_: string) {},
	};

	protected [kRequestToSpeakTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the voice state
	 */
	public constructor(data: Partialize<APIVoiceState, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	public override optimizeData(data: Partial<APIVoiceState>) {
		if (data.request_to_speak_timestamp) {
			this[kRequestToSpeakTimestamp] = Date.parse(data.request_to_speak_timestamp);
		}
	}

	/**
	 * The guild id this voice state is for
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The channel id this user is connected to
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The user id this voice state is for
	 */
	public get userId() {
		return this[kData].user_id;
	}

	/**
	 * The session id for this voice state
	 */
	public get sessionId() {
		return this[kData].session_id;
	}

	/**
	 * Whether this user is deafened by the server
	 */
	public get deaf() {
		return this[kData].deaf;
	}

	/**
	 * Whether this user is muted by the server
	 */
	public get mute() {
		return this[kData].mute;
	}

	/**
	 * Whether this user is locally deafened
	 */
	public get selfDeaf() {
		return this[kData].self_deaf;
	}

	/**
	 * Whether this user is locally muted
	 */
	public get selfMute() {
		return this[kData].self_mute;
	}

	/**
	 * Whether this user is streaming using "Go Live"
	 */
	public get selfStream() {
		return this[kData].self_stream;
	}

	/**
	 * Whether this user's camera is enabled
	 */
	public get selfVideo() {
		return this[kData].self_video;
	}

	/**
	 * Whether this user's permission to speak is denied
	 */
	public get suppress() {
		return this[kData].suppress;
	}

	/**
	 * The timestamp at which the user requested to speak
	 */
	public get requestToSpeakTimestamp() {
		return this[kRequestToSpeakTimestamp] ? dateToDiscordISOTimestamp(new Date(this[kRequestToSpeakTimestamp])) : null;
	}

	/**
	 * The time at which the user requested to speak
	 */
	public get requestToSpeakAt() {
		return this.requestToSpeakTimestamp ? new Date(this.requestToSpeakTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const requestToSpeakTimestamp = this[kRequestToSpeakTimestamp];

		if (requestToSpeakTimestamp) {
			clone.request_to_speak_timestamp = dateToDiscordISOTimestamp(new Date(requestToSpeakTimestamp));
		}

		return clone;
	}
}
