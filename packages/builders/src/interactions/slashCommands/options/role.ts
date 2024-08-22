import { ApplicationCommandOptionType, type APIApplicationCommandRoleOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command role option.
 */
export class SlashCommandRoleOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public override readonly type = ApplicationCommandOptionType.Role as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandRoleOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
