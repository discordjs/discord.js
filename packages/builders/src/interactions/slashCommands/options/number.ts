import { s } from '@sapphire/shapeshift';
import { ApplicationCommandOptionType, type APIApplicationCommandNumberOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';

const numberValidator = s.number;

@mix(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandNumberOption
	extends ApplicationCommandOptionBase
	implements ApplicationCommandNumericOptionMinMaxValueMixin
{
	public readonly type = ApplicationCommandOptionType.Number as const;

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMaxValue}
	 */
	public setMaxValue(max: number | null): this {
		numberValidator.parse(max);

		Reflect.set(this, 'max_value', max ?? undefined);

		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMinValue}
	 */
	public setMinValue(min: number | null): this {
		numberValidator.parse(min);

		Reflect.set(this, 'min_value', min ?? undefined);

		return this;
	}

	public toJSON(): APIApplicationCommandNumberOption {
		this.runRequiredValidations();

		if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this };
	}
}

export interface SlashCommandNumberOption
	extends ApplicationCommandNumericOptionMinMaxValueMixin,
		ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {}
