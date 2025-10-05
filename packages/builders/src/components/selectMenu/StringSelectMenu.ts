import { ComponentType } from 'discord-api-types/v10';
import type { APIStringSelectComponent, APISelectMenuOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { jsonOptionValidator, optionsLengthValidator, validateRequiredSelectMenuParameters } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';
import { StringSelectMenuOptionBuilder } from './StringSelectMenuOption.js';

/**
 * A builder that creates API-compatible JSON data for string select menus.
 */
export class StringSelectMenuBuilder extends BaseSelectMenuBuilder<APIStringSelectComponent> {
	/**
	 * The options within this select menu.
	 */
	public readonly options: StringSelectMenuOptionBuilder[];

	/**
	 * Creates a new select menu from API data.
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object:
	 * ```ts
	 * const selectMenu = new StringSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * 	options: [
	 * 		{ label: 'option 1', value: '1' },
	 * 		{ label: 'option 2', value: '2' },
	 * 		{ label: 'option 3', value: '3' },
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data:
	 * ```ts
	 * const selectMenu = new StringSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1)
	 * 	.addOptions({
	 * 		label: 'Catchy',
	 * 		value: 'catch',
	 * 	});
	 * ```
	 */
	public constructor(data?: Partial<APIStringSelectComponent>) {
		const { options, ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.StringSelect });
		this.options = options?.map((option: APISelectMenuOption) => new StringSelectMenuOptionBuilder(option)) ?? [];
	}

	/**
	 * Adds options to this select menu.
	 *
	 * @param options - The options to add
	 */
	public addOptions(...options: RestOrArray<APISelectMenuOption | StringSelectMenuOptionBuilder>) {
		const normalizedOptions = normalizeArray(options);
		optionsLengthValidator.parse(this.options.length + normalizedOptions.length);
		this.options.push(
			...normalizedOptions.map((normalizedOption) =>
				normalizedOption instanceof StringSelectMenuOptionBuilder
					? normalizedOption
					: new StringSelectMenuOptionBuilder(jsonOptionValidator.parse(normalizedOption)),
			),
		);
		return this;
	}

	/**
	 * Sets the options for this select menu.
	 *
	 * @param options - The options to set
	 */
	public setOptions(...options: RestOrArray<APISelectMenuOption | StringSelectMenuOptionBuilder>) {
		return this.spliceOptions(0, this.options.length, ...options);
	}

	/**
	 * Removes, replaces, or inserts options for this select menu.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice | Array.prototype.splice()}.
	 * It's useful for modifying and adjusting the order of existing options.
	 * @example
	 * Remove the first option:
	 * ```ts
	 * selectMenu.spliceOptions(0, 1);
	 * ```
	 * @example
	 * Remove the first n option:
	 * ```ts
	 * const n = 4;
	 * selectMenu.spliceOptions(0, n);
	 * ```
	 * @example
	 * Remove the last option:
	 * ```ts
	 * selectMenu.spliceOptions(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of options to remove
	 * @param options - The replacing option objects or builders
	 */
	public spliceOptions(
		index: number,
		deleteCount: number,
		...options: RestOrArray<APISelectMenuOption | StringSelectMenuOptionBuilder>
	) {
		const normalizedOptions = normalizeArray(options);

		const clone = [...this.options];

		clone.splice(
			index,
			deleteCount,
			...normalizedOptions.map((normalizedOption) =>
				normalizedOption instanceof StringSelectMenuOptionBuilder
					? normalizedOption
					: new StringSelectMenuOptionBuilder(jsonOptionValidator.parse(normalizedOption)),
			),
		);

		optionsLengthValidator.parse(clone.length);
		this.options.splice(0, this.options.length, ...clone);
		return this;
	}

	/**
	 * {@inheritDoc BaseSelectMenuBuilder.toJSON}
	 */
	public override toJSON(): APIStringSelectComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);

		return {
			...this.data,
			options: this.options.map((option) => option.toJSON()),
		} as APIStringSelectComponent;
	}
}
