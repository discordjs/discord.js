import { ApplicationCommandOptionType, type APIApplicationCommandStringOption } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { z } from 'zod';
import { parse } from '../../../util/validation.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithAutocompleteMixin.js';
import { ApplicationCommandOptionWithChoicesMixin } from '../mixins/ApplicationCommandOptionWithChoicesMixin.js';

const minLengthValidator = z.number().min(0).max(6_000);
const maxLengthValidator = z.number().min(1).max(6_000);

/**
 * A slash command string option.
 */
@mix(ApplicationCommandOptionWithAutocompleteMixin, ApplicationCommandOptionWithChoicesMixin)
export class SlashCommandStringOption extends ApplicationCommandOptionBase {
	/**
	 * The type of this option.
	 */
	public readonly type = ApplicationCommandOptionType.String as const;

	/**
	 * The maximum length of this option.
	 */
	public readonly max_length?: number;

	/**
	 * The minimum length of this option.
	 */
	public readonly min_length?: number;

	/**
	 * Sets the maximum length of this string option.
	 *
	 * @param max - The maximum length this option can be
	 */
	public setMaxLength(max: number): this {
		parse(maxLengthValidator, max);

		Reflect.set(this, 'max_length', max);

		return this;
	}

	/**
	 * Sets the minimum length of this string option.
	 *
	 * @param min - The minimum length this option can be
	 */
	public setMinLength(min: number): this {
		parse(minLengthValidator, min);

		Reflect.set(this, 'min_length', min);

		return this;
	}

	/**
	 * {@inheritDoc ApplicationCommandOptionBase.toJSON}
	 */
	public toJSON(): APIApplicationCommandStringOption {
		this.runRequiredValidations();

		if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		return { ...this } as APIApplicationCommandStringOption;
	}
}

export interface SlashCommandStringOption
	extends ApplicationCommandOptionWithChoicesMixin<string>,
		ApplicationCommandOptionWithAutocompleteMixin {}
