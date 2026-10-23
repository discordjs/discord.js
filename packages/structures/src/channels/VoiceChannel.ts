import type { APIGuildVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin } from '../Mixin.js';
import type { MixinTypes } from '../MixinTypes.d.ts';
import type { Partialize } from '../utils/types.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { ChannelWebhookMixin } from './mixins/ChannelWebhookMixin.js';
import { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export interface VoiceChannel<Omitted extends keyof APIGuildVoiceChannel | '' = ''> extends MixinTypes<
	Channel<ChannelType.GuildVoice>,
	[
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
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	ChannelWebhookMixin,
	VoiceChannelMixin,
]);
