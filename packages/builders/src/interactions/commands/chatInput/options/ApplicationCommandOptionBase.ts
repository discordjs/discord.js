import type { JSONEncodable } from '@discordjs/util';
import type {
	APIApplicationCommandBasicOption,
	APIApplicationCommandOption,
	ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { z } from 'zod';
import { validate } from '../../../../util/validation.js';
import type { SharedNameAndDescriptionData } from '../../SharedNameAndDescription.js';
import { SharedNameAndDescription } from '../../SharedNameAndDescription.js';
import { basicOptionPredicate } from '../Assertions.js';

export interface ApplicationCommandOptionBaseData extends Partial<Pick<APIApplicationCommandOption, 'required'>> {
	type: ApplicationCommandOptionType;
}

/**
 * The base application command option builder that contains common symbols for application command builders.
 */
export abstract class ApplicationCommandOptionBase
	extends SharedNameAndDescription
	implements JSONEncodable<APIApplicationCommandBasicOption>
{
	protected static readonly predicate: z.ZodTypeAny = basicOptionPredicate;

	protected declare readonly data: ApplicationCommandOptionBaseData & SharedNameAndDescriptionData;

	public constructor(type: ApplicationCommandOptionType) {
		super();
		this.data.type = type;
	}

	/**
	 * Sets whether this option is required.
	 *
	 * @param required - Whether this option should be required
	 */
	public setRequired(required = true) {
		this.data.required = required;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIApplicationCommandBasicOption {
		const clone = structuredClone(this.data);
		validate((this.constructor as typeof ApplicationCommandOptionBase).predicate, clone, validationOverride);

		return clone as APIApplicationCommandBasicOption;
	}
}
