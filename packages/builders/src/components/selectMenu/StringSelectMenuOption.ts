import type { JSONEncodable } from '@discordjs/util';
import type { APIMessageComponentEmoji, APISelectMenuOption } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { selectMenuStringOptionPredicate } from '../Assertions.js';

/**
 * A builder that creates API-compatible JSON data for string select menu options.
 */
export class StringSelectMenuOptionBuilder implements JSONEncodable<APISelectMenuOption> {
	private readonly data: Partial<APISelectMenuOption>;

	/**
	 * Creates a new string select menu option from API data.
	 *
	 * @param data - The API data to create this string select menu option with
	 * @example
	 * Creating a string select menu option from an API data object:
	 * ```ts
	 * const selectMenuOption = new SelectMenuOptionBuilder({
	 * 	label: 'catchy label',
	 * 	value: '1',
	 * });
	 * ```
	 * @example
	 * Creating a string select menu option using setters and API data:
	 * ```ts
	 * const selectMenuOption = new SelectMenuOptionBuilder({
	 * 	default: true,
	 * 	value: '1',
	 * })
	 * 	.setLabel('woah');
	 * ```
	 */
	public constructor(data: Partial<APISelectMenuOption> = {}) {
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
	 * Sets the emoji to display for this option.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emoji;
		return this;
	}

	/**
	 * Clears the emoji for this option.
	 */
	public clearEmoji() {
		this.data.emoji = undefined;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): APISelectMenuOption {
		const clone = structuredClone(this.data);
		validate(selectMenuStringOptionPredicate, clone, validationOverride);

		return clone as APISelectMenuOption;
	}
}
