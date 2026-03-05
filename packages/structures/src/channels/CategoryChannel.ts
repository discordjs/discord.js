import type { APIGuildCategoryChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';

export interface CategoryChannel<Omitted extends keyof APIGuildCategoryChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.GuildCategory>,
	[ChannelPermissionMixin<ChannelType.GuildCategory>, GuildChannelMixin<ChannelType.GuildCategory>]
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

Mixin(CategoryChannel, [ChannelPermissionMixin, GuildChannelMixin]);
