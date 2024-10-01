import { ApplicationCommandOptionType, type APIApplicationCommandStringOption } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { stringOptionPredicate } from '../Assertions.js';
import type { ApplicationCommandOptionWithAutocompleteData } from '../mixins/ApplicationCommandOptionWithAutocompleteMixin.js';
import { ApplicationCommandOptionWithAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithAutocompleteMixin.js';
import type { ApplicationCommandOptionWithChoicesData } from '../mixins/ApplicationCommandOptionWithChoicesMixin.js';
import { ApplicationCommandOptionWithChoicesMixin } from '../mixins/ApplicationCommandOptionWithChoicesMixin.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';
import type { ApplicationCommandOptionBaseData } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command string option.
 */
export class ChatInputCommandStringOption extends Mixin(
	ApplicationCommandOptionBase,
	ApplicationCommandOptionWithAutocompleteMixin,
	ApplicationCommandOptionWithChoicesMixin<string>,
) {
	protected static override readonly predicate = stringOptionPredicate;

	protected declare readonly data: ApplicationCommandOptionBaseData &
		ApplicationCommandOptionWithAutocompleteData &
		ApplicationCommandOptionWithChoicesData &
		Partial<Pick<APIApplicationCommandStringOption, 'max_length' | 'min_length'>>;

	public constructor() {
		super(ApplicationCommandOptionType.String);
	}

	/**
	 * Sets the maximum length of this string option.
	 *
	 * @param max - The maximum length this option can be
	 */
	public setMaxLength(max: number): this {
		this.data.max_length = max;
		return this;
	}

	/**
	 * Clears the maximum length of this string option.
	 */
	public clearMaxLength(): this {
		this.data.max_length = undefined;
		return this;
	}

	/**
	 * Sets the minimum length of this string option.
	 *
	 * @param min - The minimum length this option can be
	 */
	public setMinLength(min: number): this {
		this.data.min_length = min;
		return this;
	}

	/**
	 * Clears the minimum length of this string option.
	 */
	public clearMinLength(): this {
		this.data.min_length = undefined;
		return this;
	}
}
