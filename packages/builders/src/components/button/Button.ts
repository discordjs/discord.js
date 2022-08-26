import {
	ComponentType,
	type APIMessageComponentEmoji,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
	type APIButtonComponentWithCustomId,
	type ButtonStyle,
} from 'discord-api-types/v10';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

/**
 * Represents a button component
 */
export class ButtonBuilder extends ComponentBuilder<APIButtonComponent> {
	/**
	 * Creates a new button from API data
	 *
	 * @param data - The API data to create this button with
	 * @example
	 * Creating a button from an API data object
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	style: 'primary',
	 * 	label: 'Click Me',
	 * 	emoji: {
	 * 		name: ':smile:',
	 * 		id: '12345678901234567890123456789012',
	 * 	},
	 *  custom_id: '12345678901234567890123456789012',
	 * });
	 * ```
	 * @example
	 * Creating a button using setters and API data
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	style: 'primary',
	 * 	label: 'Click Me',
	 * })
	 * .setEmoji({ name: ':smile:', id: '12345678901234567890123456789012' })
	 * .setCustomId('12345678901234567890123456789012');
	 * ```
	 */
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
	 * @remarks
	 * This method is only available to buttons using the `Link` button style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://` and `discord://`
	 * @param url - The URL to open when this button is clicked
	 */
	public setURL(url: string) {
		(this.data as APIButtonComponentWithURL).url = urlValidator.parse(url);
		return this;
	}

	/**
	 * Sets the custom id for this button
	 *
	 * @remarks
	 * This method is only applicable to buttons that are not using the `Link` button style.
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
	public setEmoji(emoji: APIMessageComponentEmoji | null) {
		this.data.emoji = emojiValidator.parse(emoji) || undefined;
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
	public setLabel(label: string | null) {
		this.data.label = buttonLabelValidator.parse(label) || undefined;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(
			this.data.style,
			this.data.label,
			this.data.emoji,
			(this.data as APIButtonComponentWithCustomId).custom_id,
			(this.data as APIButtonComponentWithURL).url,
		);

		return {
			...this.data,
		} as APIButtonComponent;
	}
}
