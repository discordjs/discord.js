import type { APIRadioGroupComponent, APIRadioGroupOption } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import type { RestOrArray } from '../../util/normalizeArray';
import { normalizeArray } from '../../util/normalizeArray';
import { ComponentBuilder } from '../Component';
import { radioGroupOptionPredicate, radioGroupOptionsLengthValidator, radioGroupPredicate } from './Assertions';
import { RadioGroupOptionBuilder } from './RadioGroupOption';

/**
 * A builder that creates API-compatible JSON data for radio groups.
 */
export class RadioGroupBuilder extends ComponentBuilder<APIRadioGroupComponent> {
	/**
	 * The options within this radio group.
	 */
	public readonly options: RadioGroupOptionBuilder[];

	/**
	 * Creates a new radio group from API data.
	 *
	 * @param data - The API data to create this radio group with
	 * @example
	 * Creating a radio group from an API data object:
	 * ```ts
	 * const radioGroup = new RadioGroupBuilder({
	 * 	custom_id: 'select_options',
	 * 	options: [
	 * 		{ label: 'Option 1', value: 'option_1' },
	 * 		{ label: 'Option 2', value: 'option_2' },
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a radio group using setters and API data:
	 * ```ts
	 * const radioGroup = new RadioGroupBuilder()
	 * 	.setCustomId('choose_items')
	 * 	.setOptions([
	 * 		{ label: 'Item A', value: 'item_a' },
	 * 		{ label: 'Item B', value: 'item_b' },
	 * 	])
	 * ```
	 */
	public constructor(data?: Partial<APIRadioGroupComponent>) {
		const { options, ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.RadioGroup });
		this.options = options?.map((option: APIRadioGroupOption) => new RadioGroupOptionBuilder(option)) ?? [];
	}

	/**
	 * Sets the custom ID of this radio group.
	 *
	 * @param customId - The custom ID to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Adds options to this radio group.
	 *
	 * @param options - The options to add
	 */
	public addOptions(...options: RestOrArray<APIRadioGroupOption | RadioGroupOptionBuilder>) {
		const normalizedOptions = normalizeArray(options);

		radioGroupOptionsLengthValidator.parse(this.options.length + normalizedOptions.length);
		this.options.push(
			...normalizedOptions.map((normalizedOption) => {
				// I do this because TS' duck typing causes issues,
				// if I put in a CheckboxGroupOption, TS lets it pass but
				// it fails to convert to a checkbox group option at runtime
				const json = 'toJSON' in normalizedOption ? normalizedOption.toJSON() : normalizedOption;
				const option = new RadioGroupOptionBuilder(json);
				radioGroupOptionPredicate.parse(option.toJSON());
				return option;
			}),
		);
		return this;
	}

	/**
	 * Sets the options for this radio group.
	 *
	 * @param options - The options to use
	 */
	public setOptions(options: RestOrArray<APIRadioGroupOption | RadioGroupOptionBuilder>) {
		return this.spliceOptions(0, this.options.length, ...options);
	}

	/**
	 * Removes, replaces, or inserts options for this radio group.
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
		...options: RestOrArray<APIRadioGroupOption | RadioGroupOptionBuilder>
	) {
		const normalizedOptions = normalizeArray(options);

		const clone = [...this.options];

		clone.splice(
			index,
			deleteCount,
			...normalizedOptions.map((normalizedOption) => {
				// I do this because TS' duck typing causes issues,
				// if I put in a CheckboxGroupOption, TS lets it pass but
				// it fails to convert to a checkbox group option at runtime
				const json = 'toJSON' in normalizedOption ? normalizedOption.toJSON() : normalizedOption;
				const option = new RadioGroupOptionBuilder(json);
				radioGroupOptionPredicate.parse(option.toJSON());
				return option;
			}),
		);

		radioGroupOptionsLengthValidator.parse(clone.length);
		this.options.splice(0, this.options.length, ...clone);
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
	public override toJSON(): APIRadioGroupComponent {
		const data = {
			...this.data,
			options: this.options.map((option) => option.toJSON()),
		};

		radioGroupPredicate.parse(data);

		return data as APIRadioGroupComponent;
	}
}
