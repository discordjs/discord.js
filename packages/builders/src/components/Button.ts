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
	public readonly style?: ButtonStyle;
	public readonly label?: string;
	public readonly emoji?: APIMessageComponentEmoji;
	public readonly disabled?: boolean;
	public readonly customId?: string;
	public readonly url?: string;

	public constructor(data?: APIButtonComponent) {
		this.style = data?.style;
		this.label = data?.label;
		this.emoji = data?.emoji;
		this.disabled = data?.disabled;

		// This if/else makes typescript happy
		if (data?.style === ButtonStyle.Link) {
			this.url = data.url;
		} else {
			this.customId = data?.custom_id;
		}
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
		Reflect.set(this, 'customId', customId);
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
		validateRequiredButtonParameters(this.style!, this.label, this.emoji, this.customId, this.url);
		return {
			type: this.type,
			style: this.style!,
			label: this.label,
			url: this.url!,
			emoji: this.emoji,
			disabled: this.disabled,
			custom_id: this.customId!,
		};
	}
}
