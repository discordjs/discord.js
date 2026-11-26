import type { APICheckboxGroupComponent, APICheckboxGroupOption } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { checkboxGroupPredicate } from './Assertions.js';
import { CheckboxGroupOptionBuilder } from './CheckboxGroupOption.js';

export interface CheckboxGroupBuilderData extends Partial<Omit<APICheckboxGroupComponent, 'options'>> {
	options: CheckboxGroupOptionBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for checkbox groups.
 */
export class CheckboxGroupBuilder extends ComponentBuilder<APICheckboxGroupComponent> {
	/**
	 * @internal
	 */
	protected readonly data: CheckboxGroupBuilderData;

	/**
	 * The options for this checkbox group.
	 */
	public get options(): readonly CheckboxGroupOptionBuilder[] {
		return this.data.options;
	}

	/**
	 * Creates a new checkbox group.
	 *
	 * @param data - The API data to create this checkbox group with
	 * @example
	 * Creating a checkbox group from an API data object:
	 * ```ts
	 * const checkboxGroup = new CheckboxGroupBuilder({
	 * 	custom_id: 'select_options',
	 * 	options: [
	 * 		{ label: 'Option 1', value: 'option_1' },
	 * 		{ label: 'Option 2', value: 'option_2' },
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a checkbox group using setters and API data:
	 * ```ts
	 * const checkboxGroup = new CheckboxGroupBuilder({
	 * 	custom_id: 'choose_items',
	 * })
	 * 	.setOptions(
	 * 		{ label: 'Item A', value: 'item_a' },
	 * 		{ label: 'Item B', value: 'item_b' },
	 * 	)
	 * 	.setMinValues(1)
	 * 	.setMaxValues(2);
	 * ```
	 */
	public constructor(data: Partial<APICheckboxGroupComponent> = {}) {
		super();

		const { options = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			options: options.map((option) => new CheckboxGroupOptionBuilder(option)),
			type: ComponentType.CheckboxGroup,
		};
	}

	/**
	 * Sets the custom id for this checkbox group.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Adds options to this checkbox group.
	 *
	 * @param options - The options to add
	 */
	public addOptions(
		...options: RestOrArray<
			| APICheckboxGroupOption
			| CheckboxGroupOptionBuilder
			| ((builder: CheckboxGroupOptionBuilder) => CheckboxGroupOptionBuilder)
		>
	) {
		const normalizedOptions = normalizeArray(options);
		const resolved = normalizedOptions.map((option) => resolveBuilder(option, CheckboxGroupOptionBuilder));

		this.data.options.push(...resolved);

		return this;
	}

	/**
	 * Sets the options for this checkbox group.
	 *
	 * @param options - The options to set
	 */
	public setOptions(
		...options: RestOrArray<
			| APICheckboxGroupOption
			| CheckboxGroupOptionBuilder
			| ((builder: CheckboxGroupOptionBuilder) => CheckboxGroupOptionBuilder)
		>
	) {
		return this.spliceOptions(0, this.options.length, ...normalizeArray(options));
	}

	/**
	 * Removes, replaces, or inserts options for this checkbox group.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * It's useful for modifying and adjusting the order of existing options.
	 * @param index - The index to start at
	 * @param deleteCount - The number of options to remove
	 * @param options - The replacing option objects or builders
	 */
	public spliceOptions(
		index: number,
		deleteCount: number,
		...options: (
			| APICheckboxGroupOption
			| CheckboxGroupOptionBuilder
			| ((builder: CheckboxGroupOptionBuilder) => CheckboxGroupOptionBuilder)
		)[]
	) {
		const resolved = options.map((option) => resolveBuilder(option, CheckboxGroupOptionBuilder));

		this.data.options.splice(index, deleteCount, ...resolved);

		return this;
	}

	/**
	 * Sets the minimum number of options that must be selected.
	 *
	 * @param minValues - The minimum number of options that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minValues;
		return this;
	}

	/**
	 * Clears the minimum values.
	 */
	public clearMinValues() {
		this.data.min_values = undefined;
		return this;
	}

	/**
	 * Sets the maximum number of options that can be selected.
	 *
	 * @param maxValues - The maximum number of options that can be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Clears the maximum values.
	 */
	public clearMaxValues() {
		this.data.max_values = undefined;
		return this;
	}

	/**
	 * Sets whether selecting options is required.
	 *
	 * @param required - Whether selecting options is required
	 */
	public setRequired(required = true) {
		this.data.required = required;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): APICheckboxGroupComponent {
		const { options, ...rest } = this.data;
		const data = {
			...structuredClone(rest),
			// checkboxGroupPredicate covers the validation of options
			options: options.map((option) => option.toJSON(false)),
		};

		validate(checkboxGroupPredicate, data, validationOverride);

		return data as APICheckboxGroupComponent;
	}
}
