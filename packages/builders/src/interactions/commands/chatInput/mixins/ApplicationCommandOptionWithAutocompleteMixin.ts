import type {
	APIApplicationCommandIntegerOption,
	APIApplicationCommandNumberOption,
	APIApplicationCommandStringOption,
} from 'discord-api-types/v10';

export type AutocompletableOptions =
	| APIApplicationCommandIntegerOption
	| APIApplicationCommandNumberOption
	| APIApplicationCommandStringOption;

export interface ApplicationCommandOptionWithAutocompleteData extends Pick<AutocompletableOptions, 'autocomplete'> {}

/**
 * This mixin holds choices and autocomplete symbols used for options.
 */
export class ApplicationCommandOptionWithAutocompleteMixin {
	protected declare readonly data: ApplicationCommandOptionWithAutocompleteData;

	/**
	 * Whether this option uses autocomplete.
	 *
	 * @param autocomplete - Whether this option should use autocomplete
	 */
	public setAutocomplete(autocomplete = true): this {
		this.data.autocomplete = autocomplete;
		return this;
	}
}
