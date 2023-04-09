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

@mix(SharedSlashCommandOptions, SharedNameAndDescription)
export class SlashCommandBuilder {
	/**
	 * The name of this slash command
	 */
	public readonly name: string = undefined!;

	/**
	 * The localized names for this command
	 */
	public readonly name_localizations?: LocalizationMap;

	/**
	 * The description of this slash command
	 */
	public readonly description: string = undefined!;

	/**
	 * The localized descriptions for this command
	 */
	public readonly description_localizations?: LocalizationMap;

	/**
	 * The options of this slash command
	 */
	public readonly options: ToAPIApplicationCommandOptions[] = [];

	/**
	 * Whether the command is enabled by default when the app is added to a guild
	 *
	 * @deprecated This property is deprecated and will be removed in the future.
	 * You should use {@link SlashCommandBuilder.setDefaultMemberPermissions} or {@link SlashCommandBuilder.setDMPermission} instead.
	 */
	public readonly default_permission: boolean | undefined = undefined;

	/**
	 * Set of permissions represented as a bit set for the command
	 */
	public readonly default_member_permissions: Permissions | null | undefined = undefined;

	/**
	 * Indicates whether the command is available in DMs with the application, only for globally-scoped commands.
	 * By default, commands are visible.
	 */
	public readonly dm_permission: boolean | undefined = undefined;

	/**
	 * Whether this command is NSFW
	 */
	public readonly nsfw: boolean | undefined = undefined;

	/**
	 * Returns the final data that should be sent to Discord.
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
	 * Sets if the command is available in DMs with the application, only for globally-scoped commands.
	 * By default, commands are visible.
	 *
	 * @param enabled - If the command should be enabled in DMs
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDMPermission(enabled: boolean | null | undefined) {
		// Assert the value matches the conditions
		validateDMPermission(enabled);

		Reflect.set(this, 'dm_permission', enabled);

		return this;
	}

	/**
	 * Sets whether this command is NSFW
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
	 * Adds a new subcommand group to this command
	 *
	 * @param input - A function that returns a subcommand group builder, or an already built builder
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
	 * @param input - A function that returns a subcommand builder, or an already built builder
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
	extends Omit<SlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>> {}

export interface SlashCommandOptionsOnlyBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandOptions,
		Pick<SlashCommandBuilder, 'toJSON'> {}

export interface ToAPIApplicationCommandOptions {
	toJSON(): APIApplicationCommandOption;
}
