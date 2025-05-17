import type { APIThreadMetadata, ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { APIThreadChannel } from '../../utils/types';
import type { Channel, ChannelDataType } from '../Channel';
import { ThreadMetadata } from '../ThreadMetadata';

export interface ThreadChannelMixin<
	Type extends ThreadChannelType = ThreadChannelType,
	Omitted extends keyof APIThreadChannel | '' = '',
> extends Channel<Type, Omitted> {
	/**
	 * The metadata of this thread channel.
	 */
	threadMetadata: ThreadMetadata | null;
}

export class ThreadChannelMixin<
	Type extends ThreadChannelType = ThreadChannelType,
	Omitted extends keyof APIThreadChannel | '' = '',
> {
	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 */
	public static DataTemplate: Partial<ChannelDataType<ThreadChannelType>> = {
		set thread_metadata(_: APIThreadMetadata) {},
	};

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected _optimizeData(data: Partial<APIThreadChannel>) {
		this.threadMetadata = data.thread_metadata
			? new ThreadMetadata(data.thread_metadata)
			: (this.threadMetadata ?? null);
	}

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
	public isThread(): this is ThreadChannelMixin<Extract<Type, ThreadChannelType>> {
		return true;
	}

	/**
	 * Adds data from optimized properties omitted from [kData].
	 *
	 * @param data the result of {@link Channel.toJSON()}
	 */
	public _toJSON(data: Partial<APIThreadChannel>) {
		if (this.threadMetadata) {
			data.thread_metadata = this.threadMetadata.toJSON();
		}
	}
}
