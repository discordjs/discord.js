import { s } from '@sapphire/shapeshift';
import type { ApplicationCommandOptionType } from 'discord-api-types/v10';

const booleanPredicate = s.boolean;

/**
 * This mixin holds choices and autocomplete symbols used for options.
 */
export class ApplicationCommandOptionWithAutocompleteMixin {
	/**
	 * Whether this option utilizes autocomplete.
	 */
	public readonly autocomplete?: boolean;

	/**
	 * The type of this option.
	 *
	 * @privateRemarks Since this is present and this is a mixin, this is needed.
	 */
	public readonly type!: ApplicationCommandOptionType;

	/**
	 * Whether this option uses autocomplete.
	 *
	 * @param autocomplete - Whether this option should use autocomplete
	 */
	public setAutocomplete(autocomplete: boolean): this {
		// Assert that you actually passed a boolean
		booleanPredicate.parse(autocomplete);

		if (autocomplete && 'choices' in this && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		Reflect.set(this, 'autocomplete', autocomplete);

		return this;
	}
}
