import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Channel } from '../Channel.js';

export interface ThreadOnlyChannelMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia = ChannelType.GuildForum | ChannelType.GuildMedia,
> extends Channel<Type> {}

/**
 * @remarks has an array of sub-structures {@link ForumTag} that extending mixins should add to their DataTemplate and _optimizeData
 */
export class ThreadOnlyChannelMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia = ChannelType.GuildForum | ChannelType.GuildMedia,
> {
	/**
	 * The emoji to show in the add reaction button on a thread in this channel.
	 */
	public get defaultReactionEmoji() {
		return this[kData].default_reaction_emoji;
	}

	/**
	 * The default sort order type used to order posts in this channel.
	 *
	 * @defaultValue `null` – indicates a preferred sort order hasn't been set.
	 */
	public get defaultSortOrder() {
		return this[kData].default_sort_order!;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 */
	public isThreadOnly(): this is ThreadOnlyChannelMixin & this {
		return true;
	}
}
