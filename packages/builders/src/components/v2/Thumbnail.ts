import type { APIThumbnailComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { thumbnailPredicate } from './Assertions.js';

export class ThumbnailBuilder extends ComponentBuilder<APIThumbnailComponent> {
	private readonly data: Partial<APIThumbnailComponent>;

	public constructor(data: Partial<APIThumbnailComponent> = {}) {
		super();
		this.data = {
			...structuredClone(data),
			media: data.media ? { url: data.media.url } : undefined,
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
	public setSpoiler(spoiler: boolean) {
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
