import type { APIGuildWelcomeScreenChannel } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a channel in a guild's welcome screen.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class WelcomeChannel<Omitted extends keyof APIGuildWelcomeScreenChannel | '' = ''> extends Structure<
	APIGuildWelcomeScreenChannel,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each WelcomeChannel
	 */
	public static override readonly DataTemplate: Partial<APIGuildWelcomeScreenChannel> = {};

	/**
	 * @param data - The raw data received from the API for the welcome channel
	 */
	public constructor(data: Partialize<APIGuildWelcomeScreenChannel, Omitted>) {
		super(data);
	}

	/**
	 * The channel's id
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The description shown for the channel
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The emoji id, if the emoji is custom
	 */
	public get emojiId() {
		return this[kData].emoji_id;
	}

	/**
	 * The emoji name if custom, the unicode character if standard, or null if no emoji is set
	 */
	public get emojiName() {
		return this[kData].emoji_name;
	}
}
