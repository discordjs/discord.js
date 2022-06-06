import { APIApplicationCommandStringOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin';

@mix(ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandStringOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.String as const;

	public toJSON(): APIApplicationCommandStringOption {
		this.runRequiredValidations();

		if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this };
	}
}

export interface SlashCommandStringOption extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<string> {}
