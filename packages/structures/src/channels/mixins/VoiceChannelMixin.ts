import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';

export interface VoiceChannelMixin<Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice>
	extends Channel<Type> {}

export class VoiceChannelMixin<Type extends ChannelType.GuildStageVoice | ChannelType.GuildVoice> {
	public get bitrate() {
		return this[kData].bitrate!;
	}

	public get rtcRegion() {
		return this[kData].rtc_region!;
	}

	public get videoQualityMode() {
		return this[kData].video_quality_mode!;
	}

	public get userLimit() {
		return this[kData].user_limit!;
	}

	/**
	 * Indicates whether this channel has voice connection capabilities
	 */
	public isVoiceBased(): this is VoiceChannelMixin<
		Extract<Type, ChannelType.GuildStageVoice | ChannelType.GuildVoice>
	> {
		return true;
	}
}
