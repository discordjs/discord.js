import type { GuildTextChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import { TextChannelMixin } from './TextChannelMixin';

export class ChannelSlowmodeMixin<Type extends GuildTextChannelType> extends TextChannelMixin<Type> {
	public get rateLimitPerUser() {
		return this[kData].rate_limit_per_user;
	}
}
