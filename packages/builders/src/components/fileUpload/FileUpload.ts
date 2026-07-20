import { type APIFileUploadComponent, ComponentType, type FileUploadType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { ComponentBuilder } from '../Component.js';
import { fileUploadPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for file uploads.
 */
export class FileUploadBuilder extends ComponentBuilder<APIFileUploadComponent> {
	/**
	 * Creates a new file upload.
	 *
	 * @param data - The API data to create this file upload with
	 * @example
	 * Creating a file upload from an API data object:
	 * ```ts
	 * const fileUpload = new FileUploadBuilder({
	 * 	custom_id: "file_upload",
	 *  min_values: 2,
	 *  max_values: 5,
	 *  file_types: ["image", ".pdf"],
	 * });
	 * ```
	 * @example
	 * Creating a file upload using setters and API data:
	 * ```ts
	 * const fileUpload = new FileUploadBuilder({
	 * 	custom_id: "file_upload",
	 *  min_values: 2,
	 *  max_values: 5,
	 * })
	 * 	.setFileTypes("image", ".pdf")
	 * 	.setRequired();
	 * ```
	 */
	public constructor(data: Partial<APIFileUploadComponent> = {}) {
		super({ type: ComponentType.FileUpload, ...data });
	}

	/**
	 * Sets the custom id for this file upload.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets the minimum number of file uploads required.
	 *
	 * @param minValues - The minimum values that must be uploaded
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minValues;
		return this;
	}

	/**
	 * Clears the minimum values.
	 */
	public clearMinValues() {
		this.data.min_values = undefined;
		return this;
	}

	/**
	 * Sets the maximum number of file uploads required.
	 *
	 * @param maxValues - The maximum values that can be uploaded
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Clears the maximum values.
	 */
	public clearMaxValues() {
		this.data.max_values = undefined;
		return this;
	}

	/**
	 * Adds file types allowed in this file upload.
	 *
	 * @remarks
	 * When specifying only extensions, include `.jpg` for image uploads and both `.mp4` and `.mov`
	 * for video uploads due to mobile platform limitations.
	 * @param fileTypes - The file groups or dot-prefixed extensions to allow
	 */
	public addFileTypes(...fileTypes: RestOrArray<FileUploadType>) {
		this.data.file_types ??= [];
		this.data.file_types.push(...normalizeArray(fileTypes));
		return this;
	}

	/**
	 * Sets the file types allowed in this file upload.
	 *
	 * @remarks
	 * When specifying only extensions, include `.jpg` for image uploads and both `.mp4` and `.mov`
	 * for video uploads due to mobile platform limitations.
	 * @param fileTypes - The file groups or dot-prefixed extensions to allow
	 */
	public setFileTypes(...fileTypes: RestOrArray<FileUploadType>) {
		this.data.file_types = normalizeArray(fileTypes);
		return this;
	}

	/**
	 * Clears the file types allowed in this file upload.
	 */
	public clearFileTypes() {
		this.data.file_types = undefined;
		return this;
	}

	/**
	 * Sets whether this file upload is required.
	 *
	 * @param required - Whether this file upload is required
	 */
	public setRequired(required = true) {
		this.data.required = required;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIFileUploadComponent {
		fileUploadPredicate.parse(this.data);
		return this.data as APIFileUploadComponent;
	}
}
