import type { JSONEncodable } from '@discordjs/util';
import type { APIMessageComponentEmoji, APISelectMenuOption } from 'discord-api-types/v10';
import {
	defaultValidator,
	emojiValidator,
	labelValueDescriptionValidator,
	validateRequiredSelectMenuOptionParameters,
} from '../Assertions.js';

/**
 * Represents a option within a select menu component
 */
export class SelectMenuOptionBuilder implements JSONEncodable<APISelectMenuOption> {
	/**
	 * Creates a new select menu option from API data
	 *
	 * @param data - The API data to create this select menu option with
	 * @example
	 * Creating a select menu option from an API data object
	 * ```ts
	 * const selectMenuOption = new SelectMenuOptionBuilder({
	 * 	label: 'catchy label',
	 * 	value: '1',
	 * });
	 * ```
	 * @example
	 * Creating a select menu option using setters and API data
	 * ```ts
	 * const selectMenuOption = new SelectMenuOptionBuilder({
	 * 	default: true,
	 * 	value: '1',
	 * })
	 * 	.setLabel('woah')
	 * ```
	 */
	public constructor(public data: Partial<APISelectMenuOption> = {}) {}

	/**
	 * Sets the label of this option
	 *
	 * @param label - The label to show on this option
	 */
	public setLabel(label: string) {
		this.data.label = labelValueDescriptionValidator.parse(label);
		return this;
	}

	/**
	 * Sets the value of this option
	 *
	 * @param value - The value of this option
	 */
	public setValue(value: string) {
		this.data.value = labelValueDescriptionValidator.parse(value);
		return this;
	}

	/**
	 * Sets the description of this option
	 *
	 * @param description - The description of this option
	 */
	public setDescription(description: string) {
		this.data.description = labelValueDescriptionValidator.parse(description);
		return this;
	}

	/**
	 * Sets whether this option is selected by default
	 *
	 * @param isDefault - Whether this option is selected by default
	 */
	public setDefault(isDefault = true) {
		this.data.default = defaultValidator.parse(isDefault);
		return this;
	}

	/**
	 * Sets the emoji to display on this option
	 *
	 * @param emoji - The emoji to display on this option
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emojiValidator.parse(emoji);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APISelectMenuOption {
		validateRequiredSelectMenuOptionParameters(this.data.label, this.data.value);

		return {
			...this.data,
		} as APISelectMenuOption;
	}
}
