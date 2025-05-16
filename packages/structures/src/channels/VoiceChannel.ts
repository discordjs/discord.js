import type { APIGuildVoiceChannel, ChannelType } from 'discord-api-types/v10';
import { Mixin, type MixinTypes } from '../Mixin.js';
import { Channel } from './Channel.js';
import { ChannelParentMixin } from './mixins/ChannelParentMixin.js';
import { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import { ChannelSlowmodeMixin } from './mixins/ChannelSlowmodeMixin.js';
import { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import { TextChannelMixin } from './mixins/TextChannelMixin.js';
import { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export interface VoiceChannel<Omitted extends keyof APIGuildVoiceChannel | '' = ''>
	extends MixinTypes<
		Channel<ChannelType.GuildVoice>,
		[
			TextChannelMixin<ChannelType.GuildVoice>,
			ChannelParentMixin<ChannelType.GuildVoice>,
			ChannelPermissionMixin<ChannelType.GuildVoice>,
			ChannelSlowmodeMixin<ChannelType.GuildVoice>,
			GuildChannelMixin<ChannelType.GuildVoice>,
			VoiceChannelMixin<ChannelType.GuildVoice>,
		]
	> {}

export class VoiceChannel<Omitted extends keyof APIGuildVoiceChannel | '' = ''> extends Channel<
	ChannelType.GuildVoice,
	Omitted
> {}

Mixin(VoiceChannel, [
	TextChannelMixin,
	ChannelParentMixin,
	ChannelPermissionMixin,
	ChannelSlowmodeMixin,
	GuildChannelMixin,
	VoiceChannelMixin,
]);
