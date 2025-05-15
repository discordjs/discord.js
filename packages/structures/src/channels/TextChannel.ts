import type { ChannelType } from 'discord-api-types/v10';
import type { MixinTypes } from '../Mixin';
import { Mixin } from '../Mixin';
import { Channel } from './Channel';
import { ChannelParentMixin } from './ChannelParentMixin';
import { ChannelPermissionMixin } from './ChannelPermissionMixin';
import { ChannelSlowmodeMixin } from './ChannelSlowmodeMixin';
import { ChannelTopicMixin } from './ChannelTopicMixin';
import { GuildChannelMixin } from './GuildChannelMixin';
import { TextChannelMixin } from './TextChannelMixin';

export interface TextChannel
	extends MixinTypes<
		Channel<ChannelType.GuildText>,
		[
			TextChannelMixin<ChannelType.GuildText>,
			ChannelParentMixin<ChannelType.GuildText>,
			ChannelPermissionMixin<ChannelType.GuildText>,
			ChannelSlowmodeMixin<ChannelType.GuildText>,
			ChannelTopicMixin<ChannelType.GuildText>,
			GuildChannelMixin<ChannelType.GuildText>,
		]
	> {}

export class TextChannel extends Channel<ChannelType.GuildText> {}

Mixin(TextChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
	GuildChannelMixin,
]);
