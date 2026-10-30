import type { APIChannelMention } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the mention of a channel on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ChannelMention<Omitted extends keyof APIChannelMention | '' = ''> extends Structure<
	APIChannelMention,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each ChannelMention.
	 */
	public static override DataTemplate: Partial<APIChannelMention> = {};

	/**
	 * @param data - The raw data received from the API for the channel mention
	 */
	public constructor(data: Partialize<APIChannelMention, Omitted>) {
		super(data);
	}

	/**
	 * The type of the mentioned channel
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The name of the mentioned channel
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The id of the mentioned channel
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the guild the mentioned channel is in
	 */
	public get guildId() {
		return this[kData].guild_id;
	}
}
