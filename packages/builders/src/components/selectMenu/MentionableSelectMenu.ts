import {
	type APIMentionableSelectComponent,
	type APISelectMenuDefaultValue,
	type Snowflake,
	ComponentType,
	SelectMenuDefaultValueType,
} from 'discord-api-types/v10';
import { type RestOrArray, normalizeArray } from '../../util/normalizeArray.js';
import { optionsLengthValidator } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

/**
 * A builder that creates API-compatible JSON data for mentionable select menus.
 */
export class MentionableSelectMenuBuilder extends BaseSelectMenuBuilder<APIMentionableSelectComponent> {
	/**
	 * Creates a new select menu from API data.
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object:
	 * ```ts
	 * const selectMenu = new MentionableSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data:
	 * ```ts
	 * const selectMenu = new MentionableSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1);
	 * ```
	 */
	public constructor(data?: Partial<APIMentionableSelectComponent>) {
		super({ ...data, type: ComponentType.MentionableSelect });
	}

	/**
	 * Adds default roles to this auto populated select menu.
	 *
	 * @param roles - The roles to add
	 */
	public addDefaultRoles(...roles: RestOrArray<Snowflake>) {
		const normalizedValues = normalizeArray(roles);
		optionsLengthValidator.parse((this.data.default_values?.length ?? 0) + normalizedValues.length);
		this.data.default_values ??= [];

		this.data.default_values.push(
			...normalizedValues.map((id) => ({
				id,
				type: SelectMenuDefaultValueType.Role as const,
			})),
		);

		return this;
	}

	/**
	 * Adds default users to this auto populated select menu.
	 *
	 * @param users - The users to add
	 */
	public addDefaultUsers(...users: RestOrArray<Snowflake>) {
		const normalizedValues = normalizeArray(users);
		optionsLengthValidator.parse((this.data.default_values?.length ?? 0) + normalizedValues.length);
		this.data.default_values ??= [];

		this.data.default_values.push(
			...normalizedValues.map((id) => ({
				id,
				type: SelectMenuDefaultValueType.User as const,
			})),
		);

		return this;
	}

	/**
	 * Adds default values to this auto populated select menu.
	 *
	 * @param values - The values to add
	 */
	public addDefaultValues(
		...values: RestOrArray<
			| APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>
			| APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>
		>
	) {
		const normalizedValues = normalizeArray(values);
		optionsLengthValidator.parse((this.data.default_values?.length ?? 0) + normalizedValues.length);
		this.data.default_values ??= [];
		this.data.default_values.push(...normalizedValues);
		return this;
	}

	/**
	 * Sets default values for this auto populated select menu.
	 *
	 * @param values - The values to set
	 */
	public setDefaultValues(
		...values: RestOrArray<
			| APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>
			| APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>
		>
	) {
		const normalizedValues = normalizeArray(values);
		optionsLengthValidator.parse(normalizedValues.length);
		this.data.default_values = normalizedValues;
		return this;
	}
}
