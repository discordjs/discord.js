import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { channelOptionPredicate } from '../Assertions.js';
import { ApplicationCommandOptionChannelTypesMixin } from '../mixins/ApplicationCommandOptionChannelTypesMixin.js';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

/**
 * A chat input command channel option.
 */
export class ChatInputCommandChannelOption extends Mixin(
	ApplicationCommandOptionBase,
	ApplicationCommandOptionChannelTypesMixin,
) {
	protected static override readonly predicate = channelOptionPredicate;

	public constructor() {
		super(ApplicationCommandOptionType.Channel);
	}
}
