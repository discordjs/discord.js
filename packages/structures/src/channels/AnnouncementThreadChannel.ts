import type { APIAnnouncementThreadChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface AnnouncementThreadChannel<Omitted extends keyof APIAnnouncementThreadChannel | '' = ''>
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

export class AnnouncementThreadChannel<Omitted extends keyof APIAnnouncementThreadChannel | '' = ''> extends Channel<
	ChannelType.AnnouncementThread,
	Omitted
> {
	public constructor(data: Omit<APIAnnouncementThreadChannel, Omitted>) {
		super(data);
		this.optimizeData?.(data);
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
