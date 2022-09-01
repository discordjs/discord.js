import { ApplicationCommandOptionType, type APIApplicationCommandAttachmentOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandAttachmentOption extends ApplicationCommandOptionBase {
	public override readonly type = ApplicationCommandOptionType.Attachment as const;

	public toJSON(): APIApplicationCommandAttachmentOption {
		this.runRequiredValidations();

		return { ...this };
	}
}
