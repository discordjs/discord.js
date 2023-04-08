import type { APIApplicationCommandAttachmentOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandAttachmentOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandAttachmentOption> = {
		type: ApplicationCommandOptionType.Attachment,
	};

	public toJSON(): APIApplicationCommandAttachmentOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
