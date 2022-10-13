import { ApplicationCommandOptionType, type APIApplicationCommandRoleOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandRoleOption extends ApplicationCommandOptionBase {
	public override readonly type = ApplicationCommandOptionType.Role as const;

	public toJSON(): APIApplicationCommandRoleOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
