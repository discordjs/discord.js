import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { channelOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionChannelTypesMixin } from '../mixins/ApplicationCommandOptionChannelTypesMixin.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command channel option.
 *
 * @mixes {@link ApplicationCommandOptionBase}
 * @mixes {@link ApplicationCommandOptionChannelTypesMixin}
 */
export class ChatInputCommandChannelOption extends Mixin(
	ApplicationCommandOptionBase,
	ApplicationCommandOptionChannelTypesMixin,
) {
	/**
	 * @internal
	 */
	protected static override readonly predicate = channelOptionPredicate;

	/**
	 * Creates a new channel option.
	 */
	public constructor() {
		super(ApplicationCommandOptionType.Channel);
	}
}
