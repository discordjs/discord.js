import type { APIStringSelectComponent } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types.js';
import { SelectMenuComponent } from './SelectMenuComponent.js';

/**
 * Represents a string select menu component.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `StringSelectMenuOption`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class StringSelectMenuComponent<
	Omitted extends keyof APIStringSelectComponent | '' = '',
> extends SelectMenuComponent<APIStringSelectComponent, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each StringSelectMenuComponent.
	 */
	public static override readonly DataTemplate: Partial<APIStringSelectComponent> = {};

	/**
	 * @param data - The raw data received from the API for the string select menu
	 */
	public constructor(data: Partialize<APIStringSelectComponent, Omitted>) {
		super(data);
	}
}
