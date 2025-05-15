import type { ChannelType, GuildTextChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface ChannelParentMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia | GuildTextChannelType>
	extends Channel<Type> {}

export class ChannelParentMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia | GuildTextChannelType> {
	public get parentId() {
		return this[kData].parent_id;
	}

	public get nsfw() {
		return this[kData].nsfw;
	}
}
