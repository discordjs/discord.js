import { APIApplicationCommandOptionChoice, ApplicationCommandOptionType } from 'discord-api-types/v9';
import { z } from 'zod';
import { validateMaxChoicesLength } from '../Assertions';

const stringPredicate = z.string().min(1).max(100);
const numberPredicate = z.number().gt(-Infinity).lt(Infinity);
const choicesPredicate = z
	.object({ name: stringPredicate, value: z.union([stringPredicate, numberPredicate]) })
	.array();
const booleanPredicate = z.boolean();

export class ApplicationCommandOptionWithChoicesAndAutocompleteMixin<T extends string | number> {
	public readonly choices?: APIApplicationCommandOptionChoice<T>[];
	public readonly autocomplete?: boolean;

	// Since this is present and this is a mixin, this is needed
	public readonly type!: ApplicationCommandOptionType;

	/**
	 * Adds a choice for this option
	 *
	 * @param choice The choice to add
	 */
	public addChoice(choice: APIApplicationCommandOptionChoice<T>): this {
		const { name, value } = choice;
		if (this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		if (this.choices === undefined) {
			Reflect.set(this, 'choices', []);
		}

		validateMaxChoicesLength(this.choices!);

		// Validate name
		stringPredicate.parse(name);

		// Validate the value
		if (this.type === ApplicationCommandOptionType.String) {
			stringPredicate.parse(value);
		} else {
			numberPredicate.parse(value);
		}

		this.choices!.push({ name, value });

		return this;
	}

	/**
	 * Adds multiple choices for this option
	 *
	 * @param choices The choices to add
	 */
	public addChoices(...choices: APIApplicationCommandOptionChoice<T>[]): this {
		if (this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(choices);

		for (const entry of choices) this.addChoice(entry);
		return this;
	}

	public setChoices<Input extends APIApplicationCommandOptionChoice<T>[]>(...choices: Input): this {
		if (choices.length > 0 && this.autocomplete) {
			throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
		}

		choicesPredicate.parse(choices);

		Reflect.set(this, 'choices', []);
		for (const entry of choices) this.addChoice(entry);

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
