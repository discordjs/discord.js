import type { APINewsChannel, ChannelType } from 'discord-api-types/v10';
import type { MixinTypes } from '../Mixin.js';
import { Mixin } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface AnnouncementChannel<
	Omitted extends keyof APINewsChannel | '' = 'last_pin_timestamp' | 'permission_overwrites',
> extends MixinTypes<
		Channel<ChannelType.GuildAnnouncement>,
		[
			TextChannelMixin<ChannelType.GuildAnnouncement>,
			ChannelParentMixin<ChannelType.GuildAnnouncement>,
			ChannelPermissionMixin<ChannelType.GuildAnnouncement>,
			ChannelPinMixin<ChannelType.GuildAnnouncement>,
			ChannelSlowmodeMixin<ChannelType.GuildAnnouncement>,
			ChannelTopicMixin<ChannelType.GuildAnnouncement>,
		]
	> {}

export class AnnouncementChannel<
	Omitted extends keyof APINewsChannel | '' = 'last_pin_timestamp' | 'permission_overwrites',
> extends Channel<ChannelType.GuildAnnouncement, Omitted> {
	public constructor(data: APINewsChannel) {
		super(data);
		this._optimizeData(data);
	}
}

Mixin(AnnouncementChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
]);
