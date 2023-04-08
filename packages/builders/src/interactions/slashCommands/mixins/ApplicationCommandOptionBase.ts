import type { APIApplicationCommandBasicOption } from 'discord-api-types/v10';
import { validateRequired } from '../Assertions.js';
import { SharedNameAndDescription } from './NameAndDescription.js';

export abstract class ApplicationCommandOptionBase extends SharedNameAndDescription {
	public override readonly data: Partial<APIApplicationCommandBasicOption> = {};

	/**
	 * Marks the option as required
	 *
	 * @param required - If this option should be required
	 */
	public setRequired(required: boolean) {
		// Assert that you actually passed a boolean
		validateRequired(required);

		this.data.required = required;

		return this;
	}

	public abstract toJSON(): APIApplicationCommandBasicOption;
}
