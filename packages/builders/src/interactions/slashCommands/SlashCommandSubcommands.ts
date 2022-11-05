import {
	ApplicationCommandOptionType,
	type APIApplicationCommandSubcommandGroupOption,
	type APIApplicationCommandSubcommandOption,
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';
import { assertReturnOfBuilder, validateMaxOptionsLength, validateRequiredParameters } from './Assertions.js';
import type { SlashCommandBuilder, ToAPIApplicationCommandOptions } from './SlashCommandBuilder.js';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase.js';
import { SharedNameAndDescription } from './mixins/NameAndDescription.js';
import { SharedSlashCommandOptions } from './mixins/SharedSlashCommandOptions.js';

/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
 */
@mix(SharedNameAndDescription<SlashCommandBuilder>)
export class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
	public readonly data: Partial<APIApplicationCommandSubcommandGroupOption> = {};

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
		if (!('options' in this.data)) Reflect.set(this.data, 'options', []);
		const { options } = this.data;

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
		validateRequiredParameters(this.data);

		return {
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: this.data.name!,
			name_localizations: this.data.name_localizations,
			description: this.data.description!,
			description_localizations: this.data.description_localizations,
			options: this.data.options,
		};
	}
}

export interface SlashCommandSubcommandGroupBuilder
	extends SharedNameAndDescription<APIApplicationCommandSubcommandGroupOption> {}

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
		validateRequiredParameters(this.data);

		return {
			type: ApplicationCommandOptionType.Subcommand,
			name: this.name,
			name_localizations: this.data.name_localizations,
			description: this.description,
			description_localizations: this.data.description_localizations,
			options: this.options.map((option) => option.toJSON()),
		};
	}
}

export interface SlashCommandSubcommandBuilder
	extends SharedNameAndDescription<SlashCommandBuilder>,
		SharedSlashCommandOptions<false> {}
