import { s } from '@sapphire/shapeshift';
import { ApplicationCommandOptionType, type APIApplicationCommandIntegerOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';

const numberValidator = s.number.int;

/**
 * A slash command integer option.
 */
@mix(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandIntegerOption
	extends ApplicationCommandOptionBase
	implements ApplicationCommandNumericOptionMinMaxValueMixin
{
	/**
	 * The type of this option.
	 */
	public readonly type = ApplicationCommandOptionType.Integer as const;

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMaxValue}
	 */
	public setMaxValue(max: number): this {
		numberValidator.parse(max);

		Reflect.set(this, 'max_value', max);

		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMinValue}
	 */
	public setMinValue(min: number): this {
		numberValidator.parse(min);

		Reflect.set(this, 'min_value', min);

		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
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
