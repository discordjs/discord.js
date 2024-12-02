import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../../../util/normalizeArray.js';

// Unlike other places, we're not `Pick`ing from discord-api-types. The union includes `[]` and it breaks everything.
export interface ApplicationCommandOptionWithChoicesData {
	choices?: APIApplicationCommandOptionChoice<number | string>[];
}

/**
 * This mixin holds choices and autocomplete symbols used for options.
 */
export class ApplicationCommandOptionWithChoicesMixin<ChoiceType extends number | string> {
	protected declare readonly data: ApplicationCommandOptionWithChoicesData;

	/**
	 * Adds multiple choices to this option.
	 *
	 * @param choices - The choices to add
	 */
	public addChoices(...choices: RestOrArray<APIApplicationCommandOptionChoice<ChoiceType>>): this {
		const normalizedChoices = normalizeArray(choices);

		this.data.choices ??= [];
		this.data.choices.push(...normalizedChoices);

		return this;
	}

	/**
	 * Sets multiple choices for this option.
	 *
	 * @param choices - The choices to set
	 */
	public setChoices(...choices: RestOrArray<APIApplicationCommandOptionChoice<ChoiceType>>): this {
		this.data.choices = normalizeArray(choices);
		return this;
	}
}
