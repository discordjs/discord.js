import {
	ComponentType,
	ButtonStyle,
	type APIMessageComponentEmoji,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
	type APIButtonComponentWithCustomId,
} from 'discord-api-types/v10';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from '../Assertions';
import { ComponentBuilder } from '../Component';

/**
 * Represents a button component
 */
export class ButtonBuilder extends ComponentBuilder<APIButtonComponent> {
	public constructor(data?: Partial<APIButtonComponent>) {
		super({ type: ComponentType.Button, ...data });
	}

	/**
	 * Sets the style of this button
	 *
	 * @param style - The style of the button
	 */
	public setStyle(style: ButtonStyle) {
		this.data.style = buttonStyleValidator.parse(style);
		return this;
	}

	/**
	 * Sets the URL for this button
	 *
	 * @param url - The URL to open when this button is clicked
	 */
	public setURL(url: string) {
		(this.data as APIButtonComponentWithURL).url = urlValidator.parse(url);
		return this;
	}

	/**
	 * Sets the custom id for this button
	 *
	 * @param customId - The custom id to use for this button
	 */
	public setCustomId(customId: string) {
		(this.data as APIButtonComponentWithCustomId).custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets the emoji to display on this button
	 *
	 * @param emoji - The emoji to display on this button
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emojiValidator.parse(emoji);
		return this;
	}

	/**
	 * Sets whether this button is disabled
	 *
	 * @param disabled - Whether to disable this button
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabledValidator.parse(disabled);
		return this;
	}

	/**
	 * Sets the label for this button
	 *
	 * @param label - The label to display on this button
	 */
	public setLabel(label: string) {
		this.data.label = buttonLabelValidator.parse(label);
		return this;
	}

	public toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(
			this.data.style,
			this.data.label,
			this.data.emoji,
			(this.data as APIButtonComponentWithCustomId).custom_id,
			(this.data as APIButtonComponentWithURL).url,
		);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APIButtonComponent;
	}
}
