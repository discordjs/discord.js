import type { APIRadioGroupComponent, APIRadioGroupOption } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { radioGroupPredicate } from './Assertions.js';
import { RadioGroupOptionBuilder } from './RadioGroupOption.js';

export interface RadioGroupBuilderData extends Partial<Omit<APIRadioGroupComponent, 'options'>> {
	options: RadioGroupOptionBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for radio groups.
 */
export class RadioGroupBuilder extends ComponentBuilder<APIRadioGroupComponent> {
	/**
	 * @internal
	 */
	protected readonly data: RadioGroupBuilderData;

	/**
	 * The options for this radio group.
	 */
	public get options(): readonly RadioGroupOptionBuilder[] {
		return this.data.options;
	}

	/**
	 * Creates a new radio group.
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
	 * const radioGroup = new RadioGroupBuilder({
	 * 	custom_id: 'choose_items',
	 * })
	 * 	.setOptions(
	 * 		{ label: 'Item A', value: 'item_a' },
	 * 		{ label: 'Item B', value: 'item_b' },
	 * 	);
	 * ```
	 */
	public constructor(data: Partial<APIRadioGroupComponent> = {}) {
		super();

		const { options = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			options: options.map((option) => new RadioGroupOptionBuilder(option)),
			type: ComponentType.RadioGroup,
		};
	}

	/**
	 * Sets the custom id for this radio group.
	 *
	 * @param customId - The custom id to use
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
	public addOptions(
		...options: RestOrArray<
			APIRadioGroupOption | RadioGroupOptionBuilder | ((builder: RadioGroupOptionBuilder) => RadioGroupOptionBuilder)
		>
	) {
		const normalizedOptions = normalizeArray(options);
		const resolved = normalizedOptions.map((option) => resolveBuilder(option, RadioGroupOptionBuilder));

		this.data.options.push(...resolved);

		return this;
	}

	/**
	 * Sets the options for this radio group.
	 *
	 * @param options - The options to set
	 */
	public setOptions(
		...options: RestOrArray<
			APIRadioGroupOption | RadioGroupOptionBuilder | ((builder: RadioGroupOptionBuilder) => RadioGroupOptionBuilder)
		>
	) {
		return this.spliceOptions(0, this.options.length, ...normalizeArray(options));
	}

	/**
	 * Removes, replaces, or inserts options for this radio group.
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
			| APIRadioGroupOption
			| RadioGroupOptionBuilder
			| ((builder: RadioGroupOptionBuilder) => RadioGroupOptionBuilder)
		)[]
	) {
		const resolved = options.map((option) => resolveBuilder(option, RadioGroupOptionBuilder));

		this.data.options.splice(index, deleteCount, ...resolved);

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
	public toJSON(validationOverride?: boolean): APIRadioGroupComponent {
		const { options, ...rest } = this.data;
		const data = {
			...structuredClone(rest),
			// radioGroupPredicate covers the validation of options
			options: options.map((option) => option.toJSON(false)),
		};

		validate(radioGroupPredicate, data, validationOverride);

		return data as APIRadioGroupComponent;
	}
}
