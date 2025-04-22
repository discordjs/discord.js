import { ComponentType, type APIFileComponent } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { filePredicate } from './Assertions.js';

export class FileBuilder extends ComponentBuilder<APIFileComponent> {
	private readonly data: Partial<APIFileComponent>;

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
		super();
		this.data = {
			...structuredClone(data),
			file: data.file ? { url: data.file.url } : undefined,
			type: ComponentType.File,
		};
	}

	/**
	 * Sets the spoiler status of this file.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler: boolean) {
		this.data.spoiler = spoiler;
		return this;
	}

	/**
	 * Sets the media URL of this file.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.file = { url };
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIFileComponent {
		const clone = structuredClone(this.data);
		validate(filePredicate, clone, validationOverride);

		return clone as APIFileComponent;
	}
}
