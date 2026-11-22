import type { APIInteractionDataResolved } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents data for users, members, channels, and roles in the message's auto-populated select menus.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `User`, `Channel`, `Role`, `Message`, `GuildMember`, `Attachment`,  which need to be instantiated and stored by an extending class using it
 */
export abstract class ResolvedInteractionData<
	Omitted extends keyof APIInteractionDataResolved | '' = '',
> extends Structure<APIInteractionDataResolved, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIInteractionDataResolved, Omitted>) {
		super(data);
	}
}
