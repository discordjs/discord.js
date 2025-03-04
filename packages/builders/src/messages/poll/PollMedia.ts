import type { APIPollMedia } from 'discord-api-types/v10';

/**
 * The base poll media builder that contains common symbols for poll media builders.
 */
export abstract class PollMediaBuilder {
	/**
	 * The API data associated with this poll media.
	 */
	protected readonly data: Partial<APIPollMedia>;

	/**
	 * Creates new poll media from API data.
	 *
	 * @param data - The API data to use
	 */
	public constructor(data: Partial<APIPollMedia> = {}) {
		this.data = structuredClone(data);
	}

	/**
	 * Sets the text for this poll media.
	 *
	 * @param text - The text to use
	 */
	public setText(text: string): this {
		this.data.text = text;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public abstract toJSON(validationOverride?: boolean): APIPollMedia;
}
