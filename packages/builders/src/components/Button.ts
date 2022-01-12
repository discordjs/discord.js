import { APIButtonComponent, APIMessageComponentEmoji, ButtonStyle, ComponentType } from 'discord-api-types/v9';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from './Assertions';
import type { Component } from './Component';

export class ButtonComponent implements Component {
	public readonly type = ComponentType.Button as const;
	public readonly style!: ButtonStyle;
	public readonly label?: string;
	public readonly emoji?: APIMessageComponentEmoji;
	public readonly disabled?: boolean;
	public readonly custom_id!: string;
	public readonly url!: string;

	public constructor(data?: APIButtonComponent) {
		/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
		this.style = data?.style as ButtonStyle;
		this.label = data?.label;
		this.emoji = data?.emoji;
		this.disabled = data?.disabled;

		// This if/else makes typescript happy
		if (data?.style === ButtonStyle.Link) {
			this.url = data.url;
		} else {
			this.custom_id = data?.custom_id as string;
		}

		/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
	}

	/**
	 * Sets the style of this button
	 * @param style The style of the button
	 */
	public setStyle(style: ButtonStyle) {
		buttonStyleValidator.parse(style);
		Reflect.set(this, 'style', style);
		return this;
	}

	/**
	 * Sets the URL for this button
	 * @param url The URL to open when this button is clicked
	 */
	public setURL(url: string) {
		urlValidator.parse(url);
		Reflect.set(this, 'url', url);
		return this;
	}

	/**
	 * Sets the custom Id for this button
	 * @param customId The custom ID to use for this button
	 */
	public setCustomId(customId: string) {
		customIdValidator.parse(customId);
		Reflect.set(this, 'custom_id', customId);
		return this;
	}

	/**
	 * Sets the emoji to display on this button
	 * @param emoji The emoji to display on this button
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		emojiValidator.parse(emoji);
		Reflect.set(this, 'emoji', emoji);
		return this;
	}

	/**
	 * Sets whether this button is disable or not
	 * @param disabled Whether or not to disable this button or not
	 */
	public setDisabled(disabled: boolean) {
		disabledValidator.parse(disabled);
		Reflect.set(this, 'disabled', disabled);
		return this;
	}

	/**
	 * Sets the label for this button
	 * @param label The label to display on this button
	 */
	public setLabel(label: string) {
		buttonLabelValidator.parse(label);
		Reflect.set(this, 'label', label);
		return this;
	}

	public toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(this.style, this.label, this.emoji, this.custom_id, this.url);
		return {
			...this,
		};
	}
}
