import type { APISelectMenuOption } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an option in a string select menu component.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `ComponentEmoji` which needs to be instantiated and stored by an extending class using it
 */
export class StringSelectMenuOption<Omitted extends keyof APISelectMenuOption | '' = ''> extends Structure<
	APISelectMenuOption,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APISelectMenuOption, Omitted>) {
		super(data);
	}

	public get default() {
		return this[kData].default;
	}

	public get description() {
		return this[kData].description;
	}

	public get label() {
		return this[kData].label;
	}

	public get value() {
		return this[kData].value;
	}
}
