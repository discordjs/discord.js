import type { APIGuildStageVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export interface StageChannel<Omitted extends keyof APIGuildStageVoiceChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildStageVoice>,
		[
			TextChannelMixin<ChannelType.GuildStageVoice>,
			ChannelParentMixin<ChannelType.GuildStageVoice>,
			ChannelPermissionMixin<ChannelType.GuildStageVoice>,
			ChannelSlowmodeMixin<ChannelType.GuildStageVoice>,
			GuildChannelMixin<ChannelType.GuildStageVoice>,
			VoiceChannelMixin<ChannelType.GuildStageVoice>,
		]
	> {}

export class StageChannel<Omitted extends keyof APIGuildStageVoiceChannel | '' = ''> extends Channel<
	ChannelType.GuildStageVoice,
	Omitted
> {
	public constructor(data: APIGuildStageVoiceChannel) {
		super(data);
		this._optimizeData(data);
	}
}

Mixin(StageChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	VoiceChannelMixin,
]);
