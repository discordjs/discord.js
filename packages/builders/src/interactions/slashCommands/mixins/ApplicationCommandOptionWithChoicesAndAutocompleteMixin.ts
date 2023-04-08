import { s } from '@sapphire/shapeshift';
import type { APIApplicationCommandBasicOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType, type APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { assertAutocomplete, assertChoices, localizationMapPredicate, validateChoicesLength } from '../Assertions.js';

const stringPredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100);
const numberPredicate = s.number.greaterThan(Number.NEGATIVE_INFINITY).lessThan(Number.POSITIVE_INFINITY);
const choicesPredicate = s.object({
	name: stringPredicate,
	name_localizations: localizationMapPredicate,
	value: s.union(stringPredicate, numberPredicate),
}).array;
const booleanPredicate = s.boolean;

export class ApplicationCommandOptionWithChoicesAndAutocompleteMixin<T extends number | string> {
	public readonly data: Partial<APIApplicationCommandBasicOption> = {};

	/**
	 * Adds multiple choices for this option
	 *
	 * @param choices - The choices to add
	 */
	public addChoices(...choices: APIApplicationCommandOptionChoice<T>[]): this {
		if (choices.length > 0 && 'autocomplete' in this.data && this.data.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(choices);
		assertChoices(this.data);

		validateChoicesLength(choices.length, this.data.choices);

		for (const { name, name_localizations, value } of choices) {
			// Validate the value
			if (this.data.type === ApplicationCommandOptionType.String) {
				stringPredicate.parse(value);
			} else {
				numberPredicate.parse(value);
			}

			this.data.choices!.push({ name, name_localizations, value });
		}

		return this;
	}

	public setChoices<Input extends APIApplicationCommandOptionChoice<T>[]>(...choices: Input): this {
		if (choices.length > 0 && 'autocomplete' in this.data && this.data.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		assertChoices(this.data);
		choicesPredicate.parse(choices);

		this.data.choices = [];
		this.addChoices(...choices);

		return this;
	}

	/**
	 * Marks the option as autocompletable
	 *
	 * @param autocomplete - If this option should be autocompletable
	 */
	public setAutocomplete(autocomplete: boolean): this {
		// Assert that you actually passed a boolean
		booleanPredicate.parse(autocomplete);

		if (autocomplete && 'choices' in this.data && Array.isArray(this.data.choices) && this.data.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		assertAutocomplete(this.data);
		this.data.autocomplete = autocomplete;

		return this;
	}
}
