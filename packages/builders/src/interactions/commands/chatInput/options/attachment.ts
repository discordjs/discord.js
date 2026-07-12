import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { attachmentOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command attachment option.
 */
export class ChatInputCommandAttachmentOption extends ApplicationCommandOptionBase {
	/**
	 * @internal
	 */
	protected static override readonly predicate = attachmentOptionPredicate;

	/**
	 * Creates a new attachment option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Attachment);
	}
}
