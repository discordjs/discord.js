import type { APIApplicationCommandOption, RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { mix } from 'ts-mixer';
import {
	assertReturnOfBuilder,
	validateDefaultPermission,
	validateMaxOptionsLength,
	validateRequiredParameters,
} from './Assertions';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions';
import { SharedNameAndDescription } from './mixins/NameAndDescription';
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands';

@mix(SharedSlashCommandOptions, SharedNameAndDescription)
export class SlashCommandBuilder {
	/**
	 * The name of this slash command
	 */
	public readonly name: string = undefined!;

	/**
	 * The description of this slash command
	 */
	public readonly description: string = undefined!;

	/**
	 * The options of this slash command
	 */
	public readonly options: ToAPIApplicationCommandOptions[] = [];

	/**
	 * Whether the command is enabled by default when the app is added to a guild
	 *
	 * @default true
	 */
	public readonly defaultPermission: boolean | undefined = undefined;

	/**
	 * Returns the final data that should be sent to Discord.
	 *
	 * **Note:** Calling this function will validate required properties based on their conditions.
	 */
	public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		validateRequiredParameters(this.name, this.description, this.options);

		return {
			name: this.name,
			description: this.description,
			options: this.options.map((option) => option.toJSON()),
			default_permission: this.defaultPermission,
		};
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
	 * Adds a new subcommand group to this command
	 *
	 * @param input A function that returns a subcommand group builder, or an already built builder
	 */
	public addSubcommandGroup(
		input:
			| SlashCommandSubcommandGroupBuilder
			| ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder),
	): SlashCommandSubcommandsOnlyBuilder {
		const { options } = this;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		const result = typeof input === 'function' ? input(new SlashCommandSubcommandGroupBuilder()) : input;

		assertReturnOfBuilder(result, SlashCommandSubcommandGroupBuilder);

		// Push it
		options.push(result);

		return this;
	}

	/**
	 * Adds a new subcommand to this command
	 *
	 * @param input A function that returns a subcommand builder, or an already built builder
	 */
	public addSubcommand(
		input:
			| SlashCommandSubcommandBuilder
			| ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder),
	): SlashCommandSubcommandsOnlyBuilder {
		const { options } = this;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		const result = typeof input === 'function' ? input(new SlashCommandSubcommandBuilder()) : input;

		assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);

		// Push it
		options.push(result);

		return this;
	}
}

export interface SlashCommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions {}

export interface SlashCommandSubcommandsOnlyBuilder
	extends SharedNameAndDescription,
		Pick<SlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup'> {}

export interface SlashCommandOptionsOnlyBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandOptions,
		Pick<SlashCommandBuilder, 'toJSON'> {}

export interface ToAPIApplicationCommandOptions {
	toJSON: () => APIApplicationCommandOption;
}
