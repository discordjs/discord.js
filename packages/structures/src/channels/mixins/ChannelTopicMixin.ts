import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';
import { ChannelWebhookMixin } from './ChannelWebhookMixin';

export interface ChannelTopicMixin<
	Type extends ChannelType.GuildAnnouncement | ChannelType.GuildForum | ChannelType.GuildMedia | ChannelType.GuildText,
> extends Channel<Type> {}

export class ChannelTopicMixin<
	Type extends ChannelType.GuildAnnouncement | ChannelType.GuildForum | ChannelType.GuildMedia | ChannelType.GuildText,
> extends ChannelWebhookMixin<Type> {
	public get topic() {
		return this[kData].topic;
	}

	public get defaultAutoArchiveDuration() {
		return this[kData].default_auto_archive_duration;
	}

	public get defaultThreadRateLimitPerUser() {
		return this[kData].default_thread_rate_limit_per_user;
	}
}
