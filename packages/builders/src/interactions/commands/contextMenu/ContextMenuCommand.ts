import type { ApplicationCommandType, RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { CommandBuilder } from '../Command.js';
import { SharedName } from '../SharedName.js';

/**
 * The type a context menu command can be.
 */
export type ContextMenuCommandType = ApplicationCommandType.Message | ApplicationCommandType.User;

/**
 * A builder that creates API-compatible JSON data for context menu commands.
 */
export abstract class ContextMenuCommandBuilder extends Mixin(
	CommandBuilder<RESTPostAPIContextMenuApplicationCommandsJSONBody>,
	SharedName,
) {
	protected override readonly data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody>;

	public constructor(data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody> = {}) {
		super();
		this.data = structuredClone(data);
	}

	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public abstract override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody;
}
