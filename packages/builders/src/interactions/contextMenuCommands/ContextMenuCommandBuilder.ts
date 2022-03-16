import { validateRequiredParameters, validateName, validateType, validateDefaultPermission } from './Assertions';
import type { ApplicationCommandType, RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export class ContextMenuCommandBuilder {
	/**
	 * The name of this context menu command
	 */
	public readonly name: string = undefined!;

	/**
	 * The type of this context menu command
	 */
	public readonly type: ContextMenuCommandType = undefined!;

	/**
	 * Whether the command is enabled by default when the app is added to a guild
	 *
	 * @default true
	 */
	public readonly defaultPermission: boolean | undefined = undefined;

	/**
	 * Sets the name
	 *
	 * @param name The name
	 */
	public setName(name: string) {
		// Assert the name matches the conditions
		validateName(name);

		Reflect.set(this, 'name', name);

		return this;
	}

	/**
	 * Sets the type
	 *
	 * @param type The type
	 */
	public setType(type: ContextMenuCommandType) {
		// Assert the type is valid
		validateType(type);

		Reflect.set(this, 'type', type);

		return this;
	}

	/**
	 * Sets whether the command is enabled by default when the application is added to a guild.
	 *
	 * **Note**: If set to `false`, you will have to later `PUT` the permissions for this command.
	 *
	 * @param value Whether or not to enable this command by default
	 *
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 */
	public setDefaultPermission(value: boolean) {
		// Assert the value matches the conditions
		validateDefaultPermission(value);

		Reflect.set(this, 'defaultPermission', value);

		return this;
	}

	/**
	 * Returns the final data that should be sent to Discord.
	 *
	 * **Note:** Calling this function will validate required properties based on their conditions.
	 */
	public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		validateRequiredParameters(this.name, this.type);
		return {
			name: this.name,
			type: this.type,
			default_permission: this.defaultPermission,
		};
	}
}

export type ContextMenuCommandType = ApplicationCommandType.User | ApplicationCommandType.Message;
