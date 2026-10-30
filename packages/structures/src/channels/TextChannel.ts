import type { APITextChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface TextChannel<Omitted extends keyof APITextChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.GuildText>,
	[
		TextChannelMixin<ChannelType.GuildText>,
		ChannelParentMixin<ChannelType.GuildText>,
		ChannelPermissionMixin<ChannelType.GuildText>,
		ChannelPinMixin<ChannelType.GuildText>,
		ChannelSlowmodeMixin<ChannelType.GuildText>,
		ChannelTopicMixin<ChannelType.GuildText>,
	]
> {}

export class TextChannel<Omitted extends keyof APITextChannel | '' = ''> extends Channel<
	ChannelType.GuildText,
	Omitted
> {
	public constructor(data: Partialize<APITextChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(TextChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
]);
