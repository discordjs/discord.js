import { ComponentType, type APIFileComponent } from 'discord-api-types/v10';
import { validate } from '../../util/validation';
import { ComponentBuilder } from '../Component';
import { filePredicate } from './Assertions';

export class FileBuilder extends ComponentBuilder<APIFileComponent> {
	private readonly data: Partial<APIFileComponent>;

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
