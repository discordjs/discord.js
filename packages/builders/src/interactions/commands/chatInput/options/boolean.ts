import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { booleanOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command boolean option.
 */
export class ChatInputCommandBooleanOption extends ApplicationCommandOptionBase {
	/**
	 * @internal
	 */
	protected static override readonly predicate = booleanOptionPredicate;

	/**
	 * Creates a new boolean option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Boolean);
	}
}
