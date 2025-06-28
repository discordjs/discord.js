import type { APIPublicThreadChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import { kData } from '../utils/symbols.js';
import { Channel } from './Channel.js';
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
		]
	> {}

export class PublicThreadChannel<Omitted extends keyof APIPublicThreadChannel | '' = ''> extends Channel<
	ChannelType.PublicThread,
	Omitted
> {
	public constructor(data: Omit<APIPublicThreadChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The IDs of the set of tags that have been applied to a thread in a {@link ForumChannel} or a {@link MediaChannel}.
	 */
	public get appliedTags() {
		return Array.isArray(this[kData].applied_tags) ? [...this[kData].applied_tags] : null;
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
