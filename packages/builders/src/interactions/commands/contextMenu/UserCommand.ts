import { ApplicationCommandType, type RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../../util/validation.js';
import { userCommandPredicate } from './Assertions.js';
import { ContextMenuCommandBuilder } from './ContextMenuCommand.js';

export class UserContextCommandBuilder extends ContextMenuCommandBuilder {
	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const data = { ...structuredClone(this.data), type: ApplicationCommandType.User };

		if (validationOverride ?? isValidationEnabled()) {
			userCommandPredicate.parse(data);
		}

		return data as RESTPostAPIContextMenuApplicationCommandsJSONBody;
	}
}
