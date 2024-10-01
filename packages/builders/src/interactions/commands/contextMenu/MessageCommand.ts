import { ApplicationCommandType, type RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../../util/validation.js';
import { messageCommandPredicate } from './Assertions.js';
import { ContextMenuCommandBuilder } from './ContextMenuCommand.js';

export class MessageContextCommandBuilder extends ContextMenuCommandBuilder {
	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		const data = { ...structuredClone(this.data), type: ApplicationCommandType.Message };

		if (validationOverride ?? isValidationEnabled()) {
			messageCommandPredicate.parse(data);
		}

		return data as RESTPostAPIContextMenuApplicationCommandsJSONBody;
	}
}
