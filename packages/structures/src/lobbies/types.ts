import type { APIChannel, APIUser, MessageFlags, MessageType, Snowflake } from 'discord-api-types/v10';

/**
 * A lobby returned by Discord's HTTP API.
 *
 * @remarks These local API interfaces describe the documented lobby response objects, which are not included in
 * discord-api-types 0.38.57. Request-only fields such as `secret` and `idle_timeout_seconds` are not response fields.
 * @see {@link https://docs.discord.com/developers/resources/lobby#lobby-object}
 */
export interface APILobby {
	/** The id of the lobby. */
	id: Snowflake;
	/** The application that created the lobby. */
	application_id: Snowflake;
	/** Application-defined string key/value pairs. */
	metadata: Record<string, string> | null;
	/** The members of the lobby. */
	members: APILobbyMember[];
	/** The guild channel linked to the lobby. */
	linked_channel?: APIChannel;
}

/**
 * A member of a lobby.
 *
 * @remarks Defined locally because discord-api-types 0.38.57 does not include lobby response types.
 * The response's `additional_name` is optional, but not nullable; update requests accept `null` to clear it.
 * @see {@link https://docs.discord.com/developers/resources/lobby#lobby-member-object}
 */
export interface APILobbyMember {
	/** The id of the user. */
	id: Snowflake;
	/** Application-defined string key/value pairs. */
	metadata?: Record<string, string> | null;
	/** The lobby member flags bitfield (`CanLinkLobby` is `1 << 0`). */
	flags?: number;
	/** An additional display name for the member. */
	additional_name?: string;
}

/**
 * The snapshot of a lobby member included in a lobby message.
 *
 * @remarks Defined locally because discord-api-types 0.38.57 does not include lobby response types.
 * @see {@link https://docs.discord.com/developers/resources/lobby#send-lobby-message-lobby-message-object}
 */
export interface APILobbyMessageMember {
	/** The author's additional display name when the message was sent. */
	additional_name: string;
}

/**
 * A message sent to a lobby.
 *
 * @remarks Defined locally because discord-api-types 0.38.57 does not include lobby response types.
 * Lobby messages have their own documented shape and do not require the fields of an `APIMessage`.
 * @see {@link https://docs.discord.com/developers/resources/lobby#send-lobby-message-lobby-message-object}
 */
export interface APILobbyMessage {
	/** The id of the message. */
	id: Snowflake;
	/** The type of the message. */
	type: MessageType;
	/** The content of the message. */
	content: string;
	/** The id of the lobby the message was sent to. */
	lobby_id: Snowflake;
	/** Included for message compatibility; equal to `lobby_id`. */
	channel_id: Snowflake;
	/** The user who sent the message. */
	author: APIUser;
	/** The author's additional display name, captured when the message was sent. */
	lobby_member?: APILobbyMessageMember;
	/** Dispatch-only application-defined string key/value pairs. */
	metadata?: Record<string, string> | null;
	/** Application-defined moderation string key/value pairs. */
	moderation_metadata?: Record<string, string> | null;
	/** The message flags bitfield, including zero when no flags are set. */
	flags: MessageFlags | 0;
	/** The application that sent the message. */
	application_id: Snowflake;
}

/**
 * An invite to a lobby's linked channel.
 *
 * @remarks Defined locally because discord-api-types 0.38.57 does not include lobby response types.
 * @see {@link https://docs.discord.com/developers/resources/lobby#create-lobby-channel-invite-for-user-lobby-invite-object}
 */
export interface APILobbyInvite {
	/** The invite code for the lobby's linked channel. */
	code: string;
}
