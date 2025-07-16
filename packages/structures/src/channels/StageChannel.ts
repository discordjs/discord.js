import type { APIGuildStageVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { ChannelWebhookMixin } from './mixins/ChannelWebhookMixin.js';
import { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export interface StageChannel<Omitted extends keyof APIGuildStageVoiceChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildStageVoice>,
		[
			ChannelParentMixin<ChannelType.GuildStageVoice>,
			ChannelPermissionMixin<ChannelType.GuildStageVoice>,
			ChannelSlowmodeMixin<ChannelType.GuildStageVoice>,
			ChannelWebhookMixin<ChannelType.GuildStageVoice>,
			VoiceChannelMixin<ChannelType.GuildStageVoice>,
		]
	> {}

export class StageChannel<Omitted extends keyof APIGuildStageVoiceChannel | '' = ''> extends Channel<
	ChannelType.GuildStageVoice,
	Omitted
> {
	public constructor(data: Partialize<APIGuildStageVoiceChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(StageChannel, [
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelWebhookMixin,
	VoiceChannelMixin,
]);
