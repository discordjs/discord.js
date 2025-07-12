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
import type { APIGuildVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { BaseChannelMixin } from './mixins/BaseChannelMixin';

export interface VoiceChannel<Omitted extends keyof APIGuildVoiceChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildVoice>,
		[
			BaseChannelMixin<ChannelType.GuildVoice>,
			ChannelParentMixin<ChannelType.GuildVoice>,
			ChannelPermissionMixin<ChannelType.GuildVoice>,
			ChannelSlowmodeMixin<ChannelType.GuildVoice>,
			ChannelWebhookMixin<ChannelType.GuildVoice>,
			VoiceChannelMixin<ChannelType.GuildVoice>,
		]
	> {}

export class VoiceChannel<Omitted extends keyof APIGuildVoiceChannel | '' = ''> extends Channel<
	ChannelType.GuildVoice,
	Omitted
> {
	public constructor(data: Partialize<APIGuildVoiceChannel, Omitted>) {
		super(data);
		this.optimizeData(data);
	}
}

Mixin(VoiceChannel, [
	BaseChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelWebhookMixin,
	VoiceChannelMixin,
]);
