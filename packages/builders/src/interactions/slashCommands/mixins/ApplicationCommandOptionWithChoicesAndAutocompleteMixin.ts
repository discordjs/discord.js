import { APIApplicationCommandOptionChoice, ApplicationCommandOptionType } from 'discord-api-types/v9';
import { s } from '@sapphire/shapeshift';
import { validateChoicesLength } from '../Assertions';

const stringPredicate = s.string.lengthGe(1).lengthLe(100);
const numberPredicate = s.number.gt(-Infinity).lt(Infinity);
// TODO: after v2
// @ts-expect-error
const choicesPredicate = s.object({ name: stringPredicate, value: s.union(stringPredicate, numberPredicate) }).array;
const booleanPredicate = s.boolean;

export class ApplicationCommandOptionWithChoicesAndAutocompleteMixin<T extends string | number> {
	public readonly choices?: APIApplicationCommandOptionChoice<T>[];
	public readonly autocomplete?: boolean;

	// Since this is present and this is a mixin, this is needed
	public readonly type!: ApplicationCommandOptionType;

	/**
	 * Adds multiple choices for this option
	 *
	 * @param choices The choices to add
	 */
	public addChoices(...choices: APIApplicationCommandOptionChoice<T>[]): this {
		if (choices.length > 0 && this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(choices);

		if (this.choices === undefined) {
			Reflect.set(this, 'choices', []);
		}

		validateChoicesLength(choices.length, this.choices);

		for (const { name, value } of choices) {
			// Validate the value
			if (this.type === ApplicationCommandOptionType.String) {
				stringPredicate.parse(value);
			} else {
				numberPredicate.parse(value);
			}

			this.choices!.push({ name, value });
		}

		return this;
	}

	public setChoices<Input extends APIApplicationCommandOptionChoice<T>[]>(...choices: Input): this {
		if (choices.length > 0 && this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(choices);

		Reflect.set(this, 'choices', []);
		this.addChoices(...choices);

		return this;
	}

	/**
	 * Marks the option as autocompletable
	 * @param autocomplete If this option should be autocompletable
	 */
	public setAutocomplete(autocomplete: boolean): this {
		// Assert that you actually passed a boolean
		booleanPredicate.parse(autocomplete);

		if (autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		Reflect.set(this, 'autocomplete', autocomplete);

		return this;
	}
}
