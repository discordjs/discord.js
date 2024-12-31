import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command attachment option.
 */
export class ChatInputCommandAttachmentOption extends ApplicationCommandOptionBase {
	public constructor() {
		super(ApplicationCommandOptionType.Attachment);
	}
}
