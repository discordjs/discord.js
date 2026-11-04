import { DiscordSnowflake } from '@sapphire/snowflake';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
import type { APILobby } from './types.js';

/**
 * Represents a Discord lobby.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The `members` array contains raw data for {@link LobbyMember} and `linked_channel` contains raw data for
 * {@link Channel}. An extending class must construct and store these child structures. These fields and the nested
 * `metadata` dictionary remain in the raw data and are preserved by `toJSON()` without corresponding base getters.
 */
export class Lobby<Omitted extends keyof APILobby | '' = ''> extends Structure<APILobby, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each lobby.
	 */
	public static override readonly DataTemplate: Partial<APILobby> = {};

	/**
	 * @param data - The raw data received from the API for the lobby
	 */
	public constructor(data: Partialize<APILobby, Omitted>) {
		super(data);
	}

	/**
	 * The id of the lobby.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the application that created the lobby.
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The timestamp the lobby was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the lobby was created at.
	 */
	public get createdDate() {
		const timestamp = this.createdTimestamp;
		return timestamp === null ? null : new Date(timestamp);
	}
}
