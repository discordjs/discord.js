import type { APIGuildMediaChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';

export interface MediaChannel<Omitted extends keyof APIGuildMediaChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildMedia>,
		[
			ChannelParentMixin<ChannelType.GuildMedia>,
			ChannelPermissionMixin<ChannelType.GuildMedia>,
			ChannelTopicMixin<ChannelType.GuildMedia>,
			ThreadOnlyChannelMixin<ChannelType.GuildMedia>,
		]
	> {}

export class MediaChannel<Omitted extends keyof APIGuildMediaChannel | '' = ''> extends Channel<
	ChannelType.GuildMedia,
	Omitted
> {
	public constructor(data: APIGuildMediaChannel) {
		super(data);
		this._optimizeData(data);
	}
}

Mixin(MediaChannel, [ChannelParentMixin, ChannelPermissionMixin, ChannelTopicMixin, ThreadOnlyChannelMixin]);
