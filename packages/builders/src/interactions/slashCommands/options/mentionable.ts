import { APIApplicationCommandMentionableOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class SlashCommandMentionableOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.Mentionable as const;

	public toJSON(): APIApplicationCommandMentionableOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
