import type { APIApplicationCommandInteractionMetadata, InteractionType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';
import { InteractionMetadata } from './InteractionMetadata.js';

/**
 * Represents metadata about the application command interaction causing a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `User` which needs to be instantiated and stored by an extending class using it
 */
export class ApplicationCommandInteractionMetadata<
	Omitted extends keyof APIApplicationCommandInteractionMetadata | '' = '',
> extends InteractionMetadata<InteractionType.ApplicationCommand, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each ApplicationCommandInteractionMetadata.
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandInteractionMetadata> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIApplicationCommandInteractionMetadata, Omitted>) {
		super(data);
	}

	/**
	 * The id of the message the command was run on
	 */
	public get targetMessageId() {
		return this[kData].target_message_id;
	}
}
