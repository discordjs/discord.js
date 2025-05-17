import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';
import { TextChannelMixin } from './TextChannelMixin';

export interface VoiceChannelMixin<Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice>
	extends Channel<Type> {}

export class VoiceChannelMixin<
	Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice,
> extends TextChannelMixin<Type> {
	/**
	 * The bitrate (in bits) of the voice channel.
	 */
	public get bitrate() {
		return this[kData].bitrate!;
	}

	/**
	 * The voice region id for this channel, automatic when set to null.
	 */
	public get rtcRegion() {
		return this[kData].rtc_region!;
	}

	/**
	 * The camera video quality mode of the voice channel, 1 when not present.
	 */
	public get videoQualityMode() {
		return this[kData].video_quality_mode!;
	}

	/**
	 * The user limit of the voice channel.
	 */
	public get userLimit() {
		return this[kData].user_limit!;
	}

	/**
	 * Indicates whether this channel has voice connection capabilities
	 */
	public override isVoiceBased(): this is VoiceChannelMixin<
		Extract<Type, ChannelType.GuildStageVoice | ChannelType.GuildVoice>
	> {
		return true;
	}
}
