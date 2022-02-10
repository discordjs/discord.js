import type { APIMessageComponentEmoji, APISelectMenuOption } from 'discord-api-types/v9';

/**
 * Represents a non-validated option within a select menu component
 */
export class UnsafeSelectMenuOption {
	public readonly label!: string;
	public readonly value!: string;
	public readonly description?: string;
	public readonly emoji?: APIMessageComponentEmoji;
	public readonly default?: boolean;

	public constructor(data?: APISelectMenuOption) {
		/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
		this.label = data?.label as string;
		this.value = data?.value as string;
		/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
		this.description = data?.description;
		this.emoji = data?.emoji;
		this.default = data?.default;
	}

	/**
	 * Sets the label of this option
	 * @param label The label to show on this option
	 */
	public setLabel(label: string) {
		Reflect.set(this, 'label', label);
		return this;
	}

	/**
	 * Sets the value of this option
	 * @param value The value of this option
	 */
	public setValue(value: string) {
		Reflect.set(this, 'value', value);
		return this;
	}

	/**
	 * Sets the description of this option.
	 * @param description The description of this option
	 */
	public setDescription(description: string) {
		Reflect.set(this, 'description', description);
		return this;
	}

	/**
	 * Sets whether this option is selected by default
	 * @param isDefault Whether or not this option is selected by default
	 */
	public setDefault(isDefault: boolean) {
		Reflect.set(this, 'default', isDefault);
		return this;
	}

	/**
	 * Sets the emoji to display on this button
	 * @param emoji The emoji to display on this button
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		Reflect.set(this, 'emoji', emoji);
		return this;
	}

	public toJSON(): APISelectMenuOption {
		return {
			...this,
		};
	}
}
