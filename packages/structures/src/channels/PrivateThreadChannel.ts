import type { APIPrivateThreadChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface PrivateThreadChannel<Omitted extends keyof APIPrivateThreadChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.PrivateThread>,
	[
		TextChannelMixin<ChannelType.PrivateThread>,
		ChannelOwnerMixin<ChannelType.PrivateThread>,
		ChannelParentMixin<ChannelType.PrivateThread>,
		ChannelPinMixin<ChannelType.PrivateThread>,
		ChannelSlowmodeMixin<ChannelType.PrivateThread>,
		ThreadChannelMixin<ChannelType.PrivateThread>,
	]
> {}

/**
 * Sample Implementation of a structure for private thread channels, usable by direct end consumers.
 */
export class PrivateThreadChannel<Omitted extends keyof APIPrivateThreadChannel | '' = ''> extends Channel<
	ChannelType.PrivateThread,
	Omitted
> {
	public constructor(data: Partialize<APIPrivateThreadChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(PrivateThreadChannel, [
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ThreadChannelMixin,
]);
