import { ApplicationCommandType, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { isValidationEnabled } from '../../../util/validation.js';
import { CommandBuilder } from '../Command.js';
import { SharedNameAndDescription } from '../SharedNameAndDescription.js';
import { chatInputCommandPredicate } from './Assertions.js';
import { SharedChatInputCommandOptions } from './mixins/SharedChatInputCommandOptions.js';
import { SharedChatInputCommandSubcommands } from './mixins/SharedSubcommands.js';

/**
 * A builder that creates API-compatible JSON data for chat input commands.
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

		if (validationOverride ?? isValidationEnabled()) {
			chatInputCommandPredicate.parse(data);
		}

		return data;
	}
}
