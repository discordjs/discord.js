import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
	TextChannelMixin,
} from '@discordjs/structures';
import type { APITextChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface TextChannel<Omitted extends keyof APITextChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildText>,
		[
			BaseChannelMixin<ChannelType.GuildText>,
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
	BaseChannelMixin,
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ChannelTopicMixin,
]);
