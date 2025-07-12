import {
	Channel,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
	Mixin,
	type MixinTypes,
	type Partialize,
	TextChannelMixin,
} from '@discordjs/structures';
import type { APINewsChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin.js';

export interface AnnouncementChannel<Omitted extends keyof APINewsChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildAnnouncement>,
		[
			BaseChannelMixin<ChannelType.GuildAnnouncement>,
			TextChannelMixin<ChannelType.GuildAnnouncement>,
			ChannelParentMixin<ChannelType.GuildAnnouncement>,
			ChannelPermissionMixin<ChannelType.GuildAnnouncement>,
			ChannelPinMixin<ChannelType.GuildAnnouncement>,
			ChannelSlowmodeMixin<ChannelType.GuildAnnouncement>,
			ChannelTopicMixin<ChannelType.GuildAnnouncement>,
		]
	> {}

/**
 * Sample Implementation of a structure for announcement channels, usable by direct end consumers.
 */
export class AnnouncementChannel<Omitted extends keyof APINewsChannel | '' = ''> extends Channel<
	ChannelType.GuildAnnouncement,
	Omitted
> {
	public constructor(data: Partialize<APINewsChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(AnnouncementChannel, [
	BaseChannelMixin,
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
]);
