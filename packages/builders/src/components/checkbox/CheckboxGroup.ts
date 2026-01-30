import type { APICheckboxGroupComponent, APICheckboxGroupOption } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import type { RestOrArray } from '../../util/normalizeArray';
import { normalizeArray } from '../../util/normalizeArray';
import { ComponentBuilder } from '../Component';
import {
	checkboxGroupOptionPredicate,
	checkboxGroupOptionsLengthValidator,
	checkboxGroupPredicate,
} from './Assertions';
import { CheckboxGroupOptionBuilder } from './CheckboxGroupOption';

/**
 * A builder that creates API-compatible JSON data for checkbox groups.
 */
export class CheckboxGroupBuilder extends ComponentBuilder<APICheckboxGroupComponent> {
	/**
	 * The options within this checkbox group.
	 */
	public readonly options: CheckboxGroupOptionBuilder[];

	/**
	 * Creates a new checkbox group from API data.
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
	 * const checkboxGroup = new CheckboxGroupBuilder()
	 * 	.setCustomId('choose_items')
	 * 	.setOptions([
	 * 		{ label: 'Item A', value: 'item_a' },
	 * 		{ label: 'Item B', value: 'item_b' },
	 * 	])
	 * 	.setMinValues(1)
	 * 	.setMaxValues(2);
	 * ```
	 */
	public constructor(data?: Partial<APICheckboxGroupComponent>) {
		const { options, ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.CheckboxGroup });
		this.options = options?.map((option: APICheckboxGroupOption) => new CheckboxGroupOptionBuilder(option)) ?? [];
	}

	/**
	 * Sets the custom ID of this checkbox group.
	 *
	 * @param customId - The custom ID to use
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
	public addOptions(...options: RestOrArray<APICheckboxGroupOption | CheckboxGroupOptionBuilder>) {
		const normalizedOptions = normalizeArray(options);

		checkboxGroupOptionsLengthValidator.parse(this.options.length + normalizedOptions.length);
		this.options.push(
			...normalizedOptions.map((normalizedOption) => {
				// I do this because TS' duck typing causes issues,
				// if I put in a RadioGroupOption, TS lets it pass but
				// it fails to convert to a checkbox group option at runtime
				const json = 'toJSON' in normalizedOption ? normalizedOption.toJSON() : normalizedOption;
				const option = new CheckboxGroupOptionBuilder(json);
				checkboxGroupOptionPredicate.parse(option.toJSON());
				return option;
			}),
		);
		return this;
	}

	/**
	 * Sets the options for this checkbox group.
	 *
	 * @param options - The options to use
	 */
	public setOptions(options: RestOrArray<APICheckboxGroupOption | CheckboxGroupOptionBuilder>) {
		return this.spliceOptions(0, this.options.length, ...options);
	}

	/**
	 * Removes, replaces, or inserts options for this checkbox group.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice | Array.prototype.splice()}.
	 * It's useful for modifying and adjusting the order of existing options.
	 * @param index - The index to start at
	 * @param deleteCount - The number of options to remove
	 * @param options - The replacing option objects or builders
	 */
	public spliceOptions(
		index: number,
		deleteCount: number,
		...options: RestOrArray<APICheckboxGroupOption | CheckboxGroupOptionBuilder>
	) {
		const normalizedOptions = normalizeArray(options);

		const clone = [...this.options];

		clone.splice(
			index,
			deleteCount,
			...normalizedOptions.map((normalizedOption) => {
				// I do this because TS' duck typing causes issues,
				// if I put in a RadioGroupOption, TS lets it pass but
				// it fails to convert to a checkbox group option at runtime
				const json = 'toJSON' in normalizedOption ? normalizedOption.toJSON() : normalizedOption;
				const option = new CheckboxGroupOptionBuilder(json);
				checkboxGroupOptionPredicate.parse(option.toJSON());
				return option;
			}),
		);

		checkboxGroupOptionsLengthValidator.parse(clone.length);
		this.options.splice(0, this.options.length, ...clone);
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
	 * Sets the maximum number of options that can be selected.
	 *
	 * @param maxValues - The maximum number of options that can be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Sets whether selecting options is required.
	 *
	 * @param required - Whether selecting options is required
	 */
	public setRequired(required: boolean) {
		this.data.required = required;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APICheckboxGroupComponent {
		const data = {
			...this.data,
			options: this.options.map((option) => option.toJSON()),
		};

		checkboxGroupPredicate.parse(data);

		return data as APICheckboxGroupComponent;
	}
}
