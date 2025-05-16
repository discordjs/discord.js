import type { APIDMChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelPinMixin } from './mixins/ChannelPinMixin.js';
import { DMChannelMixin } from './mixins/DMChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface DMChannel<Omitted extends keyof APIDMChannel>
	extends MixinTypes<
		Channel<ChannelType.DM>,
		[DMChannelMixin<ChannelType.DM>, TextChannelMixin<ChannelType.DM>, ChannelPinMixin<ChannelType.DM>]
	> {}

export class DMChannel<Omitted extends keyof APIDMChannel> extends Channel<ChannelType.DM, Omitted> {}

Mixin(DMChannel, [DMChannelMixin, TextChannelMixin, ChannelPinMixin]);
