import type { Buffer } from 'node:buffer';
import type { JSONEncodable, RawFile } from '@discordjs/util';
import type { RESTAPIAttachment, Snowflake } from 'discord-api-types/v10';
import { validate } from '../util/validation.js';
import { attachmentPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for attachments.
 */
export class AttachmentBuilder implements JSONEncodable<RESTAPIAttachment> {
	/**
	 * The API data associated with this attachment.
	 */
	private readonly data: Partial<RESTAPIAttachment>;

	/**
	 * This data not included in the output of `toJSON()`. For this class specifically, this refers to binary data
	 * that will wind up being included in the multipart/form-data request, if using with the `MessageBuilder`.
	 * To retrieve this data, use {@link getRawFile}.
	 *
	 * @remarks This cannot be set via the constructor, primarily because of the behavior described
	 * {@link https://discord.com/developers/docs/reference#editing-message-attachments | here}.
	 * That is, when editing a message's attachments, you should only be providing file data for new attachments.
	 */
	private readonly fileData: Partial<Pick<RawFile, 'contentType' | 'data'>>;

	/**
	 * Creates a new attachment builder.
	 *
	 * @param data - The API data to create this attachment with
	 */
	public constructor(data: Partial<RESTAPIAttachment> = {}) {
		this.data = structuredClone(data);
		this.fileData = {};
	}

	/**
	 * Sets the id of the attachment.
	 *
	 * @param id - The id of the attachment
	 */
	public setId(id: Snowflake | number): this {
		this.data.id = id;
		return this;
	}

	/**
	 * Sets the description of this attachment.
	 *
	 * @param description - The description of the attachment
	 */
	public setDescription(description: string): this {
		this.data.description = description;
		return this;
	}

	/**
	 * Clears the description of this attachment.
	 */
	public clearDescription(): this {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets the duration of this attachment (audio clips).
	 *
	 * @param duration - The duration of the attachment in seconds
	 */
	public setDuration(duration: number): this {
		this.data.duration_secs = duration;
		return this;
	}

	/**
	 * Clears the duration of this attachment.
	 */
	public clearDuration(): this {
		this.data.duration_secs = undefined;
		return this;
	}

	/**
	 * Sets the filename of this attachment.
	 *
	 * @param filename - The filename of the attachment
	 */
	public setFilename(filename: string): this {
		this.data.filename = filename;
		return this;
	}

	/**
	 * Clears the filename of this attachment.
	 */
	public clearFilename(): this {
		this.data.filename = undefined;
		return this;
	}

	/**
	 * Sets the file data to upload with this attachment.
	 *
	 * @param data - The file data (Buffer, Uint8Array, or string)
	 * @remarks Note that this data is NOT included in the `toJSON()` output. To retrieve, use {@link getRawFile}.
	 */
	public setFileData(data: Buffer | Uint8Array | boolean | number | string): this {
		this.fileData.data = data;
		return this;
	}

	/**
	 * Clears the file data from this attachment.
	 */
	public clearFileData(): this {
		this.fileData.data = undefined;
		return this;
	}

	/**
	 * Sets the content type of the file data to upload with this attachment.
	 */
	public setFileContentType(contentType: string): this {
		this.fileData.contentType = contentType;
		return this;
	}

	/**
	 * Clears the content type of the file data from this attachment.
	 */
	public clearFileContentType(): this {
		this.fileData.contentType = undefined;
		return this;
	}

	/**
	 * Converts this attachment to a RawFile for uploading.
	 *
	 * @returns A RawFile object, or undefined if no file data is set
	 */
	public getRawFile(): Partial<RawFile> | undefined {
		if (!this.fileData) {
			return;
		}

		return {
			...this.fileData,
			name: this.data.filename,
			key: this.data.id ? `files[${this.data.id}]` : undefined,
		};
	}

	/**
	 * Sets the title of this attachment.
	 *
	 * @param title - The title of the attachment
	 */
	public setTitle(title: string): this {
		this.data.title = title;
		return this;
	}

	/**
	 * Clears the title of this attachment.
	 */
	public clearTitle(): this {
		this.data.title = undefined;
		return this;
	}

	/**
	 * Sets the waveform of this attachment (audio clips).
	 *
	 * @param waveform - The waveform of the attachment
	 */
	public setWaveform(waveform: string): this {
		this.data.waveform = waveform;
		return this;
	}

	/**
	 * Clears the waveform of this attachment.
	 */
	public clearWaveform(): this {
		this.data.waveform = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): RESTAPIAttachment {
		const clone = structuredClone(this.data);
		validate(attachmentPredicate, clone, validationOverride);

		return clone as RESTAPIAttachment;
	}
}
