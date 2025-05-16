import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kMixinConstruct } from '../../utils/symbols';
import type { Channel, ChannelDataType } from '../Channel';

export interface ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> extends Channel<Type> {
	lastPinTimestamp: number | null;
}

export class ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> {
	public [kMixinConstruct](data: Partial<ChannelDataType<Type>>) {
		this._optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		this.lastPinTimestamp = data.last_pin_timestamp
			? Date.parse(data.last_pin_timestamp)
			: (this.lastPinTimestamp ?? null);
	}

	public get lastPinAt() {
		return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
	}
}
