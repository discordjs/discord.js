import {
	ComponentType,
	ButtonStyle,
	type APIMessageComponentEmoji,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
	type APIButtonComponentWithCustomId,
} from 'discord-api-types/v9';
import { Component } from '../Component';

/**
 * Represents a non-validated button component
 */
export class UnsafeButtonComponent extends Component<Partial<APIButtonComponent> & { type: ComponentType.Button }> {
	public constructor(data?: Partial<APIButtonComponent>) {
		super({ type: ComponentType.Button, ...data });
	}

	/**
	 * The style of this button
	 */
	public get style() {
		return this.data.style;
	}

	/**
	 * The label of this button
	 */
	public get label() {
		return this.data.label;
	}

	/**
	 * The emoji used in this button
	 */
	public get emoji() {
		return this.data.emoji;
	}

	/**
	 * Whether this button is disabled
	 */
	public get disabled() {
		return this.data.disabled;
	}

	/**
	 * The custom id of this button (only defined on non-link buttons)
	 */
	public get customId(): string | undefined {
		return (this.data as APIButtonComponentWithCustomId).custom_id;
	}

	/**
	 * The URL of this button (only defined on link buttons)
	 */
	public get url(): string | undefined {
		return (this.data as APIButtonComponentWithURL).url;
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
	public setDisabled(disabled: boolean) {
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
