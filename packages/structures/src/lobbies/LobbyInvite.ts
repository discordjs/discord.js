import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';
import type { APILobbyInvite } from './types.js';

/**
 * Represents an invite to a Discord lobby's linked channel.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The lobby invite response contains only a code; it does not contain the fields of a channel `Invite`.
 */
export class LobbyInvite<Omitted extends keyof APILobbyInvite | '' = ''> extends Structure<APILobbyInvite, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each lobby invite.
	 */
	public static override readonly DataTemplate: Partial<APILobbyInvite> = {};

	/**
	 * @param data - The raw data received from the API for the lobby invite
	 */
	public constructor(data: Partialize<APILobbyInvite, Omitted>) {
		super(data);
	}

	/**
	 * The invite code for the lobby's linked channel.
	 */
	public get code() {
		return this[kData].code;
	}
}
