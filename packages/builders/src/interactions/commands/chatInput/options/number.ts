import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { numberOptionPredicate } from '../Assertions.js';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
import { ApplicationCommandOptionWithAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithAutocompleteMixin.js';
import { ApplicationCommandOptionWithChoicesMixin } from '../mixins/ApplicationCommandOptionWithChoicesMixin.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command number option.
 *
 * @mixes {@link ApplicationCommandOptionBase}
 * @mixes {@link ApplicationCommandNumericOptionMinMaxValueMixin}
 * @mixes {@link ApplicationCommandOptionWithAutocompleteMixin}
 * @mixes {@link ApplicationCommandOptionWithChoicesMixin}\<number\>
 */
export class ChatInputCommandNumberOption extends Mixin(
	ApplicationCommandOptionBase,
	ApplicationCommandNumericOptionMinMaxValueMixin,
	ApplicationCommandOptionWithAutocompleteMixin,
	ApplicationCommandOptionWithChoicesMixin<number>,
) {
	/**
	 * @internal
	 */
	protected static override readonly predicate = numberOptionPredicate;

	/**
	 * Creates a new number option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Number);
	}
}
