import type { APIApplicationCommandChannelOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionChannelTypesMixin } from '../mixins/ApplicationCommandOptionChannelTypesMixin.js';

@mix(ApplicationCommandOptionChannelTypesMixin)
export class SlashCommandChannelOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandChannelOption> = {};

	public toJSON(): APIApplicationCommandChannelOption {
		validateOptionParameters(this.data);

		return { ...this.data };
	}
}

export interface SlashCommandChannelOption extends ApplicationCommandOptionChannelTypesMixin {}
