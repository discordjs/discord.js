import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command attachment option.
 */
export class ChatInputCommandAttachmentOption extends ApplicationCommandOptionBase {
	/**
	 * Creates a new attachment option from API data.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Attachment);
	}
}
