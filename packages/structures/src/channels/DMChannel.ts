import type { APIDMChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { DMChannelMixin } from './mixins/DMChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface DMChannel<Omitted extends keyof APIDMChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.DM>,
	[DMChannelMixin<ChannelType.DM>, TextChannelMixin<ChannelType.DM>, ChannelPinMixin<ChannelType.DM>]
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

Mixin(DMChannel, [DMChannelMixin, TextChannelMixin, ChannelPinMixin]);
