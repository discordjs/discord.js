import type { APIGuildWelcomeScreenChannel } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a welcome screen channel on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GuildWelcomeScreenChannel<Omitted extends keyof APIGuildWelcomeScreenChannel | '' = ''> extends Structure<
	APIGuildWelcomeScreenChannel,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each welcome screen channel.
	 */
	public static override readonly DataTemplate: Partial<APIGuildWelcomeScreenChannel> = {};

	/**
	 * @param data - The raw data from the API for the welcome screen channel.
	 */
	public constructor(data: Partialize<APIGuildWelcomeScreenChannel, Omitted>) {
		super(data);
	}

	/**
	 * The channel's ID.
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The description of the welcome screen channel.
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The ID of the emoji shown (if the emoji is custom).
	 */
	public get emojiId() {
		return this[kData].emoji_id;
	}

	/**
	 * The name of the emoji if custom, the unicode character if standard, or `null` if no emoji is set.
	 */
	public get emojiName() {
		return this[kData].emoji_name;
	}
}
