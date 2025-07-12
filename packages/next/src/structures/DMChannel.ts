import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelPinMixin,
	DMChannelMixin,
	TextChannelMixin,
} from '@discordjs/structures';
import type { APIDMChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface DMChannel<Omitted extends keyof APIDMChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.DM>,
		[
			BaseChannelMixin<ChannelType.DM>,
			DMChannelMixin<ChannelType.DM>,
			TextChannelMixin<ChannelType.DM>,
			ChannelPinMixin<ChannelType.DM>,
		]
	> {}

/**
 * Sample Implementation of a structure for dm channels, usable by direct end consumers.
 */
export class DMChannel<Omitted extends keyof APIDMChannel | '' = ''> extends Channel<ChannelType.DM, Omitted> {
	public constructor(data: Partialize<APIDMChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(DMChannel, [BaseChannelMixin, DMChannelMixin, TextChannelMixin, ChannelPinMixin]);
