import type { APIRoleSelectComponent, APISelectMenuDefaultValue, Snowflake } from 'discord-api-types/v10';
import { ComponentType, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import type { RestOrArray } from '../../index.js';
import { optionsLengthValidator } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

/**
 * A builder that creates API-compatible JSON data for role select menus.
 */
export class RoleSelectMenuBuilder extends BaseSelectMenuBuilder<APIRoleSelectComponent> {
	/**
	 * Creates a new select menu from API data.
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object:
	 * ```ts
	 * const selectMenu = new RoleSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data:
	 * ```ts
	 * const selectMenu = new RoleSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1);
	 * ```
	 */
	public constructor(data?: Partial<APIRoleSelectComponent>) {
		super({ ...data, type: ComponentType.RoleSelect });
	}

	/**
	 * Adds default roles to this auto populated select menu.
	 *
	 * @param roles - The roles to add
	 */
	public addDefaultRoles(...roles: RestOrArray<Snowflake>) {
		const normalizedValues = roles.map((id) => {
			return { id, type: SelectMenuDefaultValueType.Role };
		}) as APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[];
		this.data.default_values ??= [];
		optionsLengthValidator.parse(this.data.default_values.length + normalizedValues.length);
		this.data.default_values.push(...normalizedValues);
		return this;
	}

	/**
	 * Sets default roles to this auto populated select menu.
	 *
	 * @param roles - The roles to set
	 */
	public setDefaultRoles(...roles: RestOrArray<Snowflake>) {
		const normalizedValues = roles.map((id) => {
			return { id, type: SelectMenuDefaultValueType.Role };
		}) as APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[];
		optionsLengthValidator.parse(normalizedValues.length);
		this.data.default_values ??= [];
		this.data.default_values.splice(0, this.data.default_values.length, ...normalizedValues);
		return this;
	}
}
