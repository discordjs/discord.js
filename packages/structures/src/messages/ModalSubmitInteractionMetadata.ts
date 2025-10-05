import type { APIModalSubmitInteractionMetadata, InteractionType } from 'discord-api-types/v10';
import type { Partialize } from '../utils/types.js';
import { InteractionMetadata } from './InteractionMetadata.js';

/**
 * Represents video data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `InteractionMetadata` which needs to be instantiated and stored by an extending class using it
 */
export class ModalSubmitInteractionMetadata<
	Omitted extends keyof APIModalSubmitInteractionMetadata | '' = '',
> extends InteractionMetadata<InteractionType.ModalSubmit, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIModalSubmitInteractionMetadata, Omitted>) {
		super(data);
	}
}
