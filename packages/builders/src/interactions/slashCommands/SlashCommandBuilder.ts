import type {
	APIApplicationCommandOption,
	LocalizationMap,
	Permissions,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import {
	assertReturnOfBuilder,
	validateDefaultMemberPermissions,
	validateDefaultPermission,
	validateLocalizationMap,
	validateDMPermission,
	validateMaxOptionsLength,
	validateRequiredParameters,
	validateNSFW,
} from './Assertions.js';
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands.js';
import { SharedNameAndDescription } from './mixins/NameAndDescription.js';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions.js';

/**
 * A builder that creates API-compatible JSON data for slash commands.
 */
@mix(SharedSlashCommandOptions, SharedNameAndDescription)
export class SlashCommandBuilder {
	/**
	 * The name of this command.
	 */
	public readonly name: string = undefined!;

	/**
	 * The name localizations of this command.
	 */
	public readonly name_localizations?: LocalizationMap;

	/**
	 * The description of this command.
	 */
	public readonly description: string = undefined!;

	/**
	 * The description localizations of this command.
	 */
	public readonly description_localizations?: LocalizationMap;

	/**
	 * The options of this command.
	 */
	public readonly options: ToAPIApplicationCommandOptions[] = [];

	/**
	 * Whether this command is enabled by default when the application is added to a guild.
	 *
	 * @deprecated Use {@link ContextMenuCommandBuilder.setDefaultMemberPermissions} or {@link ContextMenuCommandBuilder.setDMPermission} instead.
	 */
	public readonly default_permission: boolean | undefined = undefined;

	/**
	 * The set of permissions represented as a bit set for the command.
	 */
	public readonly default_member_permissions: Permissions | null | undefined = undefined;

	/**
	 * Indicates whether the command is available in direct messages with the application.
	 *
	 * @remarks
	 * By default, commands are visible. This property is only for global commands.
	 */
	public readonly dm_permission: boolean | undefined = undefined;

	/**
	 * Whether this command is NSFW.
	 */
	public readonly nsfw: boolean | undefined = undefined;

	/**
	 * Sets whether the command is enabled by default when the application is added to a guild.
	 *
	 * @remarks
	 * If set to `false`, you will have to later `PUT` the permissions for this command.
	 * @param value - Whether or not to enable this command by default
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 * @deprecated Use {@link SlashCommandBuilder.setDefaultMemberPermissions} or {@link SlashCommandBuilder.setDMPermission} instead.
	 */
	public setDefaultPermission(value: boolean) {
		// Assert the value matches the conditions
		validateDefaultPermission(value);

		Reflect.set(this, 'default_permission', value);

		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run the command.
	 *
	 * @remarks
	 * You can set this to `'0'` to disable the command by default.
	 * @param permissions - The permissions bit field to set
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDefaultMemberPermissions(permissions: Permissions | bigint | number | null | undefined) {
		// Assert the value and parse it
		const permissionValue = validateDefaultMemberPermissions(permissions);

		Reflect.set(this, 'default_member_permissions', permissionValue);

		return this;
	}

	/**
	 * Sets if the command is available in direct messages with the application.
	 *
	 * @remarks
	 * By default, commands are visible. This method is only for global commands.
	 * @param enabled - Whether the command should be enabled in direct messages
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDMPermission(enabled: boolean | null | undefined) {
		// Assert the value matches the conditions
		validateDMPermission(enabled);

		Reflect.set(this, 'dm_permission', enabled);

		return this;
	}

	/**
	 * Sets whether this command is NSFW.
	 *
	 * @param nsfw - Whether this command is NSFW
	 */
	public setNSFW(nsfw = true) {
		// Assert the value matches the conditions
		validateNSFW(nsfw);
		Reflect.set(this, 'nsfw', nsfw);
		return this;
	}

	/**
	 * Adds a new subcommand group to this command.
	 *
	 * @param input - A function that returns a subcommand group builder or an already built builder
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
	 * Adds a new subcommand to this command.
	 *
	 * @param input - A function that returns a subcommand builder or an already built builder
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

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		validateRequiredParameters(this.name, this.description, this.options);

		validateLocalizationMap(this.name_localizations);
		validateLocalizationMap(this.description_localizations);

		return {
			...this,
			options: this.options.map((option) => option.toJSON()),
		};
	}
}

export interface SlashCommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions {}

/**
 * An interface specifically for slash command subcommands.
 */
export interface SlashCommandSubcommandsOnlyBuilder
	extends Omit<SlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>> {}

/**
 * An interface specifically for slash command options.
 */
export interface SlashCommandOptionsOnlyBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandOptions,
		Pick<SlashCommandBuilder, 'toJSON'> {}

/**
 * An interface that ensures the `toJSON()` call will return something
 * that can be serialized into API-compatible data.
 */
export interface ToAPIApplicationCommandOptions {
	toJSON(): APIApplicationCommandOption;
}
