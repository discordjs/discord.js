import { APIApplicationCommandBooleanOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class SlashCommandBooleanOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.Boolean as const;

	public toJSON(): APIApplicationCommandBooleanOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
