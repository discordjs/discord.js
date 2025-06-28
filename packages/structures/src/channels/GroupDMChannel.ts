import type { APIGroupDMChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelOwnerMixin } from './mixins/ChannelOwnerMixin.js';
import { DMChannelMixin } from './mixins/DMChannelMixin.js';
import { GroupDMMixin } from './mixins/GroupDMMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';

export interface GroupDMChannel<Omitted extends keyof APIGroupDMChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GroupDM>,
		[
			DMChannelMixin<ChannelType.GroupDM>,
			TextChannelMixin<ChannelType.GroupDM>,
			ChannelOwnerMixin<ChannelType.GroupDM>,
			GroupDMMixin,
		]
	> {}

/**
 * Sample Implementation of a structure for group dm channels, usable by direct end consumers.
 */
export class GroupDMChannel<Omitted extends keyof APIGroupDMChannel | '' = ''> extends Channel<
	ChannelType.GroupDM,
	Omitted
> {
	public constructor(data: Partialize<APIGroupDMChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(GroupDMChannel, [DMChannelMixin, TextChannelMixin, ChannelOwnerMixin, GroupDMMixin]);
