import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	AppliedTagsMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	TextChannelMixin,
	ThreadChannelMixin,
} from '@discordjs/structures';
import type { APIPublicThreadChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface PublicThreadChannel<Omitted extends keyof APIPublicThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.PublicThread>,
		[
			BaseChannelMixin<ChannelType.PublicThread>,
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
	BaseChannelMixin,
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ThreadChannelMixin,
	AppliedTagsMixin,
]);
