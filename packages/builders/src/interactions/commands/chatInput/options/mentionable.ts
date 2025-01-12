import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command mentionable option.
 */
export class ChatInputCommandMentionableOption extends ApplicationCommandOptionBase {
	public constructor() {
		super(ApplicationCommandOptionType.Mentionable);
	}
}
