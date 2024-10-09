import { ApplicationCommandType, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { validate } from '../../../util/validation.js';
import { CommandBuilder } from '../Command.js';
import { SharedNameAndDescription } from '../SharedNameAndDescription.js';
import { chatInputCommandPredicate } from './Assertions.js';
import { SharedChatInputCommandOptions } from './mixins/SharedChatInputCommandOptions.js';
import { SharedChatInputCommandSubcommands } from './mixins/SharedSubcommands.js';

/**
 * A builder that creates API-compatible JSON data for chat input commands.
 *
 * @mixes CommandBuilder<RESTPostAPIChatInputApplicationCommandsJSONBody>
 * @mixes SharedChatInputCommandOptions
 * @mixes SharedNameAndDescription
 * @mixes SharedChatInputCommandSubcommands
 */
export class ChatInputCommandBuilder extends Mixin(
	CommandBuilder<RESTPostAPIChatInputApplicationCommandsJSONBody>,
	SharedChatInputCommandOptions,
	SharedNameAndDescription,
	SharedChatInputCommandSubcommands,
) {
	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): RESTPostAPIChatInputApplicationCommandsJSONBody {
		const { options, ...rest } = this.data;

		const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
			...structuredClone(rest as Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'options'>),
			type: ApplicationCommandType.ChatInput,
			options: options?.map((option) => option.toJSON(validationOverride)),
		};

		validate(chatInputCommandPredicate, data, validationOverride);

		return data;
	}
}
