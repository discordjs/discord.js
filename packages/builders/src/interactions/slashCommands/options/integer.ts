import { s } from '@sapphire/shapeshift';
import type { APIApplicationCommandIntegerOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';

const numberValidator = s.number.int;

@mix(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandIntegerOption
	extends ApplicationCommandOptionBase
	implements ApplicationCommandNumericOptionMinMaxValueMixin
{
	public override readonly data: Partial<APIApplicationCommandIntegerOption> = {};

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMaxValue}
	 */
	public setMaxValue(max: number): this {
		numberValidator.parse(max);

		Reflect.set(this.data, 'max_value', max);

		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandNumericOptionMinMaxValueMixin.setMinValue}
	 */
	public setMinValue(min: number): this {
		numberValidator.parse(min);

		Reflect.set(this.data, 'min_value', min);

		return this;
	}

	public toJSON(): APIApplicationCommandIntegerOption {
		validateOptionParameters(this.data);
		if (Reflect.get(this.data, 'autocomplete') && Reflect.get(this.data, 'choices')?.length) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this.data };
	}
}

export interface SlashCommandIntegerOption
	extends ApplicationCommandNumericOptionMinMaxValueMixin,
		ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {}
