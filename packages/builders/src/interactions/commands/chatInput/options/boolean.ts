import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command boolean option.
 */
export class ChatInputCommandBooleanOption extends ApplicationCommandOptionBase {
	/**
	 * Creates a new boolean option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Boolean);
	}
}
