import { MessageReferenceType, type APIMessageReference } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the reference to another message on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class MessageReference<Omitted extends keyof APIMessageReference | '' = ''> extends Structure<
	APIMessageReference,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each MessageReference.
	 */
	public static override DataTemplate: Partial<APIMessageReference> = {};

	/**
	 * @param data - The raw data received from the API for the message reference
	 */
	public constructor(data: Partialize<APIMessageReference, Omitted>) {
		super(data);
	}

	/**
	 * The type of this reference
	 */
	public get type() {
		return 'type' in this[kData] ? (this[kData].type as MessageReferenceType) : MessageReferenceType.Default;
	}

	/**
	 * The id of the referenced message
	 */
	public get messageId() {
		return this[kData].message_id;
	}

	/**
	 * The id of the channel the referenced message was sent in
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The id of the guild the referenced message was sent in
	 */
	public get guildId() {
		return this[kData].guild_id;
	}
}
