import type { TextChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';

export interface TextChannelMixin<Type extends TextChannelType> extends Channel<Type> {}

export class TextChannelMixin<Type extends TextChannelType> {
	/**
	 * The id of the last message sent in this channel.
	 */
	public get lastMessageId() {
		return this[kData].last_message_id;
	}

	/**
	 * Indicates whether this channel can contain messages
	 */
	public isTextBased(): this is TextChannelMixin<Extract<Type, TextChannelType>> {
		return true;
	}
}
