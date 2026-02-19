import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelTopicMixin,
	ThreadOnlyChannelMixin,
} from '@discordjs/structures';
import type { APIGuildMediaChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface MediaChannel<Omitted extends keyof APIGuildMediaChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildMedia>,
		[
			BaseChannelMixin<ChannelType.GuildMedia>,
			ChannelParentMixin<ChannelType.GuildMedia>,
			ChannelPermissionMixin<ChannelType.GuildMedia>,
			ChannelTopicMixin<ChannelType.GuildMedia>,
			ThreadOnlyChannelMixin<ChannelType.GuildMedia>,
		]
	> {}

/**
 * Sample Implementation of a structure for media channels, usable by direct end consumers.
 */
export class MediaChannel<Omitted extends keyof APIGuildMediaChannel | '' = ''> extends Channel<
	ChannelType.GuildMedia,
	Omitted
> {
	public constructor(data: Partialize<APIGuildMediaChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(MediaChannel, [
	BaseChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelTopicMixin,
	ThreadOnlyChannelMixin,
]);
