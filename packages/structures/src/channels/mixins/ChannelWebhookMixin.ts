import type { ChannelType, GuildTextChannelType, ThreadChannelType } from 'discord-api-types/v10';
import type { Channel } from '../Channel.js';

export interface ChannelWebhookMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType> =
		| ChannelType.GuildForum
		| ChannelType.GuildMedia
		| Exclude<GuildTextChannelType, ThreadChannelType>,
> extends Channel<Type> {}

export class ChannelWebhookMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType> =
		| ChannelType.GuildForum
		| ChannelType.GuildMedia
		| Exclude<GuildTextChannelType, ThreadChannelType>,
> {
	/**
	 * Indicates whether this channel can have webhooks
	 */
	public isWebhookCapable(): this is ChannelWebhookMixin & this {
		return true;
	}
}
