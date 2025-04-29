import type { APIThumbnailComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';
import { descriptionPredicate, spoilerPredicate, unfurledMediaItemPredicate } from './Assertions';

export class ThumbnailBuilder extends ComponentBuilder<APIThumbnailComponent> {
	/**
	 * Creates a new thumbnail from API data.
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
		super({
			type: ComponentType.Thumbnail,
			...data,
			media: data.media ? { url: data.media.url } : undefined,
		});
	}

	/**
	 * Sets the description of this thumbnail.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = descriptionPredicate.parse(description);
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
		this.data.spoiler = spoilerPredicate.parse(spoiler);
		return this;
	}

	/**
	 * Sets the media URL of this thumbnail.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.media = unfurledMediaItemPredicate.parse({ url });
		return this;
	}

	/**
	 * {@inheritdoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APIThumbnailComponent {
		unfurledMediaItemPredicate.parse(this.data.media);

		return { ...this.data } as APIThumbnailComponent;
	}
}
