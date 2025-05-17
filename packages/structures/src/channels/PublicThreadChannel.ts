import type { ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { kData } from '../utils/symbols.js';
import type { APIThreadChannel } from '../utils/types';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';

export interface PublicThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.PublicThread>,
		[
			TextChannelMixin<ChannelType.PublicThread>,
			ChannelOwnerMixin<ChannelType.PublicThread>,
			ChannelParentMixin<ChannelType.PublicThread>,
			ChannelPinMixin<ChannelType.PublicThread>,
			ChannelSlowmodeMixin<ChannelType.PublicThread>,
			ThreadChannelMixin<ChannelType.PublicThread>,
		]
	> {}

export class PublicThreadChannel<Omitted extends keyof APIThreadChannel | '' = ''> extends Channel<
	ChannelType.PublicThread,
	Omitted
> {
	public constructor(data: APIThreadChannel) {
		super(data);
		this._optimizeData(data);
	}

	public get appliedTags() {
		return this[kData].applied_tags;
	}
}

Mixin(PublicThreadChannel, [
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ThreadChannelMixin,
]);
