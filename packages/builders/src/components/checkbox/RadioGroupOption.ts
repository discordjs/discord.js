import type { JSONEncodable } from '@discordjs/util';
import type { APIRadioGroupOption } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { radioGroupOptionPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for radio group options.
 */
export class RadioGroupOptionBuilder implements JSONEncodable<APIRadioGroupOption> {
	private readonly data: Partial<APIRadioGroupOption>;

	/**
	 * Creates a new radio group option.
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
	 * const option = new RadioGroupOptionBuilder({
	 * 	default: true,
	 * 	value: 'option_2',
	 * })
	 * 	.setLabel('Option 2');
	 * ```
	 */
	public constructor(data: Partial<APIRadioGroupOption> = {}) {
		this.data = structuredClone(data);
	}

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
	 * Clears the description for this option.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets whether this option is selected by default.
	 *
	 * @param isDefault - Whether this option is selected by default
	 */
	public setDefault(isDefault = true) {
		this.data.default = isDefault;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): APIRadioGroupOption {
		const clone = structuredClone(this.data);
		validate(radioGroupOptionPredicate, clone, validationOverride);

		return clone as APIRadioGroupOption;
	}
}
