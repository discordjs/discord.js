import { LobbyMemberFlagsBitField } from '../bitfields/LobbyMemberFlagsBitField.js';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isFieldSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
import type { APILobbyMember } from './types.js';

/**
 * Represents a member of a Discord lobby.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The nested `metadata` field remains in the raw data and is preserved by `toJSON()`.
 * An extending class may construct and expose metadata.
 */
export class LobbyMember<Omitted extends keyof APILobbyMember | '' = ''> extends Structure<APILobbyMember, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each lobby member.
	 */
	public static override readonly DataTemplate: Partial<APILobbyMember> = {};

	/**
	 * @param data - The raw data received from the API for the lobby member
	 */
	public constructor(data: Partialize<APILobbyMember, Omitted>) {
		super(data);
	}

	/**
	 * The id of the user in the lobby.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The lobby member flags as a bitfield, or `null` when flags are absent or omitted.
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number') ? new LobbyMemberFlagsBitField(this[kData].flags) : null;
	}

	/**
	 * The member's additional display name, if set.
	 */
	public get additionalName() {
		return this[kData].additional_name;
	}
}
