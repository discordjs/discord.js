import { DiscordSnowflake } from '@sapphire/snowflake';
import { MessageFlagsBitField } from '../bitfields/MessageFlagsBitField.js';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isFieldSet, isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
import type { APILobbyMessage } from './types.js';

/**
 * Represents a message sent to a Discord lobby.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The `author` contains raw data for {@link User} and `lobby_member` contains raw data for
 * {@link LobbyMessageMember}. An extending class must construct and store these child structures. These fields and the
 * nested `metadata` and `moderation_metadata` dictionaries remain in the raw data and are preserved by `toJSON()` without
 * corresponding base getters.
 */
export class LobbyMessage<Omitted extends keyof APILobbyMessage | '' = ''> extends Structure<APILobbyMessage, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each lobby message.
	 */
	public static override readonly DataTemplate: Partial<APILobbyMessage> = {};

	/**
	 * @param data - The raw data received from the API for the lobby message
	 */
	public constructor(data: Partialize<APILobbyMessage, Omitted>) {
		super(data);
	}

	/**
	 * The id of the message.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of the message.
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The content of the message.
	 */
	public get content() {
		return this[kData].content;
	}

	/**
	 * The id of the lobby the message was sent to.
	 */
	public get lobbyId() {
		return this[kData].lobby_id;
	}

	/**
	 * The channel id included for message compatibility, equal to the lobby id.
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The message flags as a bitfield, or `null` when flags are absent or omitted.
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number') ? new MessageFlagsBitField(this[kData].flags) : null;
	}

	/**
	 * The id of the application that sent the message.
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The timestamp the message was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the message was created at.
	 */
	public get createdDate() {
		const timestamp = this.createdTimestamp;
		return timestamp === null ? null : new Date(timestamp);
	}
}
