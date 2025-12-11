import { channelLink } from '@discordjs/formatters';
import type { ChannelType } from 'discord-api-types/v10';
import type { User } from '../../users/User.js';
import type { Channel } from '../Channel.js';

export interface DMChannelMixin<
	Type extends ChannelType.DM | ChannelType.GroupDM = ChannelType.DM | ChannelType.GroupDM,
> extends Channel<Type> {}

/**
 * @remarks has recipients, an array of sub-structures {@link User} that extending mixins should add to their DataTemplate and _optimizeData
 */
export class DMChannelMixin<Type extends ChannelType.DM | ChannelType.GroupDM = ChannelType.DM | ChannelType.GroupDM> {
	/**
	 * The URL to this channel.
	 */
	public get url() {
		return channelLink(this.id);
	}

	/**
	 * Indicates whether this channel is a DM or DM Group
	 */
	public isDMBased(): this is DMChannelMixin & this {
		return true;
	}
}
