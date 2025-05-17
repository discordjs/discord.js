import type { APIGuildForumTag, ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel, ChannelDataType } from '../Channel';
import { ForumTag } from '../ForumTag';

export interface ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia>
	extends Channel<Type> {
	/**
	 * The set of tags that can be used in this channel.
	 */
	availableTags: readonly ForumTag[];
}

export class ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia> {
	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 */
	public static DataTemplate: Partial<ChannelDataType<ChannelType.GuildForum | ChannelType.GuildMedia>> = {
		set available_tags(_: APIGuildForumTag[]) {},
	};

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		this.availableTags = data.available_tags
			? data.available_tags.map((overwrite) => new ForumTag(overwrite))
			: (this.availableTags ?? null);
	}

	/**
	 * The emoji to show in the add reaction button on a thread in this channel.
	 */
	public get defaultReactionEmoji() {
		return this[kData].default_reaction_emoji;
	}

	/**
	 * The default sort order type used to order posts in this channel.
	 * Defaults to null, which indicates a preferred sort order hasn't been set by a channel admin.
	 */
	public get defaultSortOrder() {
		return this[kData].default_sort_order!;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 */
	public isThreadOnly(): this is ThreadOnlyChannelMixin<
		Extract<Type, ChannelType.GuildForum | ChannelType.GuildMedia>
	> {
		return true;
	}

	/**
	 * Adds data from optimized properties omitted from [kData].
	 *
	 * @param data the result of {@link Channel.toJSON()}
	 */
	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		if (this.availableTags) {
			data.available_tags = this.availableTags?.map((tag) => tag.toJSON());
		}
	}
}
