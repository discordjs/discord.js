import type { APIApplicationCommandBooleanOption } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandBooleanOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandBooleanOption> = {};

	public toJSON(): APIApplicationCommandBooleanOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
