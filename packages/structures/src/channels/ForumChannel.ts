import type { APIGuildForumChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';

export interface ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.GuildForum>,
	[
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

Mixin(ForumChannel, [ChannelParentMixin, ChannelPermissionMixin, ChannelTopicMixin, ThreadOnlyChannelMixin]);
