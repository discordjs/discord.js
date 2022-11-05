import type { APIApplicationCommandUserOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandUserOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandUserOption> = { type: ApplicationCommandOptionType.User };

	public toJSON(): APIApplicationCommandUserOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
