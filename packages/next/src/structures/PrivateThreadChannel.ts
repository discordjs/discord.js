import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	TextChannelMixin,
	ThreadChannelMixin,
} from '@discordjs/structures';
import type { APIPrivateThreadChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface PrivateThreadChannel<Omitted extends keyof APIPrivateThreadChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.PrivateThread>,
		[
			BaseChannelMixin<ChannelType.PrivateThread>,
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
	BaseChannelMixin,
	TextChannelMixin,
	ChannelOwnerMixin,
	ChannelParentMixin,
	ChannelPinMixin,
	ChannelSlowmodeMixin,
	ThreadChannelMixin,
]);
