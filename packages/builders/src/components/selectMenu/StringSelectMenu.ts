import { ComponentType } from 'discord-api-types/v10';
import type { APIStringSelectComponent, APISelectMenuOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { selectMenuStringPredicate } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';
import { StringSelectMenuOptionBuilder } from './StringSelectMenuOption.js';

export interface StringSelectMenuData extends Partial<Omit<APIStringSelectComponent, 'options'>> {
	options: StringSelectMenuOptionBuilder[];
	required?: boolean;
}

/**
 * A builder that creates API-compatible JSON data for string select menus.
 */
export class StringSelectMenuBuilder extends BaseSelectMenuBuilder<APIStringSelectComponent> {
	protected override readonly data: StringSelectMenuData;

	/**
	 * The options for this select menu.
	 */
	public get options(): readonly StringSelectMenuOptionBuilder[] {
		return this.data.options;
	}

	/**
	 * Creates a new string select menu.
	 *
	 * @param data - The API data to create this string select menu with
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
	public constructor(data: Partial<APIStringSelectComponent> = {}) {
		super();

		const { options = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			options: options.map((option) => new StringSelectMenuOptionBuilder(option)),
			type: ComponentType.StringSelect,
		};
	}

	/**
	 * Adds options to this select menu.
	 *
	 * @param options - The options to add
	 */
	public addOptions(
		...options: RestOrArray<
			| APISelectMenuOption
			| StringSelectMenuOptionBuilder
			| ((builder: StringSelectMenuOptionBuilder) => StringSelectMenuOptionBuilder)
		>
	) {
		const normalizedOptions = normalizeArray(options);
		const resolved = normalizedOptions.map((option) => resolveBuilder(option, StringSelectMenuOptionBuilder));

		this.data.options.push(...resolved);

		return this;
	}

	/**
	 * Sets the options for this select menu.
	 *
	 * @param options - The options to set
	 */
	public setOptions(
		...options: RestOrArray<
			| APISelectMenuOption
			| StringSelectMenuOptionBuilder
			| ((builder: StringSelectMenuOptionBuilder) => StringSelectMenuOptionBuilder)
		>
	) {
		return this.spliceOptions(0, this.options.length, ...normalizeArray(options));
	}

	/**
	 * Removes, replaces, or inserts options for this select menu.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/slice | Array.prototype.splice()}.
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
		...options: (
			| APISelectMenuOption
			| StringSelectMenuOptionBuilder
			| ((builder: StringSelectMenuOptionBuilder) => StringSelectMenuOptionBuilder)
		)[]
	) {
		const resolved = options.map((option) => resolveBuilder(option, StringSelectMenuOptionBuilder));

		this.data.options ??= [];
		this.data.options.splice(index, deleteCount, ...resolved);

		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIStringSelectComponent {
		const { options, ...rest } = this.data;
		const data = {
			...(structuredClone(rest) as APIStringSelectComponent),
			// selectMenuStringPredicate covers the validation of options
			options: options.map((option) => option.toJSON(false)),
		};

		validate(selectMenuStringPredicate, data, validationOverride);

		return data as APIStringSelectComponent;
	}
}
