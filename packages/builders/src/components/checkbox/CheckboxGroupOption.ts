import type { JSONEncodable } from '@discordjs/util';
import type { APICheckboxGroupOption } from 'discord-api-types/v10';
import { checkboxGroupOptionPredicate } from './Assertions';

/**
 * A builder that creates API-compatible JSON data for checkbox group options.
 */
export class CheckboxGroupOptionBuilder implements JSONEncodable<APICheckboxGroupOption> {
	/**
	 * Creates a new checkbox group option from API data.
	 *
	 * @param data - The API data to create this checkbox group option with
	 * @example
	 * Creating a checkbox group option from an API data object:
	 * ```ts
	 * const option = new CheckboxGroupOptionBuilder({
	 * 	label: 'Option 1',
	 * 	value: 'option_1',
	 * });
	 * ```
	 * @example
	 * Creating a checkbox group option using setters and API data:
	 * ```ts
	 * const option = new CheckboxGroupOptionBuilder()
	 * 	.setLabel('Option 2')
	 * 	.setValue('option_2');
	 * ```
	 */
	public constructor(public data: Partial<APICheckboxGroupOption> = {}) {}

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
	public toJSON(): APICheckboxGroupOption {
		checkboxGroupOptionPredicate.parse(this.data);

		return {
			...this.data,
		} as APICheckboxGroupOption;
	}
}
