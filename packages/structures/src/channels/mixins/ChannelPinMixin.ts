import type { ChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kLastPinTimestamp, kMixinConstruct, kMixinToJSON } from '../../utils/symbols.js';
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
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static readonly DataTemplate: Partial<
		ChannelDataType<ChannelType.DM | ChannelType.GuildAnnouncement | ChannelType.GuildText | ThreadChannelType>
	> = {
		set last_pin_timestamp(_: string) {},
	};

	public [kMixinConstruct]() {
		this[kLastPinTimestamp] ??= null;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected optimizeData(data: Partial<ChannelDataType<Type>>) {
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
	 * @param data - the result of {@link (Structure:class).toJSON}
	 */
	protected [kMixinToJSON](data: Partial<ChannelDataType<Type>>) {
		data.last_pin_timestamp = this[kLastPinTimestamp] ? new Date(this[kLastPinTimestamp]).toISOString() : null;
	}
}
