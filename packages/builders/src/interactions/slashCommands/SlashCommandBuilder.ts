import type { APIApplicationCommandOption, LocalizationMap, Permissions } from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { SharedNameAndDescription } from './mixins/NameAndDescription.js';
import { SharedSlashCommand } from './mixins/SharedSlashCommand.js';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions.js';
import { SharedSlashCommandSubcommands } from './mixins/SharedSubcommands.js';

/**
 * A builder that creates API-compatible JSON data for slash commands.
 */
@mix(SharedSlashCommandOptions, SharedNameAndDescription, SharedSlashCommandSubcommands, SharedSlashCommand)
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
	 * @deprecated Use {@link SharedSlashCommand.setDefaultMemberPermissions} or {@link SharedSlashCommand.setDMPermission} instead.
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
}

export interface SlashCommandBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>,
		SharedSlashCommandSubcommands<SlashCommandSubcommandsOnlyBuilder>,
		SharedSlashCommand {}

/**
 * An interface specifically for slash command subcommands.
 */
export interface SlashCommandSubcommandsOnlyBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandSubcommands<SlashCommandSubcommandsOnlyBuilder>,
		SharedSlashCommand {}

/**
 * An interface specifically for slash command options.
 */
export interface SlashCommandOptionsOnlyBuilder
	extends SharedNameAndDescription,
		SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>,
		SharedSlashCommand {}

/**
 * An interface that ensures the `toJSON()` call will return something
 * that can be serialized into API-compatible data.
 */
export interface ToAPIApplicationCommandOptions {
	toJSON(): APIApplicationCommandOption;
}
