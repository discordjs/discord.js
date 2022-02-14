import type { APIMessageComponentEmoji, APISelectMenuOption } from 'discord-api-types/v9';

/**
 * Represents a non-validated option within a select menu component
 */
export class UnsafeSelectMenuOption {
	public constructor(protected data: Partial<APISelectMenuOption> = {}) {}

	/**
	 * The label for this option
	 */
	public get label() {
		return this.data.label;
	}

	/**
	 * The value for this option
	 */
	public get value() {
		return this.data.value;
	}

	/**
	 * The description for this option
	 */
	public get description() {
		return this.data.description;
	}

	/**
	 * The emoji for this option
	 */
	public get emoji() {
		return this.data.emoji;
	}

	/**
	 * Whether this option is selected by default
	 */
	public get default() {
		return this.data.default;
	}

	/**
	 * Sets the label of this option
	 * @param label The label to show on this option
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the value of this option
	 * @param value The value of this option
	 */
	public setValue(value: string) {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets the description of this option.
	 * @param description The description of this option
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Sets whether this option is selected by default
	 * @param isDefault Whether this option is selected by default
	 */
	public setDefault(isDefault: boolean) {
		this.data.default = isDefault;
		return this;
	}

	/**
	 * Sets the emoji to display on this button
	 * @param emoji The emoji to display on this button
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emoji;
		return this;
	}

	public toJSON(): APISelectMenuOption {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APISelectMenuOption;
	}
}
