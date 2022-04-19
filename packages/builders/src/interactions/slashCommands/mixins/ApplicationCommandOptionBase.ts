import type { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { SharedNameAndDescription } from './NameAndDescription';
import { validateRequiredParameters, validateRequired } from '../Assertions';

export abstract class ApplicationCommandOptionBase extends SharedNameAndDescription {
	public abstract readonly type: ApplicationCommandOptionType;

	public readonly required: boolean = false;

	/**
	 * Marks the option as required
	 *
	 * @param required If this option should be required
	 */
	public setRequired(required: boolean) {
		// Assert that you actually passed a boolean
		validateRequired(required);

		Reflect.set(this, 'required', required);

		return this;
	}

	public abstract toJSON(): APIApplicationCommandBasicOption;

	protected runRequiredValidations() {
		validateRequiredParameters(this.name, this.description, []);

		// Assert that you actually passed a boolean
		validateRequired(this.required);
	}
}
