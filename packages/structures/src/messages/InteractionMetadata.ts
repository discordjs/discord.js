import type { APIMessageInteractionMetadata, InteractionType } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export type InteractionMetadataType<Type extends InteractionType> = Extract<
	APIMessageInteractionMetadata,
	{ type: Type }
>;

/**
 * Represents metadata about the interaction causing a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `User` which needs to be instantiated and stored by an extending class using it
 */
export abstract class InteractionMetadata<
	Type extends InteractionType,
	Omitted extends keyof InteractionMetadataType<Type> | '' = '',
> extends Structure<InteractionMetadataType<Type>, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<InteractionMetadataType<Type>, Omitted>) {
		super(data as InteractionMetadataType<Type>);
	}

	/**
	 * The id of the interaction
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the original response message, present only on follow-up messages
	 */
	public get originalResponseMessageId() {
		return this[kData].original_response_message_id;
	}

	/**
	 * The type of interaction
	 */
	public get type() {
		return this[kData].type;
	}
}
