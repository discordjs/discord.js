import type { APIAttachment, AttachmentFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { AttachmentFlagsBitField } from '../bitfields/AttachmentFlagsBitField.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export class Attachment<Omitted extends keyof APIAttachment | '' = ''> extends Structure<APIAttachment, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Connection
	 */
	public static override DataTemplate: Partial<APIAttachment> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIAttachment, Omitted>) {
		super(data);
	}

	public get id() {
		return this[kData].id;
	}

	public get filename() {
		return this[kData].filename;
	}

	public get title() {
		return this[kData].title;
	}

	public get description() {
		return this[kData].description;
	}

	public get contentType() {
		return this[kData].content_type;
	}

	public get size() {
		return this[kData].size;
	}

	public get url() {
		return this[kData].url;
	}

	public get proxyURL() {
		return this[kData].proxy_url;
	}

	public get height() {
		return this[kData].height;
	}

	public get width() {
		return this[kData].width;
	}

	public get ephemeral() {
		return this[kData].ephemeral;
	}

	public get durationSecs() {
		return this[kData].duration_secs;
	}

	public get waveform() {
		return this[kData].waveform;
	}

	public get flags() {
		const flags = this[kData].flags;
		return flags ? new AttachmentFlagsBitField(this[kData].flags as AttachmentFlags) : null;
	}
}
