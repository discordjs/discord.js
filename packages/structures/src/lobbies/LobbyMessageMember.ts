import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';
import type { APILobbyMessageMember } from './types.js';

/**
 * Represents the snapshot of a lobby member's display name attached to a lobby message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class LobbyMessageMember<Omitted extends keyof APILobbyMessageMember | '' = ''> extends Structure<
	APILobbyMessageMember,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each lobby message member.
	 */
	public static override readonly DataTemplate: Partial<APILobbyMessageMember> = {};

	/**
	 * @param data - The raw data received from the API for the lobby message member
	 */
	public constructor(data: Partialize<APILobbyMessageMember, Omitted>) {
		super(data);
	}

	/**
	 * The author's additional display name when the message was sent.
	 */
	public get additionalName() {
		return this[kData].additional_name;
	}
}
