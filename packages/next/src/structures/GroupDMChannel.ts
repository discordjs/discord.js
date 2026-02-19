import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelOwnerMixin,
	DMChannelMixin,
	GroupDMMixin,
	TextChannelMixin,
} from '@discordjs/structures';
import type { APIGroupDMChannel, ChannelType } from 'discord-api-types/v10';

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
