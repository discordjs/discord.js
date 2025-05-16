import type { APIGuildCategoryChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';

export interface CategoryChannel<Omitted extends keyof APIGuildCategoryChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildCategory>,
		[ChannelPermissionMixin<ChannelType.GuildCategory>, GuildChannelMixin<ChannelType.GuildCategory>]
	> {}

export class CategoryChannel<Omitted extends keyof APIGuildCategoryChannel | '' = ''> extends Channel<
	ChannelType.GuildCategory,
	Omitted
> {}

Mixin(CategoryChannel, [ChannelPermissionMixin, GuildChannelMixin]);
