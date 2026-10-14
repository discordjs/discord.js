import type { APIAttachment, AttachmentFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { AttachmentFlagsBitField } from '../bitfields/AttachmentFlagsBitField.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kClipCreatedAt, kData } from '../utils/symbols.js';
import { isFieldSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an attachment on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `Application` which needs to be instantiated and stored by an extending class using it
 * @remarks intentionally does not export `clipParticipants` so that extending classes can resolve `Snowflake[]` to `User[]`
 */
export class Attachment<Omitted extends keyof APIAttachment | '' = 'clip_created_at'> extends Structure<
	APIAttachment,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each Attachment.
	 */
	public static override readonly DataTemplate: Partial<APIAttachment> = {
		set clip_created_at(_: string) {},
	};

	/**
	 * Optimized storage of {@link discord-api-types/v10#(APIAttachment:interface).clip_created_at}
	 *
	 * @internal
	 */
	protected [kClipCreatedAt]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIAttachment, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIAttachment>) {
		if (data.clip_created_at) {
			this[kClipCreatedAt] = Date.parse(data.clip_created_at);
		}
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
	 * The description (alt text) for the file
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
	 * The height of the file (if image or video)
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * The width of the file (if image or video)
	 */
	public get width() {
		return this[kData].width;
	}

	/**
	 * ThumbHash placeholder (if image or video)
	 */
	public get placeholder() {
		return this[kData].placeholder;
	}

	/**
	 * Version of the placeholder (if image or video)
	 */
	public get placeholderVersion() {
		return this[kData].placeholder_version;
	}

	/**
	 * Whether this attachment is ephemeral
	 */
	public get ephemeral() {
		return this[kData].ephemeral;
	}

	/**
	 * The duration of the audio file (currently for voice messages)
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
		return isFieldSet(this[kData], 'flags', 'number')
			? new AttachmentFlagsBitField(this[kData].flags as AttachmentFlags)
			: null;
	}

	/**
	 * For clips, when the clip was created
	 */
	public get clipCreatedAt() {
		return this[kClipCreatedAt];
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kClipCreatedAt]) {
			clone.clip_created_at = dateToDiscordISOTimestamp(new Date(this[kClipCreatedAt]));
		}

		return clone;
	}
}
