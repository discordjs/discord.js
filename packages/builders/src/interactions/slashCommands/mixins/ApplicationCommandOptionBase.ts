import type { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { validateRequiredParameters, validateRequired, validateLocalizationMap } from '../Assertions.js';
import { SharedNameAndDescription } from './NameAndDescription.js';

/**
 * The base application command option builder that contains common symbols for application command builders.
 */
export abstract class ApplicationCommandOptionBase extends SharedNameAndDescription {
	/**
	 * The type of this option.
	 */
	public abstract readonly type: ApplicationCommandOptionType;

	/**
	 * Whether this option is required.
	 *
	 * @defaultValue `false`
	 */
	public readonly required: boolean = false;

	/**
	 * Sets whether this option is required.
	 *
	 * @param required - Whether this option should be required
	 */
	public setRequired(required: boolean) {
		// Assert that you actually passed a boolean
		validateRequired(required);

		Reflect.set(this, 'required', required);

		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public abstract toJSON(): APIApplicationCommandBasicOption;

	/**
	 * This method runs required validators on this builder.
	 */
	protected runRequiredValidations() {
		validateRequiredParameters(this.name, this.description, []);

		// Validate localizations
		validateLocalizationMap(this.name_localizations);
		validateLocalizationMap(this.description_localizations);

		// Assert that you actually passed a boolean
		validateRequired(this.required);
	}
}
