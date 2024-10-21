import type { APIEmbedFooter } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { embedFooterPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for the embed footer.
 */
export class EmbedFooterBuilder {
	private readonly data: Partial<APIEmbedFooter>;

	/**
	 * Creates a new embed footer from API data.
	 *
	 * @param data - The API data to use
	 */
	public constructor(data?: Partial<APIEmbedFooter>) {
		this.data = structuredClone(data) ?? {};
	}

	/**
	 * Sets the text for this embed footer.
	 *
	 * @param text - The text to use
	 */
	public setText(text: string): this {
		this.data.text = text;
		return this;
	}

	/**
	 * Sets the url for this embed footer.
	 *
	 * @param url - The url to use
	 */
	public setIconURL(url: string): this {
		this.data.icon_url = url;
		return this;
	}

	/**
	 * Clears the icon URL for this embed footer.
	 */
	public clearIconURL(): this {
		this.data.icon_url = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIEmbedFooter {
		const clone = structuredClone(this.data);
		validate(embedFooterPredicate, clone, validationOverride);

		return clone as APIEmbedFooter;
	}
}
