import type { APIEmbedAuthor } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { embedAuthorPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for the embed author.
 */
export class EmbedAuthorBuilder {
	private readonly data: Partial<APIEmbedAuthor>;

	/**
	 * Creates a new embed author from API data.
	 *
	 * @param data - The API data to use
	 */
	public constructor(data?: Partial<APIEmbedAuthor>) {
		this.data = structuredClone(data) ?? {};
	}

	/**
	 * Sets the name for this embed author.
	 *
	 * @param name - The name to use
	 */
	public setName(name: string): this {
		this.data.name = name;
		return this;
	}

	/**
	 * Sets the URL for this embed author.
	 *
	 * @param url - The url to use
	 */
	public setURL(url: string): this {
		this.data.url = url;
		return this;
	}

	/**
	 * Clears the URL for this embed author.
	 */
	public clearURL(): this {
		this.data.url = undefined;
		return this;
	}

	/**
	 * Sets the icon URL for this embed author.
	 *
	 * @param iconURL - The icon URL to use
	 */
	public setIconURL(iconURL: string): this {
		this.data.icon_url = iconURL;
		return this;
	}

	/**
	 * Clears the icon URL for this embed author.
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
	public toJSON(validationOverride?: boolean): APIEmbedAuthor {
		const clone = structuredClone(this.data);
		validate(embedAuthorPredicate, clone, validationOverride);

		return clone as APIEmbedAuthor;
	}
}
