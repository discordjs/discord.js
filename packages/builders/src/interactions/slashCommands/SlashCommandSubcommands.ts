import {
	APIApplicationCommandSubcommandGroupOption,
	APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { assertReturnOfBuilder, validateMaxOptionsLength, validateRequiredParameters } from './Assertions';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase';
import { SharedNameAndDescription } from './mixins/NameAndDescription';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions';

/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
 */
@mix(SharedNameAndDescription)
export class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
	/**
	 * The name of this subcommand group
	 */
	public readonly name: string = undefined!;

	/**
	 * The description of this subcommand group
	 */
	public readonly description: string = undefined!;

	/**
	 * The subcommands part of this subcommand group
	 */
	public readonly options: SlashCommandSubcommandBuilder[] = [];

	/**
	 * Adds a new subcommand to this group
	 *
	 * @param input - A function that returns a subcommand builder, or an already built builder
	 */
	public addSubcommand(
		input:
			| SlashCommandSubcommandBuilder
			| ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder),
	) {
		const { options } = this;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const result = typeof input === 'function' ? input(new SlashCommandSubcommandBuilder()) : input;

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);

		// Push it
		options.push(result);

		return this;
	}

	public toJSON(): APIApplicationCommandSubcommandGroupOption {
		validateRequiredParameters(this.name, this.description, this.options);

		return {
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: this.name,
			name_localizations: this.name_localizations,
			description: this.description,
			description_localizations: this.description_localizations,
			options: this.options.map((option) => option.toJSON()),
		};
	}
}

export interface SlashCommandSubcommandGroupBuilder extends SharedNameAndDescription {}

/**
 * Represents a subcommand
 *
 * For more information, go to https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
 */
@mix(SharedNameAndDescription, SharedSlashCommandOptions)
export class SlashCommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
	/**
	 * The name of this subcommand
	 */
	public readonly name: string = undefined!;

	/**
	 * The description of this subcommand
	 */
	public readonly description: string = undefined!;

	/**
	 * The options of this subcommand
	 */
	public readonly options: ApplicationCommandOptionBase[] = [];

	public toJSON(): APIApplicationCommandSubcommandOption {
		validateRequiredParameters(this.name, this.description, this.options);

		return {
			type: ApplicationCommandOptionType.Subcommand,
			name: this.name,
			name_localizations: this.name_localizations,
			description: this.description,
			description_localizations: this.description_localizations,
			options: this.options.map((option) => option.toJSON()),
		};
	}
}

export interface SlashCommandSubcommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions<false> {}
