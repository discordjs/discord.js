import {
	ButtonStyle,
	ComponentType,
	type APIButtonComponent,
	type APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { BaseButtonBuilder } from './Button.js';
import { EmojiOrLabelButtonMixin } from './mixins/EmojiOrLabelButtonMixin.js';

/**
 * A builder that creates API-compatible JSON data for buttons with links.
 */
export class LinkButtonBuilder extends Mixin(BaseButtonBuilder<APIButtonComponentWithURL>, EmojiOrLabelButtonMixin) {
	protected override readonly data: Partial<APIButtonComponentWithURL>;

	public constructor(data: Partial<APIButtonComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.Button, style: ButtonStyle.Link };
	}

	/**
	 * Sets the URL for this button.
	 *
	 * @remarks
	 * This method is only available to buttons using the `Link` button style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://`, and `discord://`.
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.url = url;
		return this;
	}
}
