import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { SlashCommandOptionBase } from '../mixins/CommandOptionBase';

export class SlashCommandAttachmentOption extends SlashCommandOptionBase {
	public override readonly type = ApplicationCommandOptionType.Attachment as const;

	public constructor() {
		super(ApplicationCommandOptionType.Attachment);
	}
}