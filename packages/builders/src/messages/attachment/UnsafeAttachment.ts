import type { Stream } from 'node:stream';
import type { APIAttachment, Snowflake } from 'discord-api-types/v10';

export type BufferResolvable = typeof ArrayBuffer | string;
/**
 * Represents an attachment.
 */
export class UnsafeAttachmentBuilder {
	public readonly data: APIAttachment;
	public attachment: BufferResolvable | Stream;
	public contentType?: string | null;
	public description?: string | null;
	public ephemeral?: boolean;
	public height?: number | null;
	public id!: Snowflake;
	public name: string | null;
	public proxyURL!: string;
	public size!: number;
	public url!: string;
	public width?: number | null;

	/**
	 * @param {APIAttachment} [data] Extra data
	 */
	public constructor(attachment: BufferResolvable | Stream, name = null, _data: APIAttachment) {
		this.data = { ..._data };
		this.attachment = attachment;
		/**
		 * The name of this attachment
		 * @type {?string}
		 */
		this.name = name;
		if (_data) this._patch(_data);
	}

	/**
	 * Sets the description of this attachment.
	 * @param {string} description The description of the file
	 * @returns {Attachment} This attachment
	 */
	public setDescription(description: string) {
		this.description = description;
		return this;
	}

	/**
	 * Sets the file of this attachment.
	 * @param {BufferResolvable|Stream} attachment The file
	 * @param {string} [name] The name of the file, if any
	 * @returns {Attachment} This attachment
	 */
	public setFile(attachment: BufferResolvable | Stream, name: string | null) {
		this.attachment = attachment;
		this.name ? (this.name = name) : (this.name = null);
		return this;
	}

	/**
	 * Sets the name of this attachment.
	 * @param {string} name The name of the file
	 * @returns {Attachment} This attachment
	 */
	public setName(name: string) {
		this.name = name;
		return this;
	}

	/**
	 * Sets whether this attachment is a spoiler
	 * @param {boolean} [spoiler=true] Whether the attachment should be marked as a spoiler
	 * @returns {Attachment} This attachment
	 */
	public setSpoiler(spoiler = true) {
		if (spoiler === this.spoiler) return this;

		if (!spoiler) {
			while (this.spoiler && typeof this.name === 'string') {
				this.name = this.name.slice('SPOILER_'.length);
			}
			return this;
		}
		this.name ? (this.name = `SPOILER_${this.name}`) : (this.name = null);
		return this;
	}

	private _patch(data: APIAttachment) {
		/**
		 * The attachment's id
		 * @type {Snowflake}
		 */
		this.id = data.id;

		if ('size' in data) {
			/**
			 * The size of this attachment in bytes
			 * @type {number}
			 */
			this.size = data.size;
		}

		if ('url' in data) {
			/**
			 * The URL to this attachment
			 * @type {string}
			 */
			this.url = data.url;
		}

		if ('proxy_url' in data) {
			/**
			 * The Proxy URL to this attachment
			 * @type {string}
			 */
			this.proxyURL = data.proxy_url;
		}

		if ('height' in data) {
			/**
			 * The height of this attachment (if an image or video)
			 * @type {?number}
			 */
			this.height = data.height;
		} else {
			this.height ??= null;
		}

		if ('width' in data) {
			/**
			 * The width of this attachment (if an image or video)
			 * @type {?number}
			 */
			this.width = data.width;
		} else {
			this.width ??= null;
		}

		if ('content_type' in data) {
			/**
			 * The media type of this attachment
			 * @type {?string}
			 */
			this.contentType = data.content_type;
		} else {
			this.contentType ??= null;
		}

		if ('description' in data) {
			/**
			 * The description (alt text) of this attachment
			 * @type {?string}
			 */
			this.description = data.description;
		} else {
			this.description ??= null;
		}

		/**
		 * Whether this attachment is ephemeral
		 * @type {boolean}
		 */
		this.ephemeral = data.ephemeral ?? false;
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

	public toJSON(): APIAttachment {
		const JSONAttachment: APIAttachment = {
			...this.data,
		};

		return JSONAttachment;
	}
}

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
