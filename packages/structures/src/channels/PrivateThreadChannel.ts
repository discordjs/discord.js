import type { APIThreadChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface PrivateThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.PrivateThread>,
		[
			TextChannelMixin<ChannelType.PrivateThread>,
			ChannelOwnerMixin<ChannelType.PrivateThread>,
			ChannelParentMixin<ChannelType.PrivateThread>,
			ChannelPinMixin<ChannelType.PrivateThread>,
			ChannelSlowmodeMixin<ChannelType.PrivateThread>,
			GuildChannelMixin<ChannelType.PrivateThread>,
			ThreadChannelMixin<ChannelType.PrivateThread>,
		]
	> {}

export class PrivateThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''> extends Channel<
	ChannelType.PrivateThread,
	Omitted
> {}

Mixin(PrivateThreadChannel, [
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	ThreadChannelMixin,
]);
