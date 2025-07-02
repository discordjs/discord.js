import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command role option.
 */
export class ChatInputCommandRoleOption extends ApplicationCommandOptionBase {
	/**
	 * Creates a new role option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Role);
	}
}
