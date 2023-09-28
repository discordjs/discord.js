import { ApplicationCommandOptionType, type APIApplicationCommandChannelOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionChannelTypesMixin } from '../mixins/ApplicationCommandOptionChannelTypesMixin.js';

/**
 * A slash command channel option.
 */
@mix(ApplicationCommandOptionChannelTypesMixin)
export class SlashCommandChannelOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public override readonly type = ApplicationCommandOptionType.Channel as const;

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandChannelOption {
		this.runRequiredValidations();

		return { ...this };
	}
}

export interface SlashCommandChannelOption extends ApplicationCommandOptionChannelTypesMixin {}
