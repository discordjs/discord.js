import { ApplicationCommandOptionType, type APIApplicationCommandUserOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command user option.
 */
export class SlashCommandUserOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public readonly type = ApplicationCommandOptionType.User as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandUserOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
