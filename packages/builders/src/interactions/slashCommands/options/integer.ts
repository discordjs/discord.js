import { APIApplicationCommandIntegerOption, ApplicationCommandOptionType } from 'discord-api-types/v9';
import { mix } from 'ts-mixer';
import { z } from 'zod';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin';

const numberValidator = z.number().int().nonnegative();

@mix(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandIntegerOption
	extends ApplicationCommandOptionBase
	implements ApplicationCommandNumericOptionMinMaxValueMixin
{
	public readonly type = ApplicationCommandOptionType.Integer as const;

	public setMaxValue(max: number): this {
		numberValidator.parse(max);

		Reflect.set(this, 'max_value', max);

		return this;
	}

	public setMinValue(min: number): this {
		numberValidator.parse(min);

		Reflect.set(this, 'min_value', min);

		return this;
	}

	public toJSON(): APIApplicationCommandIntegerOption {
		this.runRequiredValidations();

		if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this };
	}
}

export interface SlashCommandIntegerOption
	extends ApplicationCommandNumericOptionMinMaxValueMixin,
		ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {}
