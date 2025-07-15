import type { GuildTextChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import { TextChannelMixin } from './TextChannelMixin.js';

export class ChannelSlowmodeMixin<Type extends GuildTextChannelType> extends TextChannelMixin<Type> {
	/**
	 * The rate limit per user (slowmode) of this channel.
	 */
	public get rateLimitPerUser() {
		return this[kData].rate_limit_per_user;
	}
}
