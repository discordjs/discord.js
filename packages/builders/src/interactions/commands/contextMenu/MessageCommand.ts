import { ApplicationCommandType, type RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { validate } from '../../../util/validation.js';
import { messageCommandPredicate } from './Assertions.js';
import { ContextMenuCommandBuilder } from './ContextMenuCommand.js';

/**
 * A builder that creates API-compatible JSON data for message context menu commands.
 */
export class MessageContextCommandBuilder extends ContextMenuCommandBuilder {
	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const data = { ...structuredClone(this.data), type: ApplicationCommandType.Message };
		validate(messageCommandPredicate, data, validationOverride);

		return data as RESTPostAPIContextMenuApplicationCommandsJSONBody;
	}
}
