import type { APIGuildForumTag, ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel, ChannelDataType } from '../Channel';
import { ForumTag } from '../ForumTag';

export interface ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia>
	extends Channel<Type> {
	availableTags: readonly ForumTag[];
}

export class ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia> {
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

	public get defaultReactionEmoji() {
		return this[kData].default_reaction_emoji;
	}

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

	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		if (this.availableTags) {
			data.available_tags = this.availableTags?.map((tag) => tag.toJSON());
		}
	}
}
