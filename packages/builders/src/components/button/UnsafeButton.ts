import {
	ComponentType,
	ButtonStyle,
	type APIMessageComponentEmoji,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
	type APIButtonComponentWithCustomId,
} from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';

/**
 * Represents a non-validated button component
 */
export class UnsafeButtonBuilder extends ComponentBuilder<APIButtonComponent> {
	public constructor(data?: Partial<APIButtonComponent>) {
		super({ type: ComponentType.Button, ...data });
	}

	/**
	 * Sets the style of this button
	 * @param style The style of the button
	 */
	public setStyle(style: ButtonStyle) {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the URL for this button
	 * @param url The URL to open when this button is clicked
	 */
	public setURL(url: string) {
		(this.data as APIButtonComponentWithURL).url = url;
		return this;
	}

	/**
	 * Sets the custom Id for this button
	 * @param customId The custom id to use for this button
	 */
	public setCustomId(customId: string) {
		(this.data as APIButtonComponentWithCustomId).custom_id = customId;
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

	/**
	 * Sets whether this button is disable or not
	 * @param disabled Whether or not to disable this button or not
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * Sets the label for this button
	 * @param label The label to display on this button
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	public toJSON(): APIButtonComponent {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APIButtonComponent;
	}
}
