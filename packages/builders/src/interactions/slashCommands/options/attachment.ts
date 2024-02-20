import { ApplicationCommandOptionType, type APIApplicationCommandAttachmentOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

/**
 * A slash command attachment option.
 */
export class SlashCommandAttachmentOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public override readonly type = ApplicationCommandOptionType.Attachment as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandAttachmentOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
