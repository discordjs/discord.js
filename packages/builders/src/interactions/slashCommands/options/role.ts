import { APIApplicationCommandRoleOption, ApplicationCommandOptionType } from 'discord-api-types/v9';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class SlashCommandRoleOption extends ApplicationCommandOptionBase {
	public override readonly type = ApplicationCommandOptionType.Role as const;

	public toJSON(): APIApplicationCommandRoleOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
