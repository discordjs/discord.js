import type { GatewayGuildMembersChunkPresence } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any presence update on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `Activity`, `ClientStatus` which need to be instantiated and stored by an extending class using it
 */
export class Presence<Omitted extends keyof GatewayGuildMembersChunkPresence | '' = ''> extends Structure<
	GatewayGuildMembersChunkPresence,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each presence update
	 */
	public static override readonly DataTemplate: Partial<GatewayGuildMembersChunkPresence> = {};

	/**
	 * @param data - The raw data received from the API for the presence update
	 */
	public constructor(data: Partialize<GatewayGuildMembersChunkPresence, Omitted>) {
		super(data);
	}

	/**
	 * The user's new status
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-presence-status-types}
	 */
	public get status() {
		return this[kData].status;
	}
}
