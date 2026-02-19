import {
	Mixin,
	type MixinTypes,
	type Partialize,
	Channel,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelWebhookMixin,
	VoiceChannelMixin,
} from '@discordjs/structures';
import type { APIGuildStageVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface StageChannel<Omitted extends keyof APIGuildStageVoiceChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildStageVoice>,
		[
			BaseChannelMixin<ChannelType.GuildStageVoice>,
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
	BaseChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelWebhookMixin,
	VoiceChannelMixin,
]);
