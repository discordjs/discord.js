import type { JSONEncodable } from '@discordjs/util';
import type { APIRadioGroupOption } from 'discord-api-types/v10';
import { radioGroupOptionPredicate } from './Assertions';

/**
 * A builder that creates API-compatible JSON data for radio group options.
 */
export class RadioGroupOptionBuilder implements JSONEncodable<APIRadioGroupOption> {
	/**
	 * Creates a new radio group option from API data.
	 *
	 * @param data - The API data to create this radio group option with
	 * @example
	 * Creating a radio group option from an API data object:
	 * ```ts
	 * const option = new RadioGroupOptionBuilder({
	 * 	label: 'Option 1',
	 * 	value: 'option_1',
	 * });
	 * ```
	 * @example
	 * Creating a radio group option using setters and API data:
	 * ```ts
	 * const option = new RadioGroupOptionBuilder()
	 * 	.setLabel('Option 2')
	 * 	.setValue('option_2');
	 * ```
	 */
	public constructor(public data: Partial<APIRadioGroupOption> = {}) {}

	/**
	 * Sets the label for this option.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the value for this option.
	 *
	 * @param value - The value to use
	 */
	public setValue(value: string) {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets the description for this option.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Sets whether this option is selected by default.
	 *
	 * @param isDefault - Whether the option should be selected by default
	 */
	public setDefault(isDefault: boolean) {
		this.data.default = isDefault;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIRadioGroupOption {
		radioGroupOptionPredicate.parse(this.data);

		return {
			...this.data,
		} as APIRadioGroupOption;
	}
}
