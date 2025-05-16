import type { APITextChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { ChannelTopicMixin } from './mixins/ChannelTopicMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadContainerChannelMixin } from './mixins/ThreadContainerChannelMixin.js';

export interface TextChannel<Omitted extends keyof APITextChannel>
	extends MixinTypes<
		Channel<ChannelType.GuildText>,
		[
			TextChannelMixin<ChannelType.GuildText>,
			ChannelParentMixin<ChannelType.GuildText>,
			ChannelPermissionMixin<ChannelType.GuildText>,
			ChannelPinMixin<ChannelType.GuildText>,
			ChannelSlowmodeMixin<ChannelType.GuildText>,
			ChannelTopicMixin<ChannelType.GuildText>,
			GuildChannelMixin<ChannelType.GuildText>,
			ThreadContainerChannelMixin<ChannelType.GuildText>,
		]
	> {}

export class TextChannel<Omitted extends keyof APITextChannel> extends Channel<ChannelType.GuildText, Omitted> {}

Mixin(TextChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
	GuildChannelMixin,
	ThreadContainerChannelMixin,
]);
