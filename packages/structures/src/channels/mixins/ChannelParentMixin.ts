import type { ChannelType, GuildTextChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import { GuildChannelMixin } from './GuildChannelMixin';

export class ChannelParentMixin<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia | GuildTextChannelType,
> extends GuildChannelMixin<Type> {
	/**
	 * The id of the parent category for a channel (each parent category can contain up to 50 channels) or id of the parent channel for a thread
	 */
	public get parentId() {
		return this[kData].parent_id;
	}

	/**
	 * Whether the channel is nsfw
	 */
	public get nsfw() {
		return this[kData].nsfw;
	}
}
