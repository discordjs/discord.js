import type { APIApplicationCommandMentionableOption } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandMentionableOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandMentionableOption> = {};

	public toJSON(): APIApplicationCommandMentionableOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
