import type { APIAttachment, Snowflake } from 'discord-api-types/v10';
import type { Stream } from 'node:stream';

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
	public id: Snowflake;
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
		this.name = `SPOILER_${this.name}`;
		return this;
	}

	_patch(_data: APIAttachment) {
		/**
		 * The attachment's id
		 * @type {Snowflake}
		 */
		this.id = _data.id;

		if ('size' in _data) {
			/**
			 * The size of this attachment in bytes
			 * @type {number}
			 */
			this.size = _data.size;
		}

		if ('url' in _data) {
			/**
			 * The URL to this attachment
			 * @type {string}
			 */
			this.url = _data.url;
		}

		if ('proxy_url' in _data) {
			/**
			 * The Proxy URL to this attachment
			 * @type {string}
			 */
			this.proxyURL = _data.proxy_url;
		}

		if ('height' in _data) {
			/**
			 * The height of this attachment (if an image or video)
			 * @type {?number}
			 */
			this.height = _data.height;
		} else {
			this.height ??= null;
		}

		if ('width' in _data) {
			/**
			 * The width of this attachment (if an image or video)
			 * @type {?number}
			 */
			this.width = _data.width;
		} else {
			this.width ??= null;
		}

		if ('content_type' in _data) {
			/**
			 * The media type of this attachment
			 * @type {?string}
			 */
			this.contentType = _data.content_type;
		} else {
			this.contentType ??= null;
		}

		if ('description' in _data) {
			/**
			 * The description (alt text) of this attachment
			 * @type {?string}
			 */
			this.description = _data.description;
		} else {
			this.description ??= null;
		}

		/**
		 * Whether this attachment is ephemeral
		 * @type {boolean}
		 */
		this.ephemeral = _data.ephemeral ?? false;
	}

	/**
     * Whether or not this attachment has been marked as a spoiler
     * @type {boolean}
     * @readonly
     */
	get spoiler() {
		if(this.name) return this.name.startsWith('SPOILER_');
		return false;
	}

	public toJSON() {
		return {
			...this.data,
		} as APIAttachment;
	}
}

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
