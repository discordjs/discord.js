import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { roleOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command role option.
 */
export class ChatInputCommandRoleOption extends ApplicationCommandOptionBase {
	/**
	 * @internal
	 */
	protected static override readonly predicate = roleOptionPredicate;

	/**
	 * Creates a new role option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Role);
	}
}
