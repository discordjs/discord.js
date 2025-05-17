import type { APIThreadMetadata, ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { APIThreadChannel } from '../../utils/types';
import type { Channel, ChannelDataType } from '../Channel';
import { ThreadMetadata } from '../ThreadMetadata';

export interface ThreadChannelMixin<
	Type extends ThreadChannelType = ThreadChannelType,
	Omitted extends keyof APIThreadChannel | '' = '',
> extends Channel<Type, Omitted> {
	threadMetadata: ThreadMetadata | null;
}

export class ThreadChannelMixin<
	Type extends ThreadChannelType = ThreadChannelType,
	Omitted extends keyof APIThreadChannel | '' = '',
> {
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

	public get memberCount() {
		return this[kData].member_count;
	}

	public get messageCount() {
		return this[kData].message_count;
	}

	public get totalMessageSent() {
		return this[kData].total_message_sent;
	}

	public isThread(): this is ThreadChannelMixin<Extract<Type, ThreadChannelType>> {
		return true;
	}

	public _toJSON(data: Partial<APIThreadChannel>) {
		if (this.threadMetadata) {
			data.thread_metadata = this.threadMetadata.toJSON();
		}
	}
}
