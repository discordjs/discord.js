import { APIApplicationCommandUserOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class SlashCommandUserOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.User as const;

	public toJSON(): APIApplicationCommandUserOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
