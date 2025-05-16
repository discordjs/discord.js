import type { APIGroupDMChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { kData } from '../utils/symbols.js';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface GroupDMChannel<Omitted extends keyof APIGroupDMChannel>
	extends MixinTypes<
		Channel<ChannelType.GroupDM>,
		[TextChannelMixin<ChannelType.GroupDM>, ChannelOwnerMixin<ChannelType.GroupDM>]
	> {}

export class GroupDMChannel<Omitted extends keyof APIGroupDMChannel> extends Channel<ChannelType.GroupDM, Omitted> {
	public get icon() {
		return this[kData].icon;
	}

	public get managed() {
		return this[kData].managed;
	}
}

Mixin(GroupDMChannel, [TextChannelMixin, ChannelOwnerMixin]);
