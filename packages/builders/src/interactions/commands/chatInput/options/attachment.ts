import {
	ApplicationCommandOptionType,
	type APIApplicationCommandAttachmentOption,
	type FileUploadType,
} from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../../../util/normalizeArray.js';
import { attachmentOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';
import type { ApplicationCommandOptionBaseData } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command attachment option.
 */
export class ChatInputCommandAttachmentOption extends ApplicationCommandOptionBase {
	/**
	 * @internal
	 */
	protected static override readonly predicate = attachmentOptionPredicate;

	/**
	 * @internal
	 */
	declare protected readonly data: ApplicationCommandOptionBaseData &
		Partial<Pick<APIApplicationCommandAttachmentOption, 'file_types'>>;

	/**
	 * Creates a new attachment option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Attachment);
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
		this.data.file_types = normalizeArray(fileTypes);
		return this;
	}

	/**
	 * Clears the file types allowed for this attachment option.
	 */
	public clearFileTypes() {
		this.data.file_types = undefined;
		return this;
	}
}
