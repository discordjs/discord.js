import {
	ApplicationCommandOptionType,
	type APIApplicationCommandSubcommandGroupOption,
	type APIApplicationCommandSubcommandOption,
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { assertReturnOfBuilder, validateMaxOptionsLength, validateRequiredParameters } from './Assertions.js';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder.js';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase.js';
import { SharedNameAndDescription } from './mixins/NameAndDescription.js';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions.js';

/**
 * Represents a folder for subcommands.
 *
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups}
 */
@mix(SharedNameAndDescription)
export class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
	/**
	 * The name of this subcommand group.
	 */
	public readonly name: string = undefined!;

	/**
	 * The description of this subcommand group.
	 */
	public readonly description: string = undefined!;

	/**
	 * The subcommands within this subcommand group.
	 */
	public readonly options: SlashCommandSubcommandBuilder[] = [];

	/**
	 * Adds a new subcommand to this group.
	 *
	 * @param input - A function that returns a subcommand builder or an already built builder
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

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
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
 * A builder that creates API-compatible JSON data for slash command subcommands.
 *
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups}
 */
@mix(SharedNameAndDescription, SharedSlashCommandOptions)
export class SlashCommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
	/**
	 * The name of this subcommand.
	 */
	public readonly name: string = undefined!;

	/**
	 * The description of this subcommand.
	 */
	public readonly description: string = undefined!;

	/**
	 * The options within this subcommand.
	 */
	public readonly options: ApplicationCommandOptionBase[] = [];

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
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
