import type { Stream } from 'node:stream';
import type { APIAttachment } from 'discord-api-types/v10';

export type BufferResolvable = ArrayBuffer | string;

/**
 * Represents an attachment.
 */
export class UnsafeAttachmentBuilder {
	public attachment: BufferResolvable | Stream;
	public name: string;
	public content_type?: string | null;
	public description?: string | null;

	public constructor(attachment: BufferResolvable | Stream, name: string) {
		this.attachment = attachment;
		/**
		 * The name of this attachment
		 * @type {?string}
		 */
		this.name = name;
	}

	/**
	 * Sets the description of this attachment.
	 * @param {string} description The description of the file
	 */
	public setDescription(description: string) {
		this.description = description;
		return this;
	}

	/**
	 * Sets the file of this attachment.
	 * @param {BufferResolvable|Stream} attachment The file
	 * @param {string} [name] The name of the file, if any
	 */
	public setFile(attachment: BufferResolvable | Stream, name: string) {
		this.attachment = attachment;
		this.name = name;
		return this;
	}

	/**
	 * Sets the name of this attachment.
	 * @param {string} name The name of the file
	 */
	public setName(name: string) {
		this.name = name;
		return this;
	}

	/**
	 * Sets whether this attachment is a spoiler
	 * @param {boolean} [spoiler=true] Whether the attachment should be marked as a spoiler
	 */
	public setSpoiler(spoiler = true) {
		if (spoiler === this.spoiler) return this;

		if (!spoiler) {
			while (this.spoiler) {
				this.name = this.name.slice('SPOILER_'.length);
			}
			return this;
		}
		this.name = `SPOILER_${this.name}`;
		return this;
	}

	/**
	 * Whether or not this attachment has been marked as a spoiler
	 * @type {boolean}
	 * @readonly
	 */
	public get spoiler() {
		if (this.name) return this.name.startsWith('SPOILER_');
		return false;
	}

	public toJSON() {
		const JSONAttachment = {
			filename: this.name,
			description: this.description,
			url: this.attachment,
		};

		return JSONAttachment;
	}
}

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
