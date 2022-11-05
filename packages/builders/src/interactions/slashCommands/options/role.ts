import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { APIApplicationCommandRoleOption } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandRoleOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandRoleOption> = { type: ApplicationCommandOptionType.Role };

	public toJSON(): APIApplicationCommandRoleOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
