import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelPermissionMixin,
	GuildChannelMixin,
} from '@discordjs/structures';
import type { APIGuildCategoryChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface CategoryChannel<Omitted extends keyof APIGuildCategoryChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildCategory>,
		[
			BaseChannelMixin<ChannelType.GuildCategory>,
			ChannelPermissionMixin<ChannelType.GuildCategory>,
			GuildChannelMixin<ChannelType.GuildCategory>,
		]
	> {}

/**
 * Sample Implementation of a structure for category channels, usable by direct end consumers.
 */
export class CategoryChannel<Omitted extends keyof APIGuildCategoryChannel | '' = ''> extends Channel<
	ChannelType.GuildCategory,
	Omitted
> {
	public constructor(data: Partialize<APIGuildCategoryChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(CategoryChannel, [BaseChannelMixin, ChannelPermissionMixin, GuildChannelMixin]);
