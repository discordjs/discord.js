import { s } from '@sapphire/shapeshift';
import { ApplicationCommandOptionType, type APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../../util/normalizeArray.js';
import { localizationMapPredicate, validateChoicesLength } from '../Assertions.js';

const stringPredicate = s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100);
const numberPredicate = s.number.greaterThan(Number.NEGATIVE_INFINITY).lessThan(Number.POSITIVE_INFINITY);
const choicesPredicate = s.object({
	name: stringPredicate,
	name_localizations: localizationMapPredicate,
	value: s.union(stringPredicate, numberPredicate),
}).array;

/**
 * This mixin holds choices and autocomplete symbols used for options.
 */
export class ApplicationCommandOptionWithChoicesMixin<ChoiceType extends number | string> {
	/**
	 * The choices of this option.
	 */
	public readonly choices?: APIApplicationCommandOptionChoice<ChoiceType>[];

	/**
	 * The type of this option.
	 *
	 * @privateRemarks Since this is present and this is a mixin, this is needed.
	 */
	public readonly type!: ApplicationCommandOptionType;

	/**
	 * Adds multiple choices to this option.
	 *
	 * @param choices - The choices to add
	 */
	public addChoices(...choices: RestOrArray<APIApplicationCommandOptionChoice<ChoiceType>>): this {
		const normalizedChoices = normalizeArray(choices);
		if (normalizedChoices.length > 0 && 'autocomplete' in this && this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(normalizedChoices);

		if (this.choices === undefined) {
			Reflect.set(this, 'choices', []);
		}

		validateChoicesLength(normalizedChoices.length, this.choices);

		for (const { name, name_localizations, value } of normalizedChoices) {
			// Validate the value
			if (this.type === ApplicationCommandOptionType.String) {
				stringPredicate.parse(value);
			} else {
				numberPredicate.parse(value);
			}

			this.choices!.push({ name, name_localizations, value });
		}

		return this;
	}

	/**
	 * Sets multiple choices for this option.
	 *
	 * @param choices - The choices to set
	 */
	public setChoices<Input extends APIApplicationCommandOptionChoice<ChoiceType>>(...choices: RestOrArray<Input>): this {
		const normalizedChoices = normalizeArray(choices);
		if (normalizedChoices.length > 0 && 'autocomplete' in this && this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(normalizedChoices);

		Reflect.set(this, 'choices', []);
		this.addChoices(normalizedChoices);

		return this;
	}
}
