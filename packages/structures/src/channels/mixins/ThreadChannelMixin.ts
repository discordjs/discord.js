import type { ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Channel } from '../Channel.js';

export interface ThreadChannelMixin<Type extends ThreadChannelType = ThreadChannelType> extends Channel<Type> {}

/**
 * @remarks has a sub-structure {@link ThreadMetadata} that extending mixins should add to their DataTemplate and _optimizeData
 */
export class ThreadChannelMixin<Type extends ThreadChannelType = ThreadChannelType> {
	/**
	 * The approximate count of users in a thread, stops counting at 50
	 */
	public get memberCount() {
		return this[kData].member_count;
	}

	/**
	 * The number of messages (not including the initial message or deleted messages) in a thread.
	 */
	public get messageCount() {
		return this[kData].message_count;
	}

	/**
	 * The number of messages ever sent in a thread, it's similar to message_count on message creation,
	 * but will not decrement the number when a message is deleted.
	 */
	public get totalMessageSent() {
		return this[kData].total_message_sent;
	}

	/**
	 * Indicates whether this channel is a thread channel
	 */
	public isThread(): this is ThreadChannelMixin & this {
		return true;
	}
}
