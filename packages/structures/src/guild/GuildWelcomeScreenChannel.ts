import type { APIGuildWelcomeScreenChannel } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import type { Partialize } from '../utils/types';

/**
 * Represents a welcome screen channel on Discord.
 *
 */
export class GuildWelcomeScreenChannel<Omitted extends keyof APIGuildWelcomeScreenChannel | '' = ''> extends Structure<
	APIGuildWelcomeScreenChannel,
	Omitted
> {
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
