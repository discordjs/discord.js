import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command user option.
 */
export class ChatInputCommandUserOption extends ApplicationCommandOptionBase {
	/**
	 * Creates a new user option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.User);
	}
}
