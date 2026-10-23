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
 *
 * @mixes {@link CommandBuilder}\<{@link discord-api-types/v10#(RESTPostAPIContextMenuApplicationCommandsJSONBody:interface)}\>
 * @mixes {@link SharedName}
 */
export abstract class ContextMenuCommandBuilder extends Mixin(
	CommandBuilder<RESTPostAPIContextMenuApplicationCommandsJSONBody>,
	SharedName,
) {
	/**
	 * The API data associated with this context menu command.
	 *
	 * @internal
	 */
	protected override readonly data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody>;

	/**
	 * Creates a new context menu command.
	 *
	 * @param data - The API data to create this context menu command with
	 */
	public constructor(data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody> = {}) {
		super();
		this.data = structuredClone(data);
	}

	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public abstract override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody;
}
