import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface DMChannelMixin<Type extends ChannelType.DM | ChannelType.GroupDM> extends Channel<Type> {}

export class DMChannelMixin<Type extends ChannelType.DM | ChannelType.GroupDM> {
	public get recipients() {
		return this[kData].recipients;
	}

	/**
	 * The URL to this channel.
	 */
	public get url() {
		return `https://discord.com/@me/${this.id}`;
	}

	/**
	 * Indiciates whether this channel is a DM or DM Group
	 */
	public isDMBased() {
		return true;
	}
}
