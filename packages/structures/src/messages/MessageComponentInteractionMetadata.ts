import type { APIMessageComponentInteractionMetadata, InteractionType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';
import { InteractionMetadata } from './InteractionMetadata.js';

/**
 * Represents metadata about the message component interaction causing a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class MessageComponentInteractionMetadata<
	Omitted extends keyof APIMessageComponentInteractionMetadata | '' = '',
> extends InteractionMetadata<InteractionType.MessageComponent, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each MessageComponentInteractionMetadata.
	 */
	public static override readonly DataTemplate: Partial<APIMessageComponentInteractionMetadata> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIMessageComponentInteractionMetadata, Omitted>) {
		super(data);
	}

	/**
	 * The id of the message that contained the interactive component
	 */
	public get interactedMessageId() {
		return this[kData].interacted_message_id;
	}
}
