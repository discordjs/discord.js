import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command boolean option.
 */
export class ChatInputCommandBooleanOption extends ApplicationCommandOptionBase {
	public constructor() {
		super(ApplicationCommandOptionType.Boolean);
	}
}
