import { ComponentType, type APIRoleSelectComponent } from 'discord-api-types/v10';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

export class RoleSelectMenuBuilder extends BaseSelectMenuBuilder {
	/**
	 * Creates a new select menu from API data
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object
	 * ```ts
	 * const selectMenu = new RoleSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data
	 * ```ts
	 * const selectMenu = new RoleSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1)
	 * ```
	 */
	public constructor(data?: Partial<APIRoleSelectComponent>) {
		super({ ...data, type: ComponentType.RoleSelect });
	}
}
