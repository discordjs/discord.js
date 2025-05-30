import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kLastPinTimestamp, kMixinConstruct } from '../../utils/symbols.js';
import type { Channel, ChannelDataType } from '../Channel.js';

export interface ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> extends Channel<Type> {}

export class ChannelPinMixin<
	Type extends ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType,
> {
	/**
	 * The timestamp of when the last pin in the channel happened
	 */
	declare protected [kLastPinTimestamp]: number | null;

	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 */
	public static DataTemplate: Partial<
		ChannelDataType<ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType>
	> = {
		set last_pin_timestamp(_: string) {},
	};

	public [kMixinConstruct]() {
		this[kLastPinTimestamp] ??= null;
	}

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<ChannelDataType<Type>>) {
		if (data.last_pin_timestamp) {
			this[kLastPinTimestamp] = Date.parse(data.last_pin_timestamp);
		}
	}

	/**
	 * The timestamp of when the last pin in the channel happened.
	 */
	public get lastPinTimestamp() {
		return this[kLastPinTimestamp];
	}

	/**
	 * The Date of when the last pin in the channel happened
	 */
	public get lastPinAt() {
		const lastPinTimestamp = this.lastPinTimestamp;
		return lastPinTimestamp ? new Date(lastPinTimestamp) : null;
	}

	/**
	 * Adds data from optimized properties omitted from [kData].
	 *
	 * @param data - the result of {@link Channel.toJSON}
	 */
	protected _toJSON(data: Partial<ChannelDataType<Type>>) {
		data.last_pin_timestamp = this[kLastPinTimestamp] ? new Date(this[kLastPinTimestamp]).toISOString() : null;
	}
}
