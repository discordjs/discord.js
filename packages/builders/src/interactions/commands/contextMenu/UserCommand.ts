import { ApplicationCommandType, type RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { validate } from '../../../util/validation.js';
import { userCommandPredicate } from './Assertions.js';
import { ContextMenuCommandBuilder } from './ContextMenuCommand.js';

/**
 * A builder that creates API-compatible JSON data for user context menu commands.
 */
export class UserContextCommandBuilder extends ContextMenuCommandBuilder {
	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const data = { ...structuredClone(this.data), type: ApplicationCommandType.User };
		validate(userCommandPredicate, data, validationOverride);

		return data as RESTPostAPIContextMenuApplicationCommandsJSONBody;
	}
}
