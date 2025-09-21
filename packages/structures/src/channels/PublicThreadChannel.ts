import type { APIPublicThreadChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { AppliedTagsMixin } from './mixins/AppliedTagsMixin.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface PublicThreadChannel<Omitted extends keyof APIPublicThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.PublicThread>,
		[
			TextChannelMixin<ChannelType.PublicThread>,
			ChannelOwnerMixin<ChannelType.PublicThread>,
			ChannelParentMixin<ChannelType.PublicThread>,
			ChannelPinMixin<ChannelType.PublicThread>,
			ChannelSlowmodeMixin<ChannelType.PublicThread>,
			ThreadChannelMixin<ChannelType.PublicThread>,
			AppliedTagsMixin,
		]
	> {}

/**
 * Sample Implementation of a structure for public thread channels, usable by direct end consumers.
 */
export class PublicThreadChannel<Omitted extends keyof APIPublicThreadChannel | '' = ''> extends Channel<
	ChannelType.PublicThread,
	Omitted
> {
	public constructor(data: Partialize<APIPublicThreadChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(PublicThreadChannel, [
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ThreadChannelMixin,
	AppliedTagsMixin,
]);
