import type { APIRoleSelectComponent } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types.js';
import { SelectMenuComponent } from './SelectMenuComponent.js';

/**
 * Represents a role select menu component.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `SelectMenuDefaultValue`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class RoleSelectMenuComponent<
	Omitted extends keyof APIRoleSelectComponent | '' = '',
> extends SelectMenuComponent<APIRoleSelectComponent, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each RoleSelectMenuComponent.
	 */
	public static override readonly DataTemplate: Partial<APIRoleSelectComponent> = {};

	/**
	 * @param data - The raw data received from the API for the role select menu
	 */
	public constructor(data: Partialize<APIRoleSelectComponent, Omitted>) {
		super(data);
	}
}
