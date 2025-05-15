import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia>
	extends Channel<Type> {}

export class ThreadOnlyChannelMixin<Type extends ChannelType.GuildForum | ChannelType.GuildMedia> {
	public get availableTags() {
		return this[kData].available_tags!;
	}

	public get defaultAutoArchiveDuration() {
		return this[kData].default_reaction_emoji!;
	}

	public get defaultSortOrde() {
		return this[kData].default_sort_order!;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 */
	public isThreadOnly() {
		return true;
	}
}
