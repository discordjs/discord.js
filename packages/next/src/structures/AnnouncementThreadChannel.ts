import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	TextChannelMixin,
	ThreadChannelMixin,
} from '@discordjs/structures';
import type { APIAnnouncementThreadChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface AnnouncementThreadChannel<Omitted extends keyof APIAnnouncementThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.AnnouncementThread>,
		[
			BaseChannelMixin<ChannelType.AnnouncementThread>,
			TextChannelMixin<ChannelType.AnnouncementThread>,
			ChannelOwnerMixin<ChannelType.AnnouncementThread>,
			ChannelParentMixin<ChannelType.AnnouncementThread>,
			ChannelPinMixin<ChannelType.AnnouncementThread>,
			ChannelSlowmodeMixin<ChannelType.AnnouncementThread>,
			GuildChannelMixin<ChannelType.AnnouncementThread>,
			ThreadChannelMixin<ChannelType.AnnouncementThread>,
		]
	> {}

/**
 * Sample Implementation of a structure for announcement threads, usable by direct end consumers.
 */
export class AnnouncementThreadChannel<Omitted extends keyof APIAnnouncementThreadChannel | '' = ''> extends Channel<
	ChannelType.AnnouncementThread,
	Omitted
> {
	public constructor(data: Partialize<APIAnnouncementThreadChannel, Omitted>) {
		super(data);
		this.optimizeData?.(data);
	}
}

Mixin(AnnouncementThreadChannel, [
	BaseChannelMixin,
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	ThreadChannelMixin,
]);
