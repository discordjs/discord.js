import {
	type APIUserSelectComponent,
	type Snowflake,
	ComponentType,
	SelectMenuDefaultValueType,
} from 'discord-api-types/v10';
import { type RestOrArray, normalizeArray } from '../../util/normalizeArray.js';
import { validate } from '../../util/validation.js';
import { selectMenuUserPredicate } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

/**
 * A builder that creates API-compatible JSON data for user select menus.
 */
export class UserSelectMenuBuilder extends BaseSelectMenuBuilder<APIUserSelectComponent> {
	protected override readonly data: Partial<APIUserSelectComponent>;

	/**
	 * Creates a new select menu from API data.
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object:
	 * ```ts
	 * const selectMenu = new UserSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data:
	 * ```ts
	 * const selectMenu = new UserSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1);
	 * ```
	 */
	public constructor(data: Partial<APIUserSelectComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.UserSelect };
	}

	/**
	 * Adds default users to this auto populated select menu.
	 *
	 * @param users - The users to add
	 */
	public addDefaultUsers(...users: RestOrArray<Snowflake>) {
		const normalizedValues = normalizeArray(users);

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
	 * Sets default users for this auto populated select menu.
	 *
	 * @param users - The users to set
	 */
	public setDefaultUsers(...users: RestOrArray<Snowflake>) {
		const normalizedValues = normalizeArray(users);

		this.data.default_values = normalizedValues.map((id) => ({
			id,
			type: SelectMenuDefaultValueType.User as const,
		}));

		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIUserSelectComponent {
		const clone = structuredClone(this.data);
		validate(selectMenuUserPredicate, clone, validationOverride);

		return clone as APIUserSelectComponent;
	}
}
