import { ApplicationCommandOptionType, type APIApplicationCommandBooleanOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command boolean option.
 */
export class SlashCommandBooleanOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public readonly type = ApplicationCommandOptionType.Boolean as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandBooleanOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
