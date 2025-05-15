import type { GuildTextChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface ChannelSlowmodeMixin<Type extends GuildTextChannelType> extends Channel<Type> {}

export class ChannelSlowmodeMixin<Type extends GuildTextChannelType> {
	public get rateLimitPerUser() {
		return this[kData].rate_limit_per_user;
	}
}
