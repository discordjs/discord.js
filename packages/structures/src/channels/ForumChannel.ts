import type { APIGuildForumChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { kData } from '../utils/symbols.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { ThreadContainerChannelMixin } from './mixins/ThreadContainerChannelMixin.js';
import { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';

export interface ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildForum>,
		[
			ChannelParentMixin<ChannelType.GuildForum>,
			ChannelPermissionMixin<ChannelType.GuildForum>,
			ChannelTopicMixin<ChannelType.GuildForum>,
			GuildChannelMixin<ChannelType.GuildForum>,
			ThreadContainerChannelMixin<ChannelType.GuildForum>,
			ThreadOnlyChannelMixin<ChannelType.GuildForum>,
		]
	> {}

export class ForumChannel<Omitted extends keyof APIGuildForumChannel | '' = ''> extends Channel<
	ChannelType.GuildForum,
	Omitted
> {
	public get defaultForumLayout() {
		return this[kData].default_forum_layout;
	}
}

Mixin(ForumChannel, [
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelTopicMixin,
	GuildChannelMixin,
	ThreadContainerChannelMixin,
	ThreadOnlyChannelMixin,
]);
