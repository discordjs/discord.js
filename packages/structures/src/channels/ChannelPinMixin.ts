import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface ChannelPinMixin<Type extends ChannelType.DM | ChannelType.GuildText | ThreadChannelType>
	extends Channel<Type> {}

export class ChannelPinMixin<Type extends ChannelType.DM | ChannelType.GuildText | ThreadChannelType> {
	public get lastPinTimestamp() {
		return this[kData].last_pin_timestamp;
	}
}
