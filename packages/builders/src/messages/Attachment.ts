import type { JSONEncodable } from '@discordjs/util';
import type { RESTAPIAttachment, Snowflake } from 'discord-api-types/v10';
import { Refineable } from '../mixins/Refineable.js';
import { validate } from '../util/validation.js';
import { attachmentPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for attachments.
 */
export class AttachmentBuilder extends Refineable implements JSONEncodable<RESTAPIAttachment> {
	/**
	 * The API data associated with this attachment.
	 */
	private readonly data: Partial<RESTAPIAttachment>;

	/**
	 * Creates a new attachment builder.
	 *
	 * @param attachment - The attachment to build from
	 */
	public constructor(attachment: Partial<RESTAPIAttachment> = {}) {
		super();
		this.data = { ...structuredClone(attachment) };
	}

	/**
	 * Sets the id of the attachment.
	 *
	 * @param id - The id of the attachment
	 */
	public setId(id: Snowflake): this {
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
