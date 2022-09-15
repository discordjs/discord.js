import { ApplicationCommandOptionType, type APIApplicationCommandMentionableOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandMentionableOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.Mentionable as const;

	public toJSON(): APIApplicationCommandMentionableOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
