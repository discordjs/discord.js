import type { ChannelType, GuildTextChannelType, ThreadChannelType } from 'discord-api-types/v10';
import type { Channel } from '../Channel';

export interface ChannelWebhookMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType>,
> extends Channel<Type> {}

export class ChannelWebhookMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType>,
> {
	public isWebhookCapable(): this is ChannelWebhookMixin<
		Extract<Type, ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType>>
	> {
		return true;
	}
}
