import type { APIAttachment, AttachmentFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { AttachmentFlagsBitField } from '../bitfields/AttachmentFlagsBitField.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export class Attachment<Omitted extends keyof APIAttachment | '' = ''> extends Structure<APIAttachment, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Attachment.
	 */
	public static override readonly DataTemplate: Partial<APIAttachment> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIAttachment, Omitted>) {
		super(data);
	}

	/**
	 * The id of the attachment
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the attached file
	 */
	public get filename() {
		return this[kData].filename;
	}

	/**
	 * The title of the file
	 */
	public get title() {
		return this[kData].title;
	}

	/**
	 * The description for the file
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The attachment's media type
	 */
	public get contentType() {
		return this[kData].content_type;
	}

	/**
	 * The size of the file in bytes
	 */
	public get size() {
		return this[kData].size;
	}

	/**
	 * The source URL of the file
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * A proxied URL of the file
	 */
	public get proxyURL() {
		return this[kData].proxy_url;
	}

	/**
	 * The height of the file (if image)
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * The width of the file (if image)
	 */
	public get width() {
		return this[kData].width;
	}

	/**
	 * Whether this attachment is ephemeral
	 */
	public get ephemeral() {
		return this[kData].ephemeral;
	}

	/**
	 * The duration of the audio file
	 */
	public get durationSecs() {
		return this[kData].duration_secs;
	}

	/**
	 * Base64 encoded bytearray representing a sampled waveform
	 */
	public get waveform() {
		return this[kData].waveform;
	}

	/**
	 * Attachment flags combined as a bitfield
	 */
	public get flags() {
		return 'flags' in this[kData] && typeof this[kData].flags === 'number'
			? new AttachmentFlagsBitField(this[kData].flags as AttachmentFlags)
			: null;
	}
}
