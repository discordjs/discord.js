import type { ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import type { APIThreadChannel } from '../utils/types';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface AnnouncementThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.AnnouncementThread>,
		[
			TextChannelMixin<ChannelType.AnnouncementThread>,
			ChannelOwnerMixin<ChannelType.AnnouncementThread>,
			ChannelParentMixin<ChannelType.AnnouncementThread>,
			ChannelPinMixin<ChannelType.AnnouncementThread>,
			ChannelSlowmodeMixin<ChannelType.AnnouncementThread>,
			GuildChannelMixin<ChannelType.AnnouncementThread>,
			ThreadChannelMixin<ChannelType.AnnouncementThread>,
		]
	> {}

export class AnnouncementThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''> extends Channel<
	ChannelType.AnnouncementThread,
	Omitted
> {
	public constructor(data: APIThreadChannel) {
		super(data);
		this._optimizeData(data);
	}
}

Mixin(AnnouncementThreadChannel, [
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	ThreadChannelMixin,
]);
