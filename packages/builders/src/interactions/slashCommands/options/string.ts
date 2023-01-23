import { s } from '@sapphire/shapeshift';
import { ApplicationCommandOptionType, type APIApplicationCommandStringOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';

const minLengthValidator = s.number.greaterThanOrEqual(0).lessThanOrEqual(6_000);
const maxLengthValidator = s.number.greaterThanOrEqual(1).lessThanOrEqual(6_000);

@mix(ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandStringOption extends ApplicationCommandOptionBase {
	public readonly type = ApplicationCommandOptionType.String as const;

	public readonly maxLength?: number;

	public readonly minLength?: number;

	/**
	 * Sets the maximum length of this string option.
	 *
	 * @param max - The maximum length this option can be
	 */
	public setMaxLength(max: number): this {
		maxLengthValidator.parse(max);

		Reflect.set(this, 'maxLength', max);

		return this;
	}

	/**
	 * Sets the minimum length of this string option.
	 *
	 * @param min - The minimum length this option can be
	 */
	public setMinLength(min: number): this {
		minLengthValidator.parse(min);

		Reflect.set(this, 'minLength', min);

		return this;
	}

	public toJSON(): APIApplicationCommandStringOption {
		this.runRequiredValidations();

		if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this };
	}
}

export interface SlashCommandStringOption extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<string> {}
