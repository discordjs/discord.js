import type {
	APIApplicationCommandOption,
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
} from './Assertions.js';
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommandSubcommands.js';
import { SharedNameAndDescription } from './mixins/NameAndDescription.js';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions.js';

@mix(SharedSlashCommandOptions, SharedNameAndDescription<SlashCommandBuilder>)
export class SlashCommandBuilder {
	public readonly data: Partial<RESTPostAPIChatInputApplicationCommandsJSONBody> = {};

	/**
	 * Returns the final data that should be sent to Discord.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		validateRequiredParameters(this.data);

		validateLocalizationMap(this.data.name_localizations);
		validateLocalizationMap(this.data.description_localizations);

		return {
			...this.data,
			name: this.data.name!,
			description: this.data.description!,
		};
	}

	/**
	 * Sets whether the command is enabled by default when the application is added to a guild.
	 *
	 * @remarks
	 * If set to `false`, you will have to later `PUT` the permissions for this command.
	 * @param value - Whether or not to enable this command by default
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 * @deprecated Use {@link (SlashCommandBuilder:class).setDefaultMemberPermissions} or {@link (SlashCommandBuilder:class).setDMPermission} instead.
	 */
	public setDefaultPermission(value: boolean) {
		// Assert the value matches the conditions
		validateDefaultPermission(value);

		this.data.default_permission = value;

		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run the command.
	 *
	 * @remarks
	 * You can set this to `'0'` to disable the command by default.
	 * @param permissions - The permissions bit field to set
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 */
	public setDefaultMemberPermissions(permissions: Permissions | bigint | number | null | undefined) {
		// Assert the value and parse it
		const permissionValue = validateDefaultMemberPermissions(permissions);

		this.data.default_member_permissions = permissionValue;

		return this;
	}

	/**
	 * Sets if the command is available in DMs with the application, only for globally-scoped commands.
	 * By default, commands are visible.
	 *
	 * @param enabled - If the command should be enabled in DMs
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 */
	public setDMPermission(enabled: boolean | null | undefined) {
		// Assert the value matches the conditions
		validateDMPermission(enabled);

		this.data.dm_permission = enabled ?? undefined;

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
		if (!('options' in this.data)) this.data.options = [];
		const { options } = this.data;

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
		if (!('options' in this.data)) this.data.options = [];
		const { options } = this.data;

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

export interface SlashCommandBuilder extends SharedNameAndDescription<SlashCommandBuilder>, SharedSlashCommandOptions {}

export interface SlashCommandSubcommandsOnlyBuilder
	extends Omit<SlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>> {}

export interface SlashCommandOptionsOnlyBuilder
	extends SharedNameAndDescription<SlashCommandBuilder>,
		SharedSlashCommandOptions,
		Pick<SlashCommandBuilder, 'toJSON'> {
	data: Partial<RESTPostAPIChatInputApplicationCommandsJSONBody>;
}

export interface ToAPIApplicationCommandOptions {
	toJSON(): APIApplicationCommandOption;
}
