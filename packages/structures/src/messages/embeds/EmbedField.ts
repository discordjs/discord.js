import type { APIEmbedField } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents a field's data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedField<Omitted extends keyof APIEmbedField | '' = ''> extends Structure<APIEmbedField, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedField, Omitted>) {
		super(data);
	}

	/**
	 * The name of the field
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The value of the field
	 */
	public get value() {
		return this[kData].value;
	}

	/**
	 * Whether this field should display inline
	 */
	public get inline() {
		return this[kData].inline;
	}
}
