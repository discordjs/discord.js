import type { APIThumbnailComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { thumbnailPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for thumbnails.
 */
export class ThumbnailBuilder extends ComponentBuilder<APIThumbnailComponent> {
	/**
	 * @internal
	 */
	protected readonly data: Partial<APIThumbnailComponent>;

	/**
	 * Creates a new thumbnail.
	 *
	 * @param data - The API data to create this thumbnail with
	 * @example
	 * Creating a thumbnail from an API data object:
	 * ```ts
	 * const thumbnail = new ThumbnailBuilder({
	 * 	description: 'some text',
	 *  media: {
	 *      url: 'https://cdn.discordapp.com/embed/avatars/4.png',
	 *  },
	 * });
	 * ```
	 * @example
	 * Creating a thumbnail using setters and API data:
	 * ```ts
	 * const thumbnail = new ThumbnailBuilder({
	 * 	media: {
	 *      url: 'attachment://image.png',
	 *  },
	 * })
	 * 	.setDescription('alt text');
	 * ```
	 */
	public constructor(data: Partial<APIThumbnailComponent> = {}) {
		super();

		const { media, ...rest } = data;

		this.data = {
			...structuredClone(rest),
			media: media && { url: media.url },
			type: ComponentType.Thumbnail,
		};
	}

	/**
	 * Sets the description of this thumbnail.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Clears the description of this thumbnail.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets the spoiler status of this thumbnail.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler = true) {
		this.data.spoiler = spoiler;
		return this;
	}

	/**
	 * Sets the media URL of this thumbnail.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.media = { url };
		return this;
	}

	/**
	 * {@inheritdoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIThumbnailComponent {
		const clone = structuredClone(this.data);
		validate(thumbnailPredicate, clone, validationOverride);

		return clone as APIThumbnailComponent;
	}
}
