import {
	ComponentType,
	ButtonStyle,
	type APIMessageComponentEmoji,
	type APIButtonComponent,
	APIButtonComponentWithURL,
	APIButtonComponentWithCustomId,
} from 'discord-api-types/v9';
import { Component } from '../Component';

export class UnsafeButtonComponent extends Component<APIButtonComponent> {
	public constructor(data?: APIButtonComponent) {
		super({ type: ComponentType.Button, ...data });
	}

	public get type(): ComponentType.Button {
		return this.data.type;
	}

	public get style() {
		return this.data.style;
	}

	public get label() {
		return this.data.label;
	}

	public get emoji() {
		return this.data.emoji;
	}

	public get disabled() {
		return this.data.disabled;
	}

	public get customId() {
		return (this.data as APIButtonComponentWithCustomId).custom_id;
	}

	public get url() {
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
	 * @param customId The custom ID to use for this button
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
		return {
			...this.data,
		};
	}
}
