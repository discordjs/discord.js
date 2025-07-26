import {
	Mixin,
	type MixinTypes,
	kData,
	type Partialize,
	Channel,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelTopicMixin,
	ThreadOnlyChannelMixin,
} from '@discordjs/structures';
import type { APIGuildForumChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildForum>,
		[
			BaseChannelMixin<ChannelType.GuildForum>,
			ChannelParentMixin<ChannelType.GuildForum>,
			ChannelPermissionMixin<ChannelType.GuildForum>,
			ChannelTopicMixin<ChannelType.GuildForum>,
			ThreadOnlyChannelMixin<ChannelType.GuildForum>,
		]
	> {}

/**
 * Sample Implementation of a structure for forum channels, usable by direct end consumers.
 */
export class ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = ''> extends Channel<
	ChannelType.GuildForum,
	Omitted
> {
	public constructor(data: Partialize<APIGuildForumChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The default forum layout view used to display posts in this channel.
	 * Defaults to 0, which indicates a layout view has not been set by a channel admin.
	 */
	public get defaultForumLayout() {
		return this[kData].default_forum_layout;
	}
}

Mixin(ForumChannel, [
	BaseChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelTopicMixin,
	ThreadOnlyChannelMixin,
]);
