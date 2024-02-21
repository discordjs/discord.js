import { ApplicationCommandOptionType, type APIApplicationCommandMentionableOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command mentionable option.
 */
export class SlashCommandMentionableOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public readonly type = ApplicationCommandOptionType.Mentionable as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandMentionableOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
