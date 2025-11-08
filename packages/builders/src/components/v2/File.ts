import { ComponentType, type APIFileComponent } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';
import { filePredicate, spoilerPredicate } from './Assertions';

export class FileBuilder extends ComponentBuilder<APIFileComponent> {
	/**
	 * Creates a new file from API data.
	 *
	 * @param data - The API data to create this file with
	 * @example
	 * Creating a file from an API data object:
	 * ```ts
	 * const file = new FileBuilder({
	 * 	spoiler: true,
	 * 	file: {
	 * 		url: 'attachment://file.png',
	 * 	},
	 * });
	 * ```
	 * @example
	 * Creating a file using setters and API data:
	 * ```ts
	 * const file = new FileBuilder({
	 * 	file: {
	 * 		url: 'attachment://image.jpg',
	 * 	},
	 * })
	 * 	.setSpoiler(false);
	 * ```
	 */
	public constructor(data: Partial<APIFileComponent> = {}) {
		super({ type: ComponentType.File, ...data, file: data.file ? { url: data.file.url } : undefined });
	}

	/**
	 * Sets the spoiler status of this file.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler = true) {
		this.data.spoiler = spoilerPredicate.parse(spoiler);
		return this;
	}

	/**
	 * Sets the media URL of this file.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.file = filePredicate.parse({ url });
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APIFileComponent {
		filePredicate.parse(this.data.file);

		return { ...this.data, file: { ...this.data.file } } as APIFileComponent;
	}
}
