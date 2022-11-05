import type { APIApplicationCommandRoleOption } from 'discord-api-types/v10';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';

export class SlashCommandRoleOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandRoleOption> = {};

	public toJSON(): APIApplicationCommandRoleOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}
