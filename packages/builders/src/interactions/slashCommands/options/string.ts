import { s } from '@sapphire/shapeshift';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { APIApplicationCommandStringOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { validateOptionParameters } from '../Assertions.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';

const minLengthValidator = s.number.greaterThanOrEqual(0).lessThanOrEqual(6_000);
const maxLengthValidator = s.number.greaterThanOrEqual(1).lessThanOrEqual(6_000);

@mix(ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class SlashCommandStringOption extends ApplicationCommandOptionBase {
	public override readonly data: Partial<APIApplicationCommandStringOption> = {
		type: ApplicationCommandOptionType.String,
	};

	/**
	 * Sets the maximum length of this string option.
	 *
	 * @param max - The maximum length this option can be
	 */
	public setMaxLength(max: number): this {
		maxLengthValidator.parse(max);

		this.data.max_length = max;

		return this;
	}

	/**
	 * Sets the minimum length of this string option.
	 *
	 * @param min - The minimum length this option can be
	 */
	public setMinLength(min: number): this {
		minLengthValidator.parse(min);

		this.data.min_length = min;

		return this;
	}

	public toJSON(): APIApplicationCommandStringOption {
		validateOptionParameters(this.data);

		if (Reflect.get(this.data, 'autocomplete') && Reflect.get(this.data, 'choices')?.length) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this.data };
	}
}

export interface SlashCommandStringOption extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<string> {}
