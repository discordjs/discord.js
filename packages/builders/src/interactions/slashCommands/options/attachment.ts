import {
	ApplicationCommandOptionType,
	type APIApplicationCommandAttachmentOption,
	type FileUploadType,
} from 'discord-api-types/v10';
import { fileUploadTypesValidator } from '../../../util/fileUpload.js';
import { normalizeArray, type RestOrArray } from '../../../util/normalizeArray.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command attachment option.
 */
export class SlashCommandAttachmentOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public override readonly type = ApplicationCommandOptionType.Attachment as const;

	/**
	 * The file types allowed for this attachment option.
	 */
	public readonly file_types?: FileUploadType[];

	/**
	 * Adds file types allowed for this attachment option.
	 *
	 * @remarks
	 * When specifying only extensions, include `.jpg` for image uploads and both `.mp4` and `.mov`
	 * for video uploads due to mobile platform limitations.
	 * @param fileTypes - The file groups or dot-prefixed extensions to allow
	 */
	public addFileTypes(...fileTypes: RestOrArray<FileUploadType>) {
		const normalizedFileTypes = normalizeArray(fileTypes);
		fileUploadTypesValidator.parse([...(this.file_types ?? []), ...normalizedFileTypes]);

		if (this.file_types === undefined) {
			Reflect.set(this, 'file_types', []);
		}

		this.file_types!.push(...normalizedFileTypes);
		return this;
	}

	/**
	 * Sets the file types allowed for this attachment option.
	 *
	 * @remarks
	 * When specifying only extensions, include `.jpg` for image uploads and both `.mp4` and `.mov`
	 * for video uploads due to mobile platform limitations.
	 * @param fileTypes - The file groups or dot-prefixed extensions to allow
	 */
	public setFileTypes(...fileTypes: RestOrArray<FileUploadType>) {
		const normalizedFileTypes = normalizeArray(fileTypes);
		fileUploadTypesValidator.parse(normalizedFileTypes);
		Reflect.set(this, 'file_types', normalizedFileTypes);
		return this;
	}

	/**
	 * Clears the file types allowed for this attachment option.
	 */
	public clearFileTypes() {
		Reflect.set(this, 'file_types', undefined);
		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandAttachmentOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
