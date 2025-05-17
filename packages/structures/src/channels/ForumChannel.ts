import type { APIGuildForumChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { kData } from '../utils/symbols.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';

export interface ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = 'available_tags'>
	extends MixinTypes<
		Channel<ChannelType.GuildForum>,
		[
			ChannelParentMixin<ChannelType.GuildForum>,
			ChannelPermissionMixin<ChannelType.GuildForum>,
			ChannelTopicMixin<ChannelType.GuildForum>,
			ThreadOnlyChannelMixin<ChannelType.GuildForum>,
		]
	> {}

export class ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = 'available_tags'> extends Channel<
	ChannelType.GuildForum,
	Omitted
> {
	public constructor(data: APIGuildForumChannel) {
		super(data);
		this._optimizeData(data);
	}

	public get defaultForumLayout() {
		return this[kData].default_forum_layout;
	}
}

Mixin(ForumChannel, [ChannelParentMixin, ChannelPermissionMixin, ChannelTopicMixin, ThreadOnlyChannelMixin]);
