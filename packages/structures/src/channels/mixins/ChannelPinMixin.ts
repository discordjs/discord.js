import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import type { Channel, ChannelDataType } from '../Channel';

export interface ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> extends Channel<Type> {
	/**
	 * The timestamp of when the last pin in the channel happened
	 */
	lastPinTimestamp: number | null;
}

export class ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> {
	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		this.lastPinTimestamp = data.last_pin_timestamp
			? Date.parse(data.last_pin_timestamp)
			: (this.lastPinTimestamp ?? null);
	}

	/**
	 * The Date of when the last pin in the channel happened
	 */
	public get lastPinAt() {
		return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
	}

	/**
	 * Adds data from optimized properties omitted from [kData].
	 *
	 * @param data the result of {@link Channel.toJSON()}
	 */
	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		if (this.lastPinTimestamp) {
			data.last_pin_timestamp = new Date(this.lastPinTimestamp).toISOString();
		}
	}
}
